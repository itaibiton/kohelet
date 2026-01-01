"use client";

import { useTranslations, useLocale } from "next-intl";
import {
  Database,
  Globe,
  MessageSquare,
  Smartphone,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  database: <Database className="w-5 h-5 text-brand" />,
  globe: <Globe className="w-5 h-5 text-brand" />,
  message: <MessageSquare className="w-5 h-5 text-brand" />,
  smartphone: <Smartphone className="w-5 h-5 text-brand" />,
  shield: <ShieldCheck className="w-5 h-5 text-brand" />,
  chart: <BarChart3 className="w-5 h-5 text-brand" />,
};

export function Capabilities() {
  const t = useTranslations("capabilities");
  const locale = useLocale();
  const isRTL = locale === "he";

  const items = t.raw("items") as Array<{
    icon: string;
    title: string;
    description: string;
  }>;

  const terminalLines = t.raw("terminal") as Array<string>;

  return (
    <section
      id="capabilities"
      className="w-full max-w-5xl mx-auto px-6 py-20 relative z-10 flex flex-col items-center"
    >
      {/* Header */}
      <div
        className="text-center mb-16 space-y-4 animate-fade-in-up"
        style={{ animationDelay: "0.1s" }}
      >
        <h2 className="text-4xl md:text-6xl font-display font-medium tracking-tight text-white">
          {t("section_title")}
        </h2>
        <p className="text-lg text-white/50 font-light tracking-tight">
          {t("section_subtitle")}
        </p>
      </div>

      {/* Capability Cards Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-16 animate-fade-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className={`group p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 ${isRTL ? "text-right" : ""}`}
          >
            <div className={`mb-4 ${isRTL ? "flex justify-end" : ""}`}>
              {iconMap[item.icon]}
            </div>
            <h3 className="text-base font-medium text-white mb-1 tracking-tight">
              {item.title}
            </h3>
            <p className="text-xs text-white/50 font-light">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Terminal Visual */}
      <div
        className="w-full max-w-2xl bg-[#0a0a0a] rounded-lg border border-white/10 p-4 font-mono text-xs shadow-2xl animate-fade-in-up"
        style={{ animationDelay: "0.4s" }}
      >
        {/* Terminal Header */}
        <div className="flex gap-1.5 mb-4">
          <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
        </div>

        {/* Terminal Content */}
        <div className={`space-y-1 text-white/70 ${isRTL ? "text-right direction-ltr" : ""}`}>
          {terminalLines.map((line, index) => (
            <p
              key={index}
              className={index === terminalLines.length - 1 ? "text-brand" : ""}
            >
              {line}
              {index === terminalLines.length - 1 && (
                <span className="cursor"></span>
              )}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Capabilities;
