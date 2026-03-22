import { NextResponse } from "next/server";

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
const TO_EMAIL = process.env.CONTACT_EMAIL || "info@kohelet.digital";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, service, message } = body as {
      name: string;
      email: string;
      phone?: string;
      service?: string;
      message: string;
    };

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    if (N8N_WEBHOOK_URL) {
      const webhookResponse = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: TO_EMAIL,
          name,
          email,
          phone,
          service,
          message,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!webhookResponse.ok) {
        console.error("Webhook failed:", await webhookResponse.text());
        return NextResponse.json(
          { error: "Failed to process submission" },
          { status: 500 }
        );
      }
    } else {
      console.log("Contact form submission (no webhook configured):", {
        name,
        email,
        phone,
        service,
        message,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
