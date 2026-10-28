"use client";

import { useState, type FormEvent } from "react";
import { MessageCircle, Mail } from "lucide-react";
import type { LandingContent } from "@/content/landing";
import { Mascot } from "./Sections";

type Status = "idle" | "sending" | "success" | "error";

export function Contact({ contact }: { contact: LandingContent["contact"] }) {
  const [status, setStatus] = useState<Status>("idle");
  const f = contact.form;
  const whatsappIsTodo = contact.whatsapp.href.includes("XXXX");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("website")) return; // honeypot
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          business: data.get("business"),
          contact: data.get("contact"),
          message: data.get("message"),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="kd-section" aria-labelledby="contact-heading">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="kd-kicker mb-4" data-reveal>
            {contact.kicker}
          </p>
          <h2 id="contact-heading" className="kd-title mb-6" data-reveal>
            {contact.title}
          </h2>
          <p className="kd-lead" data-reveal>
            {contact.body}
          </p>

          <div className="mt-8 flex flex-wrap gap-3" data-reveal>
            {/* TODO: contact.whatsapp.href still has the XXXXXXXXX placeholder number. */}
            <a
              href={contact.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="kd-btn kd-btn--ghost"
              aria-disabled={whatsappIsTodo || undefined}
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              {contact.whatsapp.label}
            </a>
            <a href={`mailto:${contact.email}`} className="kd-btn kd-btn--ghost">
              <Mail className="h-5 w-5" aria-hidden />
              {contact.email}
            </a>
          </div>

          <div className="mt-12 hidden w-40 lg:block" data-reveal aria-hidden="true">
            <Mascot alt="" className="h-auto w-full" />
          </div>
        </div>

        <div className="lg:col-span-7">
          {status === "success" ? (
            <div
              role="status"
              className="rounded-2xl border border-[var(--kd-line)] bg-white p-8 md:p-12"
              data-reveal
            >
              <p className="text-2xl font-black tracking-tight md:text-3xl">{f.success}</p>
              <button
                type="button"
                className="kd-btn kd-btn--ghost mt-8"
                onClick={() => setStatus("idle")}
              >
                {f.again}
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-5" data-reveal noValidate={false}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="kd-field">
                  <label htmlFor="kd-name">{f.name}</label>
                  <input id="kd-name" name="name" className="kd-input" required autoComplete="name" />
                </div>
                <div className="kd-field">
                  <label htmlFor="kd-business">{f.business}</label>
                  <input id="kd-business" name="business" className="kd-input" autoComplete="organization" />
                </div>
              </div>
              <div className="kd-field">
                <label htmlFor="kd-contact">{f.contact}</label>
                <input
                  id="kd-contact"
                  name="contact"
                  className="kd-input"
                  required
                  autoComplete="email"
                  inputMode="email"
                  aria-describedby="kd-contact-hint"
                />
                <p id="kd-contact-hint" className="text-sm text-[var(--kd-mute)]">
                  {f.contactHint}
                </p>
              </div>
              <div className="kd-field">
                <label htmlFor="kd-message">{f.message}</label>
                <textarea id="kd-message" name="message" className="kd-input min-h-36" required rows={5} />
              </div>
              {/* Honeypot for bots; hidden from users and assistive tech. */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="kd-website">Website</label>
                <input id="kd-website" name="website" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  className="kd-btn kd-btn--primary min-w-40"
                  disabled={status === "sending"}
                  aria-busy={status === "sending"}
                >
                  {status === "sending" && <span className="kd-spinner" aria-hidden="true" />}
                  {status === "sending" ? f.sending : f.submit}
                </button>
                {status === "error" && (
                  <p role="alert" className="text-sm font-bold text-red-700">
                    {f.error}
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
