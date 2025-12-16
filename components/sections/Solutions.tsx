"use client";

import { useTranslations } from "next-intl";
import {
  RocketIcon,
  PaletteIcon,
  BrainIcon,
} from "@/components/icons";

const iconMap: Record<string, React.ReactNode> = {
  rocket: <RocketIcon size={28} strokeWidth={1.5} />,
  palette: <PaletteIcon size={28} strokeWidth={1.5} />,
  brain: <BrainIcon size={28} strokeWidth={1.5} />,
};

export default function Solutions() {
  const t = useTranslations("solutions");

  const pillars = [
    {
      badge: t("pillars.0.badge"),
      title: t("pillars.0.title"),
      description: t("pillars.0.description"),
      icon: "rocket",
      services: [
        { name: t("pillars.0.services.0.name"), detail: t("pillars.0.services.0.detail") },
        { name: t("pillars.0.services.1.name"), detail: t("pillars.0.services.1.detail") },
        { name: t("pillars.0.services.2.name"), detail: t("pillars.0.services.2.detail") },
      ],
    },
    {
      badge: t("pillars.1.badge"),
      title: t("pillars.1.title"),
      description: t("pillars.1.description"),
      icon: "palette",
      services: [
        { name: t("pillars.1.services.0.name"), detail: t("pillars.1.services.0.detail") },
        { name: t("pillars.1.services.1.name"), detail: t("pillars.1.services.1.detail") },
        { name: t("pillars.1.services.2.name"), detail: t("pillars.1.services.2.detail") },
      ],
    },
    {
      badge: t("pillars.2.badge"),
      title: t("pillars.2.title"),
      description: t("pillars.2.description"),
      icon: "brain",
      services: [
        { name: t("pillars.2.services.0.name"), detail: t("pillars.2.services.0.detail") },
        { name: t("pillars.2.services.1.name"), detail: t("pillars.2.services.1.detail") },
        { name: t("pillars.2.services.2.name"), detail: t("pillars.2.services.2.detail") },
      ],
    },
  ];

  return (
    <section
      id="solutions"
      className="py-32 relative z-10 border-t border-white/5 bg-[#030305]"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6 pb-8 border-b border-white/5">
          <div>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tighter-custom text-white mb-4">
              {t("section_title")}
            </h2>
            <p className="text-neutral-400 text-sm font-light max-w-md">
              {t("section_subtitle")}
            </p>
          </div>
          <div className="font-mono text-[10px] text-neutral-500 text-end flex flex-col gap-1">
            <span className="text-blue-500">SYSTEM: ONLINE</span>
            <span>V.4.0.2 STABLE</span>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className="group relative p-8 bg-white/[0.02] border border-white/5 rounded-sm hover:border-blue-500/30 transition-all duration-300"
            >
              {/* Badge */}
              {pillar.badge && (
                <div className="absolute -top-3 start-6 px-3 py-1 bg-blue-500 text-white text-[10px] font-mono uppercase tracking-wider rounded-full">
                  {pillar.badge}
                </div>
              )}

              {/* Icon */}
              <div className="p-4 rounded-sm bg-blue-500/10 text-blue-400 inline-block mb-6 group-hover:bg-blue-500/20 transition-colors">
                {iconMap[pillar.icon]}
              </div>

              {/* Title & Description */}
              <h3 className="text-white text-xl font-medium mb-2">{pillar.title}</h3>
              <p className="text-neutral-500 text-sm mb-6">{pillar.description}</p>

              {/* Services List */}
              <div className="space-y-4 border-t border-white/5 pt-6">
                {pillar.services.map((service, serviceIndex) => (
                  <div key={serviceIndex} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <div>
                      <span className="text-white text-sm font-medium block">
                        {service.name}
                      </span>
                      <span className="text-neutral-500 text-xs">{service.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
