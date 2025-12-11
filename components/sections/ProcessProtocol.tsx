"use client";

import { useTranslations } from "next-intl";

export default function ProcessProtocol() {
  const t = useTranslations("process");

  const steps = [
    {
      step: t("steps.0.number"),
      title: t("steps.0.title"),
      description: t("steps.0.description"),
    },
    {
      step: t("steps.1.number"),
      title: t("steps.1.title"),
      description: t("steps.1.description"),
    },
    {
      step: t("steps.2.number"),
      title: t("steps.2.title"),
      description: t("steps.2.description"),
    },
  ];

  return (
    <section id="process" className="py-32 relative z-10 overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-900/40 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-24 relative">
          <div className="absolute start-1/2 -translate-x-1/2 rtl:translate-x-1/2 top-0 -mt-10 w-px h-20 bg-gradient-to-b from-transparent to-blue-500"></div>
          <h2 className="text-3xl font-medium tracking-tight text-white mb-4">
            {t("section_title")}
          </h2>
          <p className="text-neutral-500 text-sm max-w-lg mx-auto">
            {t("section_subtitle")}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center Line */}
          <div className="absolute start-[19px] top-0 bottom-0 w-[1px] bg-white/5 md:start-1/2 md:-ms-[0.5px]"></div>

          {steps.map((item, idx) => (
            <div
              key={idx}
              className={`relative flex gap-10 mb-20 last:mb-0 md:justify-center ${
                idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Step Number Circle */}
              <div className="relative z-10 w-10 h-10 shrink-0 bg-[#020204] border border-white/20 rounded-full flex items-center justify-center text-xs font-mono font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                {item.step}
              </div>

              {/* Content */}
              <div
                className={`md:w-1/3 pt-1 ${
                  idx % 2 === 0 ? "md:text-end" : "md:text-start"
                }`}
              >
                <h3 className="text-lg font-medium text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
