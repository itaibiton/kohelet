"use client";

import { useTranslations } from "next-intl";

export default function Clients() {
  const t = useTranslations("clients");
  const logos = [0, 1, 2, 3, 4, 5];

  return (
    <section className="py-20 border-y border-white/5 bg-black/50 backdrop-blur-sm relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-[10px] uppercase tracking-widest text-neutral-500 mb-10">
          {t("section_title")}
        </p>

        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          {logos.map((idx) => (
            <div key={idx} className="h-8 flex items-center justify-center">
              {/* Placeholder for logos since we don't have the actual SVG files yet */}
              <span className="text-lg font-bold text-white/40 hover:text-white transition-colors">
                {t(`logos.${idx}.name`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
