"use client";

import { useTranslations, useLocale } from "next-intl";
import { QuoteIcon, CheckCircleIcon } from "@/components/icons";

interface Testimonial {
  name: string;
  handle: string;
  avatar: string;
  quote: string;
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="shrink-0 w-[280px] sm:w-[360px] md:w-[420px] rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center gap-3">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="size-9 rounded-full object-cover"
        />
        <div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-white">
              {testimonial.name}
            </span>
            <CheckCircleIcon size={14} className="text-blue-400" />
          </div>
          <p className="text-xs text-neutral-400">{testimonial.handle}</p>
        </div>
      </div>
      <p className="mt-4 text-sm sm:text-base text-neutral-300">
        {testimonial.quote}
      </p>
    </article>
  );
}

export default function Testimonials() {
  const t = useTranslations("testimonials");
  const locale = useLocale();
  const isRtl = locale === "he";

  // Get testimonials from translations
  const row1: Testimonial[] = [0, 1, 2, 3].map((idx) => ({
    name: t(`row1.${idx}.name`),
    handle: t(`row1.${idx}.handle`),
    avatar: t(`row1.${idx}.avatar`),
    quote: t(`row1.${idx}.quote`),
  }));

  const row2: Testimonial[] = [0, 1, 2, 3].map((idx) => ({
    name: t(`row2.${idx}.name`),
    handle: t(`row2.${idx}.handle`),
    avatar: t(`row2.${idx}.avatar`),
    quote: t(`row2.${idx}.quote`),
  }));

  // For RTL, swap animation directions
  const row1Animation = isRtl
    ? "animate-[marquee-rtl_45s_linear_infinite]"
    : "animate-[marquee-ltr_45s_linear_infinite]";
  const row2Animation = isRtl
    ? "animate-[marquee-ltr_45s_linear_infinite]"
    : "animate-[marquee-rtl_45s_linear_infinite]";

  return (
    <section
      id="testimonials"
      className="py-16 sm:py-24 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="space-y-1">
          <p className="text-xs sm:text-sm text-neutral-400">
            {t("section_label")}
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl tracking-tight font-semibold text-white">
            {t("section_title")}
          </h2>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-neutral-400">
          <QuoteIcon size={16} />
          <span className="text-sm">{t("section_subtitle")}</span>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-[#08080a]">
        {/* Gradient Overlays */}
        <div className="pointer-events-none absolute inset-y-0 start-0 w-24 sm:w-40 bg-gradient-to-r rtl:bg-gradient-to-l from-[#08080a] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 end-0 w-24 sm:w-40 bg-gradient-to-l rtl:bg-gradient-to-r from-[#08080a] to-transparent z-10" />

        {/* Row 1 */}
        <div className="relative py-6 sm:py-8">
          <div className={`flex gap-4 sm:gap-5 will-change-transform ${row1Animation}`}>
            {/* First set */}
            {row1.map((testimonial, idx) => (
              <TestimonialCard key={`row1-a-${idx}`} testimonial={testimonial} />
            ))}
            {/* Duplicate for seamless loop */}
            {row1.map((testimonial, idx) => (
              <TestimonialCard key={`row1-b-${idx}`} testimonial={testimonial} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5" />

        {/* Row 2 */}
        <div className="relative py-6 sm:py-8">
          <div className={`flex gap-4 sm:gap-5 will-change-transform ${row2Animation}`}>
            {/* First set */}
            {row2.map((testimonial, idx) => (
              <TestimonialCard key={`row2-a-${idx}`} testimonial={testimonial} />
            ))}
            {/* Duplicate for seamless loop */}
            {row2.map((testimonial, idx) => (
              <TestimonialCard key={`row2-b-${idx}`} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
