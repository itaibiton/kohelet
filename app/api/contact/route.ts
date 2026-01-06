import { NextResponse } from "next/server";

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, service, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // If n8n webhook URL is configured, send data there
    if (N8N_WEBHOOK_URL) {
      const webhookResponse = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          service,
          message,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!webhookResponse.ok) {
        console.error("n8n webhook failed:", await webhookResponse.text());
        return NextResponse.json(
          { error: "Failed to process submission" },
          { status: 500 }
        );
      }
    } else {
      // Log to console if no webhook configured (for development)
      console.log("Contact form submission:", { name, email, phone, service, message });
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
