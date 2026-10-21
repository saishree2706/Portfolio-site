import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(10),
});

type ContactData = z.infer<typeof schema>;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildText(data: ContactData) {
  return [
    `You have a new message from your portfolio contact form.`,
    ``,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Subject: ${data.subject}`,
    ``,
    `Message:`,
    data.message,
    ``,
    `Reply to this email to respond directly to ${data.name}.`,
  ].join("\n");
}

function buildHtml(data: ContactData) {
  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);
  const subject = escapeHtml(data.subject);
  const message = escapeHtml(data.message).replace(/\n/g, "<br/>");
  const received = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1f2937">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:32px 16px">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
            <tr>
              <td style="background:#0f172a;padding:24px 32px">
                <p style="margin:0;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#22d3ee">Portfolio Contact Form</p>
                <h1 style="margin:8px 0 0;font-size:20px;font-weight:600;color:#ffffff">New message from ${name}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 8px">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px">
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;width:90px">Name</td>
                    <td style="padding:6px 0;font-weight:500">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6b7280">Email</td>
                    <td style="padding:6px 0"><a href="mailto:${email}" style="color:#0891b2;text-decoration:none">${email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6b7280">Subject</td>
                    <td style="padding:6px 0;font-weight:500">${subject}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6b7280">Received</td>
                    <td style="padding:6px 0">${received}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 8px">
                <div style="background:#f9fafb;border-left:3px solid #22d3ee;border-radius:6px;padding:16px 20px;font-size:15px;line-height:1.6">${message}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 32px">
                <a href="mailto:${email}?subject=Re:%20${encodeURIComponent(data.subject)}" style="display:inline-block;background:#0891b2;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:10px 20px;border-radius:6px">Reply to ${name}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af">
                Sent from the contact form on your portfolio site. Hitting reply will respond directly to the sender.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: "Saishree Portfolio <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL ?? "your@email.com",
      replyTo: `${data.name} <${data.email}>`,
      subject: `New message from ${data.name}: ${data.subject}`,
      text: buildText(data),
      html: buildHtml(data),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
