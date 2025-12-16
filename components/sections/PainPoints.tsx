"use client";

import { useTranslations } from "next-intl";
import {
  AlertCircleIcon,
  TrendingDownIcon,
  CreditCardIcon,
  BotIcon,
  ClockIcon,
} from "@/components/icons";

const iconMap: Record<string, React.ReactNode> = {
  "alert-circle": <AlertCircleIcon size={24} strokeWidth={1.5} />,
  "trending-down": <TrendingDownIcon size={24} strokeWidth={1.5} />,
  "credit-card": <CreditCardIcon size={24} strokeWidth={1.5} />,
  bot: <BotIcon size={24} strokeWidth={1.5} />,
  clock: <ClockIcon size={24} strokeWidth={1.5} />,
};

export default function PainPoints() {
  const t = useTranslations("pain_points");

  const items = [
    { icon: "alert-circle", title: t("items.0.title"), description: t("items.0.description") },
    { icon: "trending-down", title: t("items.1.title"), description: t("items.1.description") },
    { icon: "credit-card", title: t("items.2.title"), description: t("items.2.description") },
    { icon: "bot", title: t("items.3.title"), description: t("items.3.description") },
    { icon: "clock", title: t("items.4.title"), description: t("items.4.description") },
  ];

  return (
    <section className="py-24 relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tighter-custom text-white mb-4">
            {t("section_title")}
          </h2>
          <p className="text-neutral-400 text-sm font-light max-w-md mx-auto">
            {t("section_subtitle")}
          </p>
        </div>

        {/* Pain Point Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="group p-6 bg-white/[0.02] border border-white/5 rounded-sm hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-sm bg-red-500/10 text-red-400 group-hover:bg-red-500/20 transition-colors">
                  {iconMap[item.icon]}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-2">{item.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
