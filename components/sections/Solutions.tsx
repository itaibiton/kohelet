"use client";

import { useTranslations } from "next-intl";
import { Code2, Bot, Workflow, Zap } from "lucide-react";
import { triggerColorChange, triggerColorReset } from "@/components/effects/ThreeBackground";

const iconMap: Record<string, React.ReactNode> = {
  code: <Code2 className="w-6 h-6 stroke-[1.5]" />,
  workflow: <Workflow className="w-6 h-6 stroke-[1.5]" />,
  bot: <Bot className="w-6 h-6 stroke-[1.5]" />,
};

const colorMap: Record<string, string> = {
  code: "#0A7CFF",
  workflow: "#FFFFFF",
  bot: "#5B4FFF",
};

export function Solutions() {
  const t = useTranslations("solutions");

  const pillars = t.raw("pillars") as Array<{
    title: string;
    description: string;
    icon: string;
    services: Array<{ name: string; detail: string }>;
  }>;

  const handleMouseEnter = (icon: string) => {
    triggerColorChange(colorMap[icon] || "#3B82F6");
  };

  const handleMouseLeave = () => {
    triggerColorReset();
  };

  return (
    <section id="solutions" className="w-full max-w-6xl mx-auto px-6 py-24 relative">
      {/* Header */}
        {/* <div
          className={`hidden w-fit md:flex items-center gap-2 text-xs text-accent-blue font-medium border border-accent-blue/20 bg-accent-blue/5 px-3 py-1 rounded-full ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <Zap className="w-3 h-3" />
          {t("powered_by")}
        </div> */}
      <div className="flex w-full flex-col md:flex-row justify-between items-end gap-8 mb-16 border-b border-white/5 pb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-display font-medium tracking-tight text-white mb-3">
            {t("section_title")}
          </h2>
          <p className="text-white/50 text-sm max-w-md font-light">
            {t("section_subtitle")}
          </p>
        </div>
        <div className="hidden w-fit md:flex items-center gap-2 text-xs text-accent-blue font-medium border border-accent-blue/20 bg-accent-blue/5 px-3 py-1 rounded-full">
          <Zap className="w-3 h-3" />
          {t("powered_by")}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {pillars.map((pillar, index) => {
          const iconKey = pillar.icon;
          const accentColor =
            index === 0
              ? "brand"
              : index === 1
                ? "white"
                : "accent";
          const hoverBorder =
            index === 0
              ? "group-hover:border-accent-blue/20"
              : index === 1
                ? "group-hover:border-white/20"
                : "group-hover:border-accent/20";
          const hoverBg =
            index === 0
              ? "hover:from-brand/50"
              : index === 1
                ? "hover:from-white/40"
                : "hover:from-accent/50";

          return (
            <div
              key={index}
              className={`service-card group  relative p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent ${hoverBg} transition-colors duration-500 `}
              onMouseEnter={() => handleMouseEnter(iconKey)}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className={`relative h-full bg-[#080808] rounded-xl p-8 overflow-hidden border border-white/5 ${hoverBorder} transition-colors`}
              >
                <div className="absolute inset-0 bg-glow-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon & Number */}
                  <div className="flex justify-between items-start mb-8">
                    <div
                      className={`p-3 bg-white/5 rounded-xl border border-white/10 text-${accentColor}`}
                    >
                      {iconMap[iconKey]}
                    </div>
                    <span className="font-mono text-xs text-white/30">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-medium text-white mb-3 tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed mb-8 font-light">
                    {pillar.description}
                  </p>

                  {/* Services List */}
                  <div className="mt-auto">
                    <ul className="space-y-1">
                      {pillar.services.map((service, serviceIndex) => (
                        <li key={serviceIndex} className="flex items-center gap-2 text-xs text-white/60">
                          <div
                            className={`w-1 h-1 rounded-full shrink-0 ${
                              index === 0
                                ? "bg-accent-blue"
                                : index === 1
                                  ? "bg-white"
                                  : "bg-accent-blue"
                            }`}
                          ></div>
                          <span>{service.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Solutions;
