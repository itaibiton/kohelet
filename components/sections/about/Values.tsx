"use client";

import { useTranslations } from "next-intl";
import {
  Lightbulb,
  Target,
  TrendingUp,
  Handshake,
  Rocket,
  Eye,
  LucideIcon,
} from "lucide-react";

/**
 * Values data structure for mapping translations to components.
 * Each value references its icon component and translation index.
 *
 * 6 Core Values (from PRD-03):
 * 1. Innovation-Driven (Lightbulb)
 * 2. Results-Obsessed (Target)
 * 3. Built to Scale (TrendingUp)
 * 4. Partnership-First (Handshake)
 * 5. Execution Excellence (Rocket)
 * 6. Transparent by Default (Eye)
 */
const values: { id: string; icon: LucideIcon; index: number }[] = [
  { id: "innovation", icon: Lightbulb, index: 0 },
  { id: "results", icon: Target, index: 1 },
  { id: "scale", icon: TrendingUp, index: 2 },
  { id: "partnership", icon: Handshake, index: 3 },
  { id: "excellence", icon: Rocket, index: 4 },
  { id: "transparency", icon: Eye, index: 5 },
];

/**
 * Values Component (UI-03 / PRD-03)
 *
 * Displays 6 core company values with icons, titles, and descriptions
 * using glassmorphism card styling. Features staggered CSS fade-in
 * animations and supports prefers-reduced-motion.
 *
 * Layout:
 * - Mobile: 1 column grid
 * - Tablet: 2 columns
 * - Desktop: 3 columns (2x3 grid)
 *
 * Translation keys used:
 * - about.values.sectionTitle
 * - about.values.sectionSubtitle
 * - about.values.items[0-5].name
 * - about.values.items[0-5].description
 */
export function Values() {
  const t = useTranslations("about.values");

  return (
    <section
      id="values"
      className="w-full bg-brand-dark"
      aria-labelledby="values-title"
    >
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-32 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <h2
            id="values-title"
            className="text-3xl md:text-4xl lg:text-5xl font-display font-medium tracking-tight text-white animate-fade-in-up"
            style={{ animationDelay: "0s" }}
          >
            {t("sectionTitle")}
          </h2>
          <p
            className="text-base md:text-lg text-white/50 font-light tracking-tight max-w-2xl mx-auto animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            {t("sectionSubtitle")}
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {values.map((value, idx) => {
            const IconComponent = value.icon;
            const animationDelay = `${0.2 + idx * 0.1}s`;

            return (
              <article
                key={value.id}
                className="group relative p-6 md:p-8 rounded-xl border border-white/10 bg-[#111113]/80 backdrop-blur-md hover:border-white/20 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay }}
              >
                {/* Icon */}
                <div className="mb-4 md:mb-6 flex justify-start">
                  <IconComponent
                    className="w-10 h-10 md:w-12 md:h-12 text-accent-blue"
                    aria-hidden="true"
                  />
                </div>

                {/* Value Name */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {t(`items.${value.index}.name`)}
                </h3>

                {/* Value Description */}
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {t(`items.${value.index}.description`)}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Values;
