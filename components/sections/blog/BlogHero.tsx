"use client";

import { useTranslations } from "next-intl";
import { BookOpen } from "lucide-react";

export function BlogHero() {
  const t = useTranslations("blog.hero");

  return (
    <section className="min-h-[35vh] w-full max-w-7xl mx-auto flex flex-col items-start justify-center px-6 pt-32 pb-16 text-start relative">
      {/* Decorative gradient orb - top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-blue/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Secondary accent orb - offset */}
      <div className="absolute top-1/3 right-0 translate-x-1/2 rtl:right-auto rtl:left-0 rtl:-translate-x-1/2 w-[300px] h-[300px] bg-accent-blue/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Badge */}
      <div
        className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-blue/30 bg-accent-blue/10 animate-fade-in-up"
        style={{ animationDelay: "0.1s" }}
      >
        <BookOpen className="w-3 h-3 text-accent-blue" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-accent-blue">
          {t("badge")}
        </span>
      </div>

      {/* Main Headline */}
      <div
        className="relative z-10 mt-8 space-y-4 animate-fade-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tighter leading-[1.1] text-white">
          {t("title.line1")}{" "}
          <span className="text-accent-blue">{t("title.highlight")}</span>
          <span className="text-white/40">{t("title.line2")}</span>
        </h1>
      </div>

      {/* Subtitle */}
      <p
        className="relative z-10 mt-8 text-base md:text-lg text-white/50 leading-relaxed font-light max-w-2xl animate-fade-in-up"
        style={{ animationDelay: "0.4s" }}
      >
        {t("subtitle")}
      </p>

    </section>
  );
}

export default BlogHero;
