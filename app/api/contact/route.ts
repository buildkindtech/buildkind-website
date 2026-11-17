import { NextRequest, NextResponse } from "next/server";
import { buildNotificationContent, validateContactPayload } from "./contact";

export async function POST(req: NextRequest) {
  let payload: unknown;

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const validation = validateContactPayload(payload);

  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  if (validation.honeypot) {
    return NextResponse.json({ success: true });
  }

  const { name, email } = validation.submission;
  const notification = buildNotificationContent(validation.submission);

  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  if (!SENDGRID_API_KEY) {
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  const body = {
    personalizations: [{ to: [{ email: "info@buildkind.tech" }] }],
    from: { email: "info@buildkind.tech", name: "BuildKind Tech Contact" },
    reply_to: { email, name },
    subject: notification.subject,
    content: [{
      type: "text/html",
      value: notification.html,
    }]
  };

  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${SENDGRID_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
