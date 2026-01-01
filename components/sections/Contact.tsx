"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Mail, MapPin, ChevronDown } from "lucide-react";

export function Contact() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const isRTL = locale === "he";

  const [formState, setFormState] = useState({
    name: "",
    email: "",
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

    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setFormState({ name: "", email: "", service: "", message: "" });
    }, 1500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
            <div className="space-y-4">
              <div
                className={`flex items-center gap-3 text-sm text-white/70 ${isRTL ? "flex-row-reverse justify-end" : ""}`}
              >
                <Mail className="w-4 h-4 text-brand" />
                {t("email")}
              </div>
              <div
                className={`flex items-center gap-3 text-sm text-white/70 ${isRTL ? "flex-row-reverse justify-end" : ""}`}
              >
                <MapPin className="w-4 h-4 text-brand" />
                {t("location")}
              </div>
            </div>

            {/* Availability Badge */}
            <div
              className={`mt-12 p-4 rounded-lg bg-white/5 border border-white/10 inline-flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
              </span>
              <span className="text-xs font-medium text-white/80">
                {t("availability")}: <span className="text-brand">{t("availability_status")}</span>
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
                  className={`w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all ${isRTL ? "text-right" : ""}`}
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
                  className={`w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all ${isRTL ? "text-right" : ""}`}
                  required
                />
              </div>
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
                  className={`w-full appearance-none bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all cursor-pointer ${isRTL ? "text-right" : ""}`}
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
                className={`w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all resize-none ${isRTL ? "text-right" : ""}`}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="w-full py-3.5 bg-brand hover:bg-brand-dark text-white font-semibold text-xs uppercase tracking-widest rounded-lg transition-colors duration-300 shadow-glow-brand disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading"
                ? t("form.submit.loading")
                : status === "success"
                  ? t("form.submit.success")
                  : t("form.submit.label")}
            </button>

            {status === "error" && (
              <p className={`text-red-500 text-sm ${isRTL ? "text-right" : ""}`}>
                {t("form.submit.error")}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
