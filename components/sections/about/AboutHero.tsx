"use client";

import { useTranslations } from "next-intl";
import { Zap } from "lucide-react";

export function AboutHero() {
  const t = useTranslations("about.hero");

  return (
    <section className="min-h-[35vh] w-full max-w-7xl mx-auto flex flex-col items-start justify-center px-6 pt-32 pb-16 text-start relative">
      {/* Badge */}
      <div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-blue/30 bg-accent-blue/10 animate-fade-in-up"
        style={{ animationDelay: "0.1s" }}
      >
        <Zap className="w-3 h-3 text-accent-blue fill-accent-blue" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-accent-blue">
          {t("badge")}
        </span>
      </div>

      {/* Main Headline */}
      <div
        className="mt-8 space-y-4 animate-fade-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tighter leading-[1.1] text-white">
          {t("headline.line1")}
          <br />
          <span className="text-white/80">{t("headline.line2_prefix")}</span>
          <span className="text-accent-blue">{t("headline.line2_highlight")}</span>
          <span className="text-white/80">{t("headline.line2_suffix")}</span>
        </h1>
      </div>

      {/* Subtitle */}
      <p
        className="mt-8 text-base md:text-lg text-white/50 leading-relaxed font-light max-w-2xl animate-fade-in-up"
        style={{ animationDelay: "0.4s" }}
      >
        {t("subtitle")}
      </p>

      {/* Decorative gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-blue/5 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
}

export default AboutHero;
