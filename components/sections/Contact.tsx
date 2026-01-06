"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Mail, Phone, ChevronDown, CheckCircle, XCircle } from "lucide-react";

export function Contact() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const isRTL = locale === "he";

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  const services = t.raw("services") as string[];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (!response.ok) throw new Error("Failed to submit");

      setStatus("success");
      setFormState({ name: "", email: "", phone: "", service: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleReset = () => {
    setStatus("idle");
    setFormState({ name: "", email: "", phone: "", service: "", message: "" });
  };

  return (
    <section
      id="contact"
      className="w-full bg-[#030303] border-t border-white/5 py-24 px-6 relative z-10"
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column - Info */}
          <div className={isRTL ? "text-right" : ""}>
            <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight text-white mb-6">
              {t("headline_line1")}
              <br />
              {t("headline_line2")}
            </h2>
            <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-sm">
              {t("description")}
            </p>

            {/* Contact Info */}
            <div className={`space-y-4 ${isRTL ? "flex flex-col items-end" : ""}`}>
              <div
                className={`flex items-center gap-3 text-sm w-full text-white/70 ${isRTL ? "" : ""}`}
              >
                <Mail className="w-4 h-4 text-accent-blue shrink-0" />
                <span>{t("email")}</span>
              </div>
              <div
                className={`flex items-center gap-3 text-sm w-full text-white/70 ${isRTL ? "" : ""}`}
              >
                <Phone className="w-4 h-4 text-accent-blue shrink-0" />
                <span>{t("phone")}</span>
              </div>
            </div>

            {/* Availability Badge */}
            <div
              className={`mt-12 p-4 rounded-lg bg-white/5 border border-white/10 inline-flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-blue opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-blue"></span>
              </span>
              <span className="text-xs font-medium text-white/80">
                {t("availability")}: <span className="text-accent-blue">{t("availability_status")}</span>
              </span>
            </div>
          </div>

          {/* Right Column - Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  className={`text-xs font-medium text-white/40 uppercase tracking-wide ${isRTL ? "block text-right" : ""}`}
                >
                  {t("form.name.label")}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  placeholder={t("form.name.placeholder")}
                  className={`w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-brand/50 transition-all ${isRTL ? "text-right" : ""}`}
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  className={`text-xs font-medium text-white/40 uppercase tracking-wide ${isRTL ? "block text-right" : ""}`}
                >
                  {t("form.email.label")}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  placeholder={t("form.email.placeholder")}
                  className={`w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-brand/50 transition-all ${isRTL ? "text-right" : ""}`}
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label
                className={`text-xs font-medium text-white/40 uppercase tracking-wide ${isRTL ? "block text-right" : ""}`}
              >
                {t("form.phone.label")}
              </label>
              <input
                type="tel"
                name="phone"
                value={formState.phone}
                onChange={handleChange}
                placeholder={t("form.phone.placeholder")}
                className={`w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-brand/50 transition-all ${isRTL ? "text-right" : ""}`}
              />
            </div>

            {/* Service Select */}
            <div className="space-y-2">
              <label
                className={`text-xs font-medium text-white/40 uppercase tracking-wide ${isRTL ? "block text-right" : ""}`}
              >
                {t("form.service.label")}
              </label>
              <div className="relative">
                <select
                  name="service"
                  value={formState.service}
                  onChange={handleChange}
                  className={`w-full appearance-none bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-brand/50 transition-all cursor-pointer ${isRTL ? "text-right" : ""}`}
                >
                  {services.map((service, index) => (
                    <option key={index} value={service} className="bg-[#111]">
                      {service}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`absolute top-3.5 w-4 h-4 text-white/30 pointer-events-none ${isRTL ? "left-4" : "right-4"}`}
                />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label
                className={`text-xs font-medium text-white/40 uppercase tracking-wide ${isRTL ? "block text-right" : ""}`}
              >
                {t("form.message.label")}
              </label>
              <textarea
                name="message"
                value={formState.message}
                onChange={handleChange}
                rows={4}
                placeholder={t("form.message.placeholder")}
                className={`w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-brand/50 transition-all resize-none ${isRTL ? "text-right" : ""}`}
                required
              />
            </div>

            {/* Success Alert */}
            {status === "success" && (
              <div className={`p-4 rounded-lg bg-green-500/10 border border-green-500/30 ${isRTL ? "text-right" : ""}`}>
                <div className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-green-400 text-sm font-medium mb-3">
                      {t("form.submit.success")}
                    </p>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-xs text-green-400 hover:text-green-300 underline underline-offset-2 transition-colors"
                    >
                      {t("form.submit.resend")}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Error Alert */}
            {status === "error" && (
              <div className={`p-4 rounded-lg bg-red-500/10 border border-red-500/30 ${isRTL ? "text-right" : ""}`}>
                <div className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-red-400 text-sm font-medium mb-3">
                      {t("form.submit.error")}
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="text-xs text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors"
                    >
                      {t("form.submit.retry")}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            {status !== "success" && status !== "error" && (
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3.5 bg-accent-blue hover:bg-accent-blue-hover text-white font-semibold text-xs uppercase tracking-widest rounded-lg transition-colors duration-300 shadow-glow-blue disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "loading" ? t("form.submit.loading") : t("form.submit.label")}
              </button>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
