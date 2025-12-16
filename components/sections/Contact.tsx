"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  ChevronRightIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
  BuildingIcon,
  MessageSquareIcon
} from "@/components/icons";

export default function Contact() {
  const t = useTranslations("contact");
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setFormState({ name: "", email: "", phone: "", company: "", message: "" });
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" className="py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20">
          {/* Header Info */}
          <div>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tighter-custom text-white mb-6">
              {t("section_title")}
            </h2>
            <p className="text-xl text-neutral-400 font-light mb-12">
              {t("section_subtitle")}
            </p>

            <div className="space-y-8">
              <div className="p-6 rounded-sm bg-white/5 border border-white/10 group hover:border-white/20 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-white/5 text-white/60 group-hover:text-white transition-colors">
                    <MailIcon size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Email</h3>
                    <a href="mailto:contact@kohelet.studio" className="text-neutral-400 hover:text-blue-400 transition-colors block">
                      info@kohelet.digital
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-sm bg-white/5 border border-white/10 group hover:border-white/20 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-white/5 text-white/60 group-hover:text-white transition-colors">
                    <PhoneIcon size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Phone</h3>
                    <a href="tel:0500000000" className="text-neutral-400 hover:text-blue-400 transition-colors block">
                      053-9858438
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
                  {t("form.name.label")}
                </label>
                <div className="relative">
                  <div className="absolute top-1/2 -translate-y-1/2 start-4 text-white/20 pointer-events-none">
                    <UserIcon size={18} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    placeholder={t("form.name.placeholder")}
                    className="w-full bg-[#08080a] border border-white/10 rounded-sm ps-12 pe-4 py-3 text-white placeholder:text-neutral-700 focus:outline-none focus:border-blue-500/50 transition-colors"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
                  {t("form.email.label")}
                </label>
                <div className="relative">
                  <div className="absolute top-1/2 -translate-y-1/2 start-4 text-white/20 pointer-events-none">
                    <MailIcon size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    placeholder={t("form.email.placeholder")}
                    className="w-full bg-[#08080a] border border-white/10 rounded-sm ps-12 pe-4 py-3 text-white placeholder:text-neutral-700 focus:outline-none focus:border-blue-500/50 transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
                  {t("form.phone.label")}
                </label>
                <div className="relative">
                  <div className="absolute top-1/2 -translate-y-1/2 start-4 text-white/20 pointer-events-none">
                    <PhoneIcon size={18} />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formState.phone}
                    onChange={handleChange}
                    placeholder={t("form.phone.placeholder")}
                    className="w-full bg-[#08080a] border border-white/10 rounded-sm ps-12 pe-4 py-3 text-white placeholder:text-neutral-700 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
                  {t("form.company.label")}
                </label>
                <div className="relative">
                  <div className="absolute top-1/2 -translate-y-1/2 start-4 text-white/20 pointer-events-none">
                    <BuildingIcon size={18} />
                  </div>
                  <input
                    type="text"
                    name="company"
                    value={formState.company}
                    onChange={handleChange}
                    placeholder={t("form.company.placeholder")}
                    className="w-full bg-[#08080a] border border-white/10 rounded-sm ps-12 pe-4 py-3 text-white placeholder:text-neutral-700 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
                {t("form.message.label")}
              </label>
              <div className="relative">
                <div className="absolute top-4 start-4 text-white/20 pointer-events-none">
                  <MessageSquareIcon size={18} />
                </div>
                <textarea
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  placeholder={t("form.message.placeholder")}
                  rows={4}
                  className="w-full bg-[#08080a] border border-white/10 rounded-sm ps-12 pe-4 py-3 text-white placeholder:text-neutral-700 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="w-full md:w-auto"
                icon={status === "success" ? undefined : <ChevronRightIcon size={14} className="rtl:rotate-180" />}
              >
                {status === "loading" ? t("form.submit.loading") :
                  status === "success" ? t("form.submit.success") :
                    t("form.submit.label")}
              </Button>
              {status === "error" && (
                <p className="mt-2 text-red-500 text-sm">{t("form.submit.error")}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
