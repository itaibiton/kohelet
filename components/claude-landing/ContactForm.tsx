"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { contact } from "./content";

type Values = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

type Errors = Partial<Record<keyof Values, string>>;
type Status = "idle" | "pending" | "success" | "error";

const EMPTY: Values = { name: "", email: "", phone: "", service: "", message: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: Values): Errors {
  const errors: Errors = {};
  if (v.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(v.email.trim())) errors.email = "Please enter a valid email address.";
  if (v.phone.trim() && v.phone.replace(/[\s()+-]/g, "").length < 7)
    errors.phone = "That phone number looks too short.";
  if (v.message.trim().length < 10)
    errors.message = "A sentence or two helps us reply properly.";
  return errors;
}

export function ContactForm() {
  const uid = useId();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const field = (name: keyof Values) => ({
    id: `${uid}-${name}`,
    name,
    value: values[name],
    "aria-invalid": touched[name] && errors[name] ? true : undefined,
    "aria-describedby": touched[name] && errors[name] ? `${uid}-${name}-error` : undefined,
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const next = { ...values, [name]: e.target.value };
      setValues(next);
      if (touched[name]) setErrors(validate(next));
    },
    onBlur: () => {
      setTouched((t) => ({ ...t, [name]: true }));
      setErrors(validate(values));
    },
  });

  const errorFor = (name: keyof Values) =>
    touched[name] && errors[name] ? (
      <p id={`${uid}-${name}-error`} className="cl-error" role="alert">
        {errors[name]}
      </p>
    ) : null;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setTouched({ name: true, email: true, phone: true, service: true, message: true });
    if (Object.keys(nextErrors).length > 0) {
      const firstKey = (Object.keys(nextErrors) as (keyof Values)[])[0];
      document.getElementById(`${uid}-${firstKey}`)?.focus();
      return;
    }

    setStatus("pending");
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim() || undefined,
          service: values.service || undefined,
          message: values.message.trim(),
        }),
      });
      if (!res.ok) {
        let detail = "";
        try {
          const data = (await res.json()) as { error?: string };
          detail = data.error ?? "";
        } catch {
          /* non-JSON error body */
        }
        throw new Error(detail || `Request failed (${res.status})`);
      }
      setStatus("success");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="cl-card cl-rise p-8" role="status" aria-live="polite">
        <div className="cl-success-mark" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              className="cl-check"
              d="M5 12.5l4.5 4.5L19 7.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="cl-h2 mt-5 text-2xl">Thanks, {values.name.split(" ")[0] || "there"}.</h3>
        <p className="cl-lede mt-3 max-w-md">
          Your message has been handed to our contact system. We read every message
          personally and will get back to you by email.
        </p>
        <p className="mt-6 text-sm" style={{ color: "var(--cl-ink-3)" }}>
          In a hurry? Write to{" "}
          <a href={`mailto:${contact.email}`} className="cl-link underline">
            {contact.email}
          </a>
          .
        </p>
        <button
          type="button"
          className="cl-btn cl-btn-secondary cl-btn-small mt-8"
          onClick={() => {
            setValues(EMPTY);
            setTouched({});
            setErrors({});
            setStatus("idle");
          }}
        >
          Send another message
        </button>
      </div>
    );
  }

  const pending = status === "pending";

  return (
    <form className="cl-card p-6 sm:p-8" onSubmit={onSubmit} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="cl-field">
          <label htmlFor={`${uid}-name`}>Name</label>
          <input
            className="cl-input"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            required
            {...field("name")}
          />
          {errorFor("name")}
        </div>
        <div className="cl-field">
          <label htmlFor={`${uid}-email`}>Email</label>
          <input
            className="cl-input"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@company.com"
            required
            {...field("email")}
          />
          {errorFor("email")}
        </div>
        <div className="cl-field">
          <label htmlFor={`${uid}-phone`}>
            Phone <span style={{ color: "var(--cl-ink-3)" }}>(optional)</span>
          </label>
          <input
            className="cl-input"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+972 50 000 0000"
            {...field("phone")}
          />
          {errorFor("phone")}
        </div>
        <div className="cl-field">
          <label htmlFor={`${uid}-service`}>What are you looking into?</label>
          <div className="cl-select-wrap">
            <select className="cl-input" {...field("service")}>
              <option value="">Choose one</option>
              {contact.serviceOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="cl-field sm:col-span-2">
          <label htmlFor={`${uid}-message`}>Tell us about your business</label>
          <textarea
            className="cl-input min-h-32 resize-y"
            rows={5}
            placeholder="What takes too much time? What would you like to be found for? A few sentences is plenty."
            required
            {...field("message")}
          />
          {errorFor("message")}
        </div>
      </div>

      {status === "error" && (
        <div className="cl-alert cl-alert-error cl-rise mt-5" role="alert">
          We couldn&apos;t send your message{serverError ? ` (${serverError.toLowerCase()})` : ""}.
          Please try again, or email{" "}
          <a href={`mailto:${contact.email}`} className="underline">
            {contact.email}
          </a>
          .
        </div>
      )}

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          className="cl-btn cl-btn-primary"
          disabled={pending}
          aria-busy={pending}
        >
          {pending ? (
            <>
              <span className="cl-spinner" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              Send message
              <ArrowRight className="cl-arrow h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
        <p className="text-xs" style={{ color: "var(--cl-ink-3)" }}>
          We reply by email. No newsletters, no sharing your details.
        </p>
      </div>
    </form>
  );
}
