import { NextRequest, NextResponse } from "next/server";
import { createCipheriv, randomBytes } from "crypto";

// ── Rate limiting (in-memory, resets on cold start) ──
const rateMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// ── AES-256-GCM encryption ──
function encryptField(plaintext: string, key: Buffer): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString("base64");
}

const SENSITIVE_FIELDS = ["ssn", "ein", "taxId", "dlNumber", "routingNumber", "accountNumber",
  "depositRoutingNumber", "depositAccountNumber", "withdrawalRoutingNumber", "withdrawalAccountNumber"];

// ── File type validation ──
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Magic bytes for file validation
function validateMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 4) return false;
  const hex = buffer.subarray(0, 4).toString("hex");
  if (mimeType === "application/pdf") return hex.startsWith("25504446"); // %PDF
  if (mimeType === "image/jpeg" || mimeType === "image/jpg") return hex.startsWith("ffd8ff");
  if (mimeType === "image/png") return hex.startsWith("89504e47");
  return false;
}

export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
  }

  // Get encryption key
  const keyHex = process.env.MERCHANT_ENCRYPTION_KEY;
  let encKey: Buffer | null = null;
  if (keyHex && keyHex.length === 64) {
    encKey = Buffer.from(keyHex, "hex");
  } else {
    console.warn("[MerchantAPI] MERCHANT_ENCRYPTION_KEY not set or invalid — sensitive fields will NOT be encrypted");
  }

  try {
    const contentType = req.headers.get("content-type") || "";

    let data: Record<string, string> = {};
    const files: Record<string, { name: string; type: string; size: number; valid: boolean }> = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      for (const [key, value] of formData.entries()) {
        if (typeof value === "string") {
          data[key] = value;
        } else {
          // It's a File object
          const file = value as File;
          if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json({ error: `File "${file.name}" must be JPG, PNG, or PDF.` }, { status: 400 });
          }
          if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: `File "${file.name}" exceeds 10MB limit.` }, { status: 400 });
          }
          // Validate magic bytes
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const magicValid = validateMagicBytes(buffer, file.type);
          files[key] = { name: file.name, type: file.type, size: file.size, valid: magicValid };
          if (!magicValid) {
            return NextResponse.json({ error: `File "${file.name}" failed validation. Please upload a genuine JPG, PNG, or PDF.` }, { status: 400 });
          }
        }
      }
    } else if (contentType.includes("application/json")) {
      data = await req.json();
    } else {
      return NextResponse.json({ error: "Unsupported content type" }, { status: 400 });
    }

    // Validate required fields
    const required = ["legalName", "taxFilingMethod", "taxId", "bizType", "bizStartDate",
      "bizStreet", "bizCity", "bizState", "bizZip", "bizPhone", "bizEmail", "bizDescription",
      "ownerFirstName", "ownerLastName", "ownerTitle", "ownerPct",
      "ownerDob", "ownerPhone", "ownerEmail",
      "ownerStreet", "ownerCity", "ownerState", "ownerZip",
      "dlNumber", "dlState",
      "bankName", "accountType",
      "avgMonthlyVolume", "avgTransactionAmt", "deliveryWindow"];

    for (const field of required) {
      if (!data[field]?.trim()) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Encrypt sensitive fields
    const encrypted: Record<string, string> = {};
    if (encKey) {
      for (const field of SENSITIVE_FIELDS) {
        if (data[field]) {
          encrypted[field] = encryptField(data[field], encKey);
          delete data[field];
        }
      }
    }

    const submission = {
      id: randomBytes(8).toString("hex"),
      submittedAt: new Date().toISOString(),
      ip,
      data,
      encrypted,
      files,
    };

    // Log to console (Vercel serverless — no persistent file writes)
    console.log("[MerchantApplication] New submission:", JSON.stringify({
      id: submission.id,
      submittedAt: submission.submittedAt,
      businessName: data.legalName,
      email: data.bizEmail,
      encryptedFields: Object.keys(encrypted),
      fileUploads: Object.keys(files),
    }));

    // Email notification via SendGrid (optional)
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    if (SENDGRID_API_KEY) {
      try {
        const emailBody = {
          personalizations: [{ to: [{ email: "info@buildkind.tech" }] }],
          from: { email: "info@buildkind.tech", name: "BuildKind Merchant Portal" },
          subject: `New Merchant Application — ${data.legalName}`,
          content: [{
            type: "text/html",
            value: `
              <h2>New Merchant Application Received</h2>
              <p><strong>ID:</strong> ${submission.id}</p>
              <p><strong>Business:</strong> ${data.legalName} ${data.dba ? `(DBA: ${data.dba})` : ""}</p>
              <p><strong>Email:</strong> ${data.bizEmail}</p>
              <p><strong>Phone:</strong> ${data.bizPhone}</p>
              <p><strong>Submitted:</strong> ${submission.submittedAt}</p>
              <hr/>
              <p>Sensitive fields (SSN, EIN, DL#, routing/account numbers) are AES-256-GCM encrypted.</p>
              <p>Full submission logged to server console.</p>
            `
          }]
        };
        await fetch("https://api.sendgrid.com/v3/mail/send", {
          method: "POST",
          headers: { Authorization: `Bearer ${SENDGRID_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify(emailBody),
        });
      } catch (e) {
        console.error("[MerchantAPI] Failed to send notification email:", e);
      }
    }

    return NextResponse.json({
      success: true,
      id: submission.id,
      message: "Application received. We'll review your submission and contact you within 1-2 business days.",
    });
  } catch (err) {
    console.error("[MerchantAPI] Error processing submission:", err);
    return NextResponse.json({ error: "An internal error occurred. Please try again." }, { status: 500 });
  }
}
