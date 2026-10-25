"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { contactCopy } from "./contact-copy";

type FieldName = "name" | "email" | "message";

export default function ContactForm({ locale = "en" }: { locale?: "en" | "he" }) {
  const copy = contactCopy[locale];
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
        control.setCustomValidity(copy.validation[field]);
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

  function handleInvalid(event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const control = event.currentTarget;
    const field = control.name as FieldName;
    control.setCustomValidity(
      field === "email" && control.validity.typeMismatch
        ? copy.validation.invalidEmail
        : copy.validation[field],
    );
    setInvalidFields((previous) => ({ ...previous, [field]: true }));
  }

  return (
    <form className="kl-form" lang={locale} dir={locale === "he" ? "rtl" : "ltr"} onSubmit={handleSubmit} aria-busy={status === "pending"}>
      <div className="kl-form-row">
        <div className="kl-field">
          <label htmlFor="kl-name">{copy.name} <span aria-hidden="true">*</span></label>
          <input className="kl-input" id="kl-name" name="name" autoComplete="name" required maxLength={120}
            placeholder={copy.namePlaceholder} aria-invalid={invalidFields.name || undefined}
            onInput={clearValidity} onInvalid={handleInvalid} />
        </div>
        <div className="kl-field">
          <label htmlFor="kl-email">{copy.email} <span aria-hidden="true">*</span></label>
          <input className="kl-input" id="kl-email" name="email" type="email" dir="ltr" lang="en" autoComplete="email" required maxLength={254}
            placeholder={copy.emailPlaceholder} aria-invalid={invalidFields.email || undefined}
            onInput={clearValidity} onInvalid={handleInvalid} />
        </div>
      </div>
      <div className="kl-field">
        <label htmlFor="kl-service">{copy.service} <span>{copy.optional}</span></label>
        <select className="kl-input" id="kl-service" name="service" defaultValue="">
          <option value="">{copy.unsure}</option>
          <option value="AI search optimization">{copy.search}</option>
          <option value="AI implementation and automation">{copy.implementation}</option>
          <option value="AI consulting and training">{copy.consulting}</option>
          <option value="App and website development">{copy.development}</option>
        </select>
      </div>
      <div className="kl-field">
        <label htmlFor="kl-message">{copy.message} <span aria-hidden="true">*</span></label>
        <textarea className="kl-input" id="kl-message" name="message" rows={4} required maxLength={5000}
          placeholder={copy.messagePlaceholder} aria-invalid={invalidFields.message || undefined}
          onInput={clearValidity} onInvalid={handleInvalid} />
      </div>
      <button className="kl-button kl-button-primary" type="submit" disabled={status === "pending"}>
        {status === "pending" ? copy.pending : copy.submit}
        <span aria-hidden="true">↗</span>
      </button>
      <div className="kl-form-status" role={status === "error" ? "alert" : "status"} aria-live={status === "error" ? "assertive" : "polite"} aria-atomic="true">
        {status === "success" && copy.success}
        {status === "error" && <>{copy.failure}{" "}<a href="mailto:info@kohelet.digital" lang="en" dir="ltr"><bdi>info@kohelet.digital</bdi></a>.</>}
      </div>
    </form>
  );
}
