import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email, company, message, interest } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  if (!SENDGRID_API_KEY) {
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  const body = {
    personalizations: [{ to: [{ email: "info@buildkind.tech" }] }],
    from: { email: "info@buildkind.tech", name: "BuildKind Tech Contact" },
    reply_to: { email, name },
    subject: `New Inquiry from ${name}${company ? ` (${company})` : ""} — ${interest || "General"}`,
    content: [{
      type: "text/html",
      value: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
        <p><strong>Interest:</strong> ${interest || "General"}</p>
        <hr/>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `
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
