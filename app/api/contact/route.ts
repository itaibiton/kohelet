import { NextResponse } from "next/server";
import { Resend } from "resend";

const TO_EMAIL = process.env.CONTACT_EMAIL || "info@kohelet.digital";

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
    const body = await request.json();
    const { name, service, message, business } = body as {
      name?: string;
      email?: string;
      phone?: string;
      contact?: string;
      business?: string;
      service?: string;
      message?: string;
    };

    // The landing form sends a single "contact" field (email or phone);
    // the older form sends "email" (+ optional "phone").
    const rawContact = String(body.contact ?? body.email ?? "").trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawContact);
    const isPhone = /^\+?[\d\s().-]{7,20}$/.test(rawContact);
    const email = isEmail ? rawContact : undefined;
    const phone = isPhone ? rawContact : (body.phone ? String(body.phone) : undefined);

    if (!name || !message || (!email && !phone)) {
      return NextResponse.json(
        { error: "Name, message, and an email or phone are required" },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Kohelet Website <onboarding@resend.dev>",
      to: TO_EMAIL,
      replyTo: email,
      subject: `New Contact: ${name}${business ? ` (${business})` : ""}${service ? ` - ${service}` : ""}`,
      text: [
        `Name: ${name}`,
        business ? `Business: ${business}` : null,
        email ? `Email: ${email}` : null,
        phone ? `Phone: ${phone}` : null,
        service ? `Service: ${service}` : null,
        `\nMessage:\n${message}`,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
