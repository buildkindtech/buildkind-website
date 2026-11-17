export type ContactSubmission = {
  name: string;
  email: string;
  company: string;
  message: string;
  interest: string;
};

export type ContactValidationResult =
  | { ok: true; honeypot: true }
  | { ok: true; honeypot: false; submission: ContactSubmission }
  | { ok: false; error: string };

const EMAIL_PATTERN = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;

const FIELD_LIMITS = {
  name: 200,
  email: 254,
  company: 200,
  message: 5000,
  interest: 200,
} as const;

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

export function validateContactPayload(payload: unknown): ContactValidationResult {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { ok: false, error: "Invalid request body" };
  }

  const values = payload as Record<string, unknown>;
  const honeypot = values.website === undefined ? "" : values.website;

  if (typeof honeypot !== "string") {
    return { ok: false, error: "Invalid field type" };
  }

  if (honeypot.trim()) {
    return { ok: true, honeypot: true };
  }

  const requiredFields = ["name", "email", "message"] as const;
  const optionalFields = ["company", "interest"] as const;
  const submission = {} as ContactSubmission;

  for (const field of [...requiredFields, ...optionalFields]) {
    const value = values[field] === undefined ? "" : values[field];

    if (typeof value !== "string") {
      return { ok: false, error: "Invalid field type" };
    }

    const trimmed = value.trim();
    if (trimmed.length > FIELD_LIMITS[field]) {
      return { ok: false, error: "Field is too long" };
    }

    submission[field] = trimmed;
  }

  if (requiredFields.some((field) => !submission[field])) {
    return { ok: false, error: "Missing required fields" };
  }

  if (!EMAIL_PATTERN.test(submission.email)) {
    return { ok: false, error: "Invalid email address" };
  }

  return { ok: true, honeypot: false, submission };
}

export function buildNotificationContent(submission: ContactSubmission) {
  const name = escapeHtml(submission.name);
  const email = escapeHtml(submission.email);
  const company = escapeHtml(submission.company);
  const message = escapeHtml(submission.message);
  const interest = escapeHtml(submission.interest || "General");

  return {
    subject: `New Inquiry from ${name}${company ? ` (${company})` : ""} — ${interest}`,
    html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
        <p><strong>Interest:</strong> ${interest}</p>
        <hr/>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
  };
}
