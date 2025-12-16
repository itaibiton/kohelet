"use client";

import { useTranslations } from "next-intl";
import { ChevronRightIcon } from "@/components/icons";

export default function CTA() {
  const t = useTranslations("cta_section");

  return (
    <section className="py-40 relative overflow-hidden border-t border-white/5">
      {/* Background effects */}
      <div className="absolute inset-0 bg-blue-900/5 mix-blend-overlay"></div>
      <div className="absolute top-1/2 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-transparent blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-5xl md:text-6xl font-medium tracking-tighter-custom text-white mb-8">
          {t("headline")}
        </h2>
        <p className="text-neutral-400 mb-8 max-w-xl mx-auto font-light text-base">
          {t("subheadline")}
        </p>

        {/* Urgency Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-red-400 text-sm font-medium">
            {t("urgency")}
          </span>
        </div>

        <div className="block">
          <a
            href={t("button.href")}
            className="group relative inline-flex items-center justify-center px-10 py-5 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-blue-600 hover:text-white transition-all duration-300 clip-hud overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            <span className="flex items-center gap-3 relative z-10">
              {t("button.label")}{" "}
              <ChevronRightIcon size={14} className="rtl:rotate-180" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
