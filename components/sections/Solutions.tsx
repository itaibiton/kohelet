"use client";

import { useTranslations } from "next-intl";
import { FeatureCard } from "@/components/ui/Card";
import {
  CodeIcon,
  SmartphoneIcon,
  CpuIcon,
  SearchIcon,
  ZapIcon,
} from "@/components/icons";

const iconMap: Record<string, React.ReactNode> = {
  globe: <CodeIcon size={18} strokeWidth={1.5} />,
  smartphone: <SmartphoneIcon size={18} strokeWidth={1.5} />,
  palette: <CodeIcon size={18} strokeWidth={1.5} />,
  brain: <CpuIcon size={18} strokeWidth={1.5} />,
  "trending-up": <SearchIcon size={18} strokeWidth={1.5} />,
  compass: <ZapIcon size={18} strokeWidth={1.5} />,
};

export default function Solutions() {
  const t = useTranslations("services");

  const features = [
    {
      icon: iconMap["globe"],
      title: t("items.0.title"),
      description: t("items.0.description"),
      tag: t("items.0.tag"),
    },
    {
      icon: iconMap["smartphone"],
      title: t("items.1.title"),
      description: t("items.1.description"),
      tag: t("items.1.tag"),
    },
    {
      icon: iconMap["palette"],
      title: t("items.2.title"),
      description: t("items.2.description"),
      tag: t("items.2.tag"),
    },
    {
      icon: iconMap["brain"],
      title: t("items.3.title"),
      description: t("items.3.description"),
      tag: t("items.3.tag"),
    },
    {
      icon: iconMap["trending-up"],
      title: t("items.4.title"),
      description: t("items.4.description"),
      tag: t("items.4.tag"),
    },
    {
      icon: iconMap["compass"],
      title: t("items.5.title"),
      description: t("items.5.description"),
      tag: t("items.5.tag"),
    },
  ];

  return (
    <section
      id="services"
      className="py-32 relative z-10 border-t border-white/5 bg-[#030305]"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6 pb-8 border-b border-white/5">
          <div>
            <h2 className="text-3xl font-medium tracking-tight text-white mb-4">
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

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              tag={feature.tag}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
