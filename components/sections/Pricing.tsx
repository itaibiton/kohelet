"use client";

import { useTranslations } from "next-intl";
import { CheckIcon, ChevronRightIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";

export default function Pricing() {
  const t = useTranslations("pricing");

  const packages = [
    {
      name: t("packages.0.name"),
      price: t("packages.0.price"),
      description: t("packages.0.description"),
      features: [
        t("packages.0.features.0"),
        t("packages.0.features.1"),
        t("packages.0.features.2"),
        t("packages.0.features.3"),
        t("packages.0.features.4"),
      ],
      cta: t("packages.0.cta"),
      popular: false,
    },
    {
      name: t("packages.1.name"),
      price: t("packages.1.price"),
      description: t("packages.1.description"),
      features: [
        t("packages.1.features.0"),
        t("packages.1.features.1"),
        t("packages.1.features.2"),
        t("packages.1.features.3"),
        t("packages.1.features.4"),
      ],
      cta: t("packages.1.cta"),
      popular: true,
    },
    {
      name: t("packages.2.name"),
      price: t("packages.2.price"),
      description: t("packages.2.description"),
      features: [
        t("packages.2.features.0"),
        t("packages.2.features.1"),
        t("packages.2.features.2"),
        t("packages.2.features.3"),
        t("packages.2.features.4"),
      ],
      cta: t("packages.2.cta"),
      popular: false,
    },
    {
      name: t("packages.3.name"),
      price: t("packages.3.price"),
      description: t("packages.3.description"),
      features: [
        t("packages.3.features.0"),
        t("packages.3.features.1"),
        t("packages.3.features.2"),
        t("packages.3.features.3"),
        t("packages.3.features.4"),
      ],
      cta: t("packages.3.cta"),
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-32 relative z-10 border-t border-white/5">
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

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`relative p-6 rounded-sm border transition-all duration-300 ${
                pkg.popular
                  ? "bg-blue-500/5 border-blue-500/30 scale-[1.02]"
                  : "bg-white/[0.02] border-white/5 hover:border-white/10"
              }`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-3 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 px-3 py-1 bg-blue-500 text-white text-[10px] font-mono uppercase tracking-wider rounded-full">
                  Popular
                </div>
              )}

              {/* Package Info */}
              <div className="mb-6">
                <h3 className="text-white font-medium text-lg mb-2">{pkg.name}</h3>
                <div className="text-2xl font-bold text-white mb-2">{pkg.price}</div>
                <p className="text-neutral-500 text-sm">{pkg.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <CheckIcon size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-neutral-400 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                variant={pkg.popular ? "primary" : "ghost"}
                className="w-full"
                href="#contact"
                icon={<ChevronRightIcon size={14} className="rtl:rotate-180" />}
              >
                {pkg.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-neutral-600 text-xs mt-8 font-mono">
          {t("note")}
        </p>
      </div>
    </section>
  );
}
