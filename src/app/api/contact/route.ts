import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/server/db";
import { sendContactEmail } from "@/azure/email/emailSender";

const ContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(150),
  message: z.string().min(20).max(2000),
});

async function getIpHash(req: NextRequest): Promise<string> {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(ip),
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as unknown;
    const parsed = ContactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input.", issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const ipHash = await getIpHash(req);

    // Rate limit: 1 submission per IP per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recent = await db.contactSubmission.count({
      where: { ipHash, submittedAt: { gte: oneHourAgo } },
    });

    if (recent > 0) {
      return NextResponse.json(
        {
          error:
            "You've already sent a message in the last hour. Please try again later.",
        },
        { status: 429 },
      );
    }

    const { name, email, subject, message } = parsed.data;

    // Record submission before sending so retries are also blocked
    await db.contactSubmission.create({ data: { ipHash } });

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="margin:0 0 16px;font-size:20px;color:#111">New contact message — Pioneers in CS</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr>
            <td style="padding:8px 12px;background:#f5f5f5;font-weight:600;width:100px;border:1px solid #e5e5e5">Name</td>
            <td style="padding:8px 12px;border:1px solid #e5e5e5">${name}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;background:#f5f5f5;font-weight:600;border:1px solid #e5e5e5">Email</td>
            <td style="padding:8px 12px;border:1px solid #e5e5e5">${email}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;background:#f5f5f5;font-weight:600;border:1px solid #e5e5e5">Subject</td>
            <td style="padding:8px 12px;border:1px solid #e5e5e5">${subject}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;background:#f5f5f5;font-weight:600;border:1px solid #e5e5e5;vertical-align:top">Message</td>
            <td style="padding:8px 12px;border:1px solid #e5e5e5;white-space:pre-wrap">${message}</td>
          </tr>
        </table>
        <p style="margin:16px 0 0;font-size:12px;color:#888">Sent from pioneers-in-cs.com · Reply-To is set to the sender's email.</p>
      </div>
    `;

    await sendContactEmail({
      senderEmail: email,
      subject: `[Contact] ${subject}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 },
    );
  }
}
