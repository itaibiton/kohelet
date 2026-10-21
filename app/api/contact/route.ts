import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const TO_EMAIL = process.env.CONTACT_EMAIL || "info@kohelet.digital";
const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(1).max(5000),
  phone: z.string().trim().max(80).optional(),
  service: z.string().trim().max(160).optional(),
});

export async function POST(request: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const parsed = contactSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please provide a valid name, email, and message" },
        { status: 400 }
      );
    }
    const { name, email, phone, service, message } = parsed.data;

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Kohelet Website <onboarding@resend.dev>",
      to: TO_EMAIL,
      replyTo: email,
      subject: `New Contact: ${name}${service ? ` - ${service}` : ""}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : null,
        service ? `Service: ${service}` : null,
        `\nMessage:\n${message}`,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    if (error || !data?.id) {
      return NextResponse.json({ error: "Unable to send message" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch {
    console.error("Contact form request failed");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
