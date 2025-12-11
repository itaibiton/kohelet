"use client";

import { useTranslations } from "next-intl";
import { ShareIcon } from "@/components/icons";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="py-20 border-t border-white/10 bg-[#010101] text-xs">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-20">
        {/* Brand Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-600 rotate-45 shadow-[0_0_8px_rgba(37,99,235,0.6)]"></div>
            <span className="text-white font-semibold tracking-tight uppercase">
              {t("logo")}
            </span>
          </div>
          <p className="text-neutral-400 leading-relaxed max-w-xs">
            {t("tagline")}
          </p>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-white font-medium uppercase tracking-wider mb-6 text-[10px]">
            {t("links.services.title")}
          </h4>
          <ul className="space-y-4">
            {[0, 1, 2, 3].map((idx) => (
              <li key={idx}>
                <a
                  href={t(`links.services.items.${idx}.href`)}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  {t(`links.services.items.${idx}.label`)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-white font-medium uppercase tracking-wider mb-6 text-[10px]">
            {t("links.company.title")}
          </h4>
          <ul className="space-y-4">
            {[0, 1, 2].map((idx) => (
              <li key={idx}>
                <a
                  href={t(`links.company.items.${idx}.href`)}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  {t(`links.company.items.${idx}.label`)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-white font-medium uppercase tracking-wider mb-6 text-[10px]">
            {t("links.social.title")}
          </h4>
          <ul className="space-y-4">
            {[0, 1, 2].map((idx) => (
              <li key={idx}>
                <a
                  href={t(`links.social.items.${idx}.href`)}
                  className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
                >
                  <ShareIcon size={14} />
                  {t(`links.social.items.${idx}.label`)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-neutral-500 font-mono uppercase tracking-widest">
        <div>{t("copyright")}</div>
        <div className="flex gap-6">
          <a href={t("legal.0.href")} className="hover:text-neutral-300 transition-colors">
            {t("legal.0.label")}
          </a>
          <a href={t("legal.1.href")} className="hover:text-neutral-300 transition-colors">
            {t("legal.1.label")}
          </a>
        </div>
      </div>
    </footer>
  );
}
