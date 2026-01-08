"use client";

import { useTranslations } from "next-intl";

/**
 * CompanyStory Component (UI-01)
 *
 * Displays the company's mission, vision, and narrative in a two-column
 * glassmorphism layout with staggered fade-in animations.
 *
 * Layout:
 * - Desktop: 12-column grid (5 cols left, 7 cols right)
 * - Mobile: Single column stack
 *
 * Translation keys used:
 * - about.story.sectionTitle
 * - about.story.missionLabel / missionText
 * - about.story.visionLabel / visionText
 * - about.story.narrative.p1 / p2 / p3
 */
export function CompanyStory() {
  const t = useTranslations("about.story");

  return (
    <section className="w-full bg-brand-dark">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-32">
        {/* Section Title */}
        <h2
          className="text-3xl md:text-4xl font-display font-medium text-white mb-12 md:mb-16 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          {t("sectionTitle")}
        </h2>

        {/* Two-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Mission + Vision Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* Mission Card */}
            <div
              className="bg-[#111113]/80 backdrop-blur-md border border-white/10 rounded-xl p-6 md:p-8 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <span className="text-xs uppercase tracking-widest text-accent-blue font-semibold">
                {t("missionLabel")}
              </span>
              <p className="mt-4 text-lg md:text-xl text-white font-light leading-relaxed">
                {t("missionText")}
              </p>
            </div>

            {/* Vision Card */}
            <div
              className="bg-[#111113]/80 backdrop-blur-md border border-white/10 rounded-xl p-6 md:p-8 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <span className="text-xs uppercase tracking-widest text-accent-blue font-semibold">
                {t("visionLabel")}
              </span>
              <p className="mt-4 text-lg md:text-xl text-white font-light leading-relaxed">
                {t("visionText")}
              </p>
            </div>
          </div>

          {/* Right Column: Company Narrative */}
          <div className="lg:col-span-7 space-y-6">
            {/* Paragraph 1: Problem/Genesis */}
            <p
              className="text-base text-neutral-400 leading-relaxed animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              {t("narrative.p1")}
            </p>

            {/* Paragraph 2: Our Approach */}
            <p
              className="text-base text-neutral-400 leading-relaxed animate-fade-in-up"
              style={{ animationDelay: "0.5s" }}
            >
              {t("narrative.p2")}
            </p>

            {/* Paragraph 3: What Makes Us Different */}
            <p
              className="text-base text-neutral-400 leading-relaxed animate-fade-in-up"
              style={{ animationDelay: "0.6s" }}
            >
              {t("narrative.p3")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CompanyStory;
