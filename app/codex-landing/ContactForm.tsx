"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type FieldName = "name" | "email" | "message";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [invalidFields, setInvalidFields] = useState<Partial<Record<FieldName, boolean>>>({});
  const request = useRef<AbortController | null>(null);

  useEffect(() => () => request.current?.abort(), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (request.current) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const payload = {
      name: String(values.get("name") ?? "").trim(),
      email: String(values.get("email") ?? "").trim(),
      service: String(values.get("service") ?? ""),
      message: String(values.get("message") ?? "").trim(),
    };

    for (const field of ["name", "email", "message"] as const) {
      if (!payload[field]) {
        const control = form.elements.namedItem(field) as HTMLInputElement | HTMLTextAreaElement;
        control.setCustomValidity(`Please enter your ${field === "message" ? "message" : field}.`);
        setInvalidFields((previous) => ({ ...previous, [field]: true }));
        control.reportValidity();
        return;
      }
    }

    const controller = new AbortController();
    request.current = controller;
    setStatus("pending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const result = (await response.json()) as { success?: boolean };
      if (!response.ok || result.success !== true) throw new Error("Request unsuccessful");
      if (!controller.signal.aborted) {
        form.reset();
        setInvalidFields({});
        setStatus("success");
      }
    } catch {
      if (!controller.signal.aborted) setStatus("error");
    } finally {
      if (request.current === controller) request.current = null;
    }
  }

  function clearValidity(event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const control = event.currentTarget;
    control.setCustomValidity("");
    setInvalidFields((previous) => ({ ...previous, [control.name]: false }));
    if (status === "error" || status === "success") setStatus("idle");
  }

  return (
    <form className="kl-form" onSubmit={handleSubmit} aria-busy={status === "pending"}>
      <div className="kl-form-row">
        <div className="kl-field">
          <label htmlFor="kl-name">Your name <span aria-hidden="true">*</span></label>
          <input className="kl-input" id="kl-name" name="name" autoComplete="name" required maxLength={120}
            placeholder="Alex Morgan" aria-invalid={invalidFields.name || undefined}
            onInput={clearValidity} onInvalid={() => setInvalidFields((previous) => ({ ...previous, name: true }))} />
        </div>
        <div className="kl-field">
          <label htmlFor="kl-email">Email address <span aria-hidden="true">*</span></label>
          <input className="kl-input" id="kl-email" name="email" type="email" autoComplete="email" required maxLength={254}
            placeholder="alex@company.com" aria-invalid={invalidFields.email || undefined}
            onInput={clearValidity} onInvalid={() => setInvalidFields((previous) => ({ ...previous, email: true }))} />
        </div>
      </div>
      <div className="kl-field">
        <label htmlFor="kl-service">What could we help with? <span>(optional)</span></label>
        <select className="kl-input" id="kl-service" name="service" defaultValue="">
          <option value="">Not sure yet</option>
          <option value="AI search optimization">AI search optimization</option>
          <option value="AI implementation and automation">AI implementation and automation</option>
          <option value="AI consulting and training">AI consulting and training</option>
        </select>
      </div>
      <div className="kl-field">
        <label htmlFor="kl-message">A little about your business <span aria-hidden="true">*</span></label>
        <textarea className="kl-input" id="kl-message" name="message" rows={4} required maxLength={5000}
          placeholder="What do you do, and what would you like to make better?" aria-invalid={invalidFields.message || undefined}
          onInput={clearValidity} onInvalid={() => setInvalidFields((previous) => ({ ...previous, message: true }))} />
      </div>
      <button className="kl-button kl-button-primary" type="submit" disabled={status === "pending"}>
        {status === "pending" ? "Sending your message…" : "Let’s talk about your business"}
        <span aria-hidden="true">↗</span>
      </button>
      <div className="kl-form-status" role={status === "error" ? "alert" : "status"} aria-live={status === "error" ? "assertive" : "polite"} aria-atomic="true">
        {status === "success" && "Thank you. Your message was accepted — we’ll be in touch."}
        {status === "error" && <>Your message could not be sent. Please try again or email <a href="mailto:info@kohelet.digital">info@kohelet.digital</a>.</>}
      </div>
    </form>
  );
}
