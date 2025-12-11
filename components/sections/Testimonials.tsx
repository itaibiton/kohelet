"use client";

import { useTranslations } from "next-intl";

export default function Testimonials() {
  const t = useTranslations("testimonials");

  // Hardcoded 3 items as per JSON
  const items = [0, 1, 2];

  return (
    <section id="testimonials" className="py-32 relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-medium tracking-tight text-white mb-4">
            {t("section_title")}
          </h2>
          <p className="text-neutral-500 text-sm max-w-lg mx-auto">
            {t("section_subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((idx) => (
            <div
              key={idx}
              className="p-8 rounded-sm bg-[#08080a] border border-white/5 relative group hover:border-white/10 transition-colors"
            >
              {/* Quote icon decoration */}
              <div className="absolute top-6 start-6 text-4xl text-white/5 font-serif">"</div>

              <p className="relative z-10 text-neutral-400 font-light leading-relaxed mb-8 pt-4">
                {t(`items.${idx}.quote`)}
              </p>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white uppercase overflow-hidden">
                  {/* Placeholder for avatar if image fails or generic */}
                  {t(`items.${idx}.author`).charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">
                    {t(`items.${idx}.author`)}
                  </div>
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider">
                    {t(`items.${idx}.role`)} · {t(`items.${idx}.company`)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
