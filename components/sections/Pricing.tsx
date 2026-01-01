"use client";

import { useTranslations, useLocale } from "next-intl";
import { Check, ArrowRight, Star } from "lucide-react";

export function Pricing() {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const isRTL = locale === "he";

  const packages = t.raw("packages") as Array<{
    name: string;
    type: string;
    description: string;
    features: string[];
    cta: string;
    featured?: boolean;
  }>;

  return (
    <section id="pricing" className="w-full max-w-7xl mx-auto px-6 py-24 relative z-10">
      {/* Header */}
      <div className={`mb-16 space-y-4 ${isRTL ? "text-right" : "text-center"}`}>
        <h2 className={`text-3xl md:text-5xl font-display font-medium tracking-tight text-white ${isRTL ? "text-right" : ""}`}>
          {t("section_title")}
        </h2>
        <p className={`text-white/50 text-sm md:text-base font-light ${isRTL ? "text-right" : ""}`}>
          {t("section_subtitle")}
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {packages.map((pkg, index) => {
          const isFeatured = pkg.featured || index === 1;

          return (
            <div
              key={index}
              className={`relative p-8 rounded-2xl border flex flex-col h-full transition-all duration-300 ${
                isFeatured
                  ? "border-brand bg-[#050505] shadow-[0_0_50px_rgba(10,124,255,0.1)] md:-translate-y-4"
                  : "border-white/10 bg-[#050505] hover:border-white/20"
              }`}
            >
              {/* Featured Badge */}
              {isFeatured && (
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 bg-brand text-white text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-brand/20 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <Star className="w-3 h-3 fill-white text-white" />
                  {t("scaling_badge")}
                </div>
              )}

              {/* Package Info */}
              <h3 className={`text-lg font-medium text-white mb-2 ${isRTL ? "text-right" : ""}`}>
                {pkg.name}
              </h3>
              <div className={`flex items-baseline gap-1 mb-4`}>
                <span className="text-3xl font-display font-medium text-white ">
                  {pkg.type}
                </span>
              </div>
              <p className={`text-white/40 text-xs mb-8 ${isRTL ? "text-right" : ""}`}>
                {pkg.description}
              </p>

              {/* Features */}
              <ul className="space-y-4 mb-8 flex-1">
                {pkg.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse text-right" : ""}`}
                  >
                    <Check
                      className={`w-4 h-4 mt-0.5 shrink-0 ${isFeatured ? "text-brand" : "text-white"}`}
                    />
                    <span
                      className={`text-xs ${isFeatured ? "text-white/90" : "text-white/80"}`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <a
                href="#contact"
                className={`w-full py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                  isFeatured
                    ? "bg-brand hover:bg-brand-dark text-white shadow-glow-brand font-semibold"
                    : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                } ${isRTL ? "flex-row-reverse" : ""}`}
              >
                {pkg.cta}
                {isFeatured && (
                  <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
                )}
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Pricing;
