"use client";

import { useTranslations, useLocale } from "next-intl";
import { ChevronRight, Bot, User, Zap, Play } from "lucide-react";

export function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const isRTL = locale === "he";

  return (
    <section className="min-h-screen w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center px-6 pt-32 pb-12 gap-12 relative">
      {/* Left Content */}
      <div
        className={`flex-1 w-full space-y-8 relative z-10 ${isRTL ? "text-right" : "text-left"}`}
      >
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-blue/30 bg-accent-blue/10 animate-fade-in-up ${isRTL ? "flex-row-reverse" : ""}`}
          style={{ animationDelay: "0.1s" }}
        >
          <Zap className="w-3 h-3 text-accent-blue fill-accent-blue" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-accent-blue">
            {t("badge.text")}
          </span>
        </div>

        {/* Tagline + Headline */}
        <div
          className="space-y-3 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          {/* Small tagline */}
          <p className="text-accent-blue font-medium text-sm tracking-wide">
            {t("tagline")}
          </p>

          {/* Main headline with color variations */}
          <h1 className="text-5xl font-display font-semibold tracking-tighter leading-[0.95] text-white">
            {t("headline.prefix")}
            <span className="text-accent-blue">{t("headline.highlight")}</span>
            {t("headline.middle")}
            <br />
            <span className="text-white/30">{t("headline.faded")}</span>
          </h1>
        </div>

        {/* Secondary Title + Long Subtitle */}
        <div
          className="space-y-6 max-w-lg animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          {/* Secondary title with underlined word */}
          <p className="text-xl text-white font-medium">
            {t("secondary.prefix")}{" "}
            <span className="text-accent-blue border-b border-accent-blue/30 pb-0.5">
              {t("secondary.highlight")}
            </span>{" "}
            {t("secondary.suffix")}
          </p>

          {/* Long subtitle */}
          <p className="text-sm md:text-[15px] text-white/50 leading-relaxed font-light">
            {t("subtitle")}
          </p>
        </div>

        {/* CTAs */}
        <div
          className={`pt-2 flex flex-wrap items-center gap-4 animate-fade-in-up ${isRTL ? "flex-row-reverse justify-end" : ""}`}
          style={{ animationDelay: "0.6s" }}
        >
          {/* Primary CTA - brand color with glow */}
          <a
            href="#solutions"
            className={`group relative inline-flex items-center gap-2 px-8 py-3.5 bg-accent-blue text-white rounded-full text-sm font-semibold tracking-wide transition-all duration-300 border border-accent-blue hover:bg-accent-blue-hover hover:border-accent-blue-hover shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] ${isRTL ? "flex-row-reverse" : ""}`}
          >
            {t("cta_primary")}
            <ChevronRight
              className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${isRTL ? "rotate-180 group-hover:-translate-x-0.5" : ""}`}
            />
          </a>

          {/* Secondary CTA - with play icon */}
          <a
            href="#demo"
            className={`group inline-flex items-center gap-3 px-6 py-3.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-full text-sm font-medium text-white transition-all ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors">
              <Play className={`w-3 h-3 text-white fill-white ${isRTL ? "mr-0.5" : "ml-0.5"}`} />
            </span>
            {t("cta_secondary")}
          </a>
        </div>
      </div>

      {/* Right Content: Chat Interface Visual */}
      <div
        className="flex-1 w-full flex justify-center md:justify-end relative z-10 animate-fade-in-up"
        style={{ animationDelay: "0.9s" }}
      >
        <div className="relative w-[340px] h-[580px] bg-[#050505]/95 rounded-[32px] border border-white/10 shadow-[0_0_60px_rgba(59,130,246,0.15)] overflow-hidden">
          {/* Header */}
          <div className="absolute top-0 left-0 w-full h-16 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
              <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
            </div>
            <div className="text-[10px] font-mono text-white/30">
              agent_v4.tsx
            </div>
          </div>

          {/* Content */}
          <div className="pt-20 px-6 pb-6 h-full flex flex-col relative">
            {/* Chat Messages */}
            <div className="space-y-3 mb-8">
              {/* AI Message 1 */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center border border-accent-blue/20 shrink-0">
                  <Bot className="w-4 h-4 text-accent-blue" />
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-4 text-xs text-white/80 leading-relaxed font-light">
                  <span className="text-accent-blue">@System:</span>{" "}
                  {t("chat.system_message")}
                  <br />
                  <span className="text-emerald-400">
                    &gt;&gt; {t("chat.optimization_complete")}
                  </span>
                  <br />
                  {t("chat.launching_protocols")}
                </div>
              </div>

              {/* User Message */}
              <div className="flex gap-3 flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="bg-accent-blue/10 border border-accent-blue/20 rounded-2xl rounded-tr-none p-4 text-xs text-white/90 font-light">
                  {t("chat.user_message")}
                </div>
              </div>

              {/* AI Message 2 */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center border border-accent-blue/20 shrink-0">
                  <Bot className="w-4 h-4 text-accent-blue" />
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-4 text-xs text-white/80 leading-relaxed font-light">
                  {t("chat.executing")}
                  <div className="mt-2 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-accent-blue w-2/3 animate-pulse"></div>
                  </div>
                  <span className="block mt-1 text-[10px] text-white/40">
                    {t("chat.status")}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Stats */}
            <div className="mt-auto grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
                  {t("stats.traffic_label")}
                </div>
                <div className="text-lg font-medium text-white">
                  {t("stats.traffic_value")}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
                  {t("stats.leads_label")}
                </div>
                <div className="text-lg font-medium text-white">
                  {t("stats.leads_value")}
                </div>
              </div>
            </div>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
