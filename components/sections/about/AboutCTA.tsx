"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

/**
 * AboutCTA Component
 *
 * The closing call-to-action section of the About page, designed to convert
 * visitors into consultation bookings or contact form submissions.
 *
 * Features:
 * - Glassmorphism card design with backdrop blur
 * - Staggered fade-in-up animations
 * - Primary (consultation) and secondary (contact) CTAs
 * - Full RTL support for Hebrew locale
 * - Accessible with proper ARIA labels and focus states
 */

interface AboutCTAProps {
  /** Optional: Override default consultation link (defaults to "/contact") */
  calendlyUrl?: string;
}

export function AboutCTA({ calendlyUrl }: AboutCTAProps) {
  const t = useTranslations("about.cta");

  // Determine if the calendly URL is external
  const isExternalLink = calendlyUrl?.startsWith("http");
  const consultationHref = calendlyUrl || "/contact";

  return (
    <section
      id="cta"
      aria-labelledby="cta-heading"
      className="relative max-w-5xl mx-auto px-6 py-20 md:py-32"
    >
      {/* Decorative gradient orb - positioned behind the card */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Glassmorphism card wrapper */}
      <div className="max-w-3xl mx-auto bg-[#111113]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 lg:p-16">
        {/* Headline */}
        <h2
          id="cta-heading"
          className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-white text-center tracking-tight leading-[1.1] animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          {t("headline")}
        </h2>

        {/* Subtext */}
        <p
          className="text-base md:text-lg lg:text-xl text-neutral-400 text-center leading-relaxed font-light max-w-2xl mx-auto mt-6 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          {t("subtext")}
        </p>

        {/* Button group */}
        <div className="flex flex-col sm:flex-row rtl:sm:flex-row-reverse justify-center items-center gap-4 mt-8 md:mt-10">
          {/* Primary Button - Schedule Consultation */}
          {isExternalLink ? (
            <a
              href={consultationHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Schedule a consultation with Kohelet"
              className="
                bg-accent-blue hover:bg-accent-blue-hover
                text-white text-sm md:text-base font-semibold
                px-8 py-3.5 md:px-10 md:py-4
                rounded-full
                border border-accent-blue
                shadow-[0_0_30px_rgba(59,130,246,0.3)]
                hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]
                hover:scale-[1.02]
                transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-[#111113]
                animate-fade-in-up
              "
              style={{ animationDelay: "0.3s" }}
            >
              {t("primaryButton")}
            </a>
          ) : (
            <Link
              href={consultationHref}
              aria-label="Schedule a consultation with Kohelet"
              className="
                bg-accent-blue hover:bg-accent-blue-hover
                text-white text-sm md:text-base font-semibold
                px-8 py-3.5 md:px-10 md:py-4
                rounded-full
                border border-accent-blue
                shadow-[0_0_30px_rgba(59,130,246,0.3)]
                hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]
                hover:scale-[1.02]
                transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-[#111113]
                animate-fade-in-up
              "
              style={{ animationDelay: "0.3s" }}
            >
              {t("primaryButton")}
            </Link>
          )}

          {/* Secondary Button - Get in Touch */}
          <Link
            href="/contact"
            aria-label="Navigate to contact form"
            className="
              bg-transparent hover:bg-white/5
              text-white text-sm md:text-base font-medium
              px-8 py-3.5 md:px-10 md:py-4
              rounded-full
              border border-white/10 hover:border-white/20
              hover:scale-[1.02]
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-[#111113]
              animate-fade-in-up
            "
            style={{ animationDelay: "0.4s" }}
          >
            {t("secondaryButton")}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default AboutCTA;
