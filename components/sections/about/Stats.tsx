"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugin on client side only
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Stat data structure for the automation metrics
 */
interface Stat {
  id: string;
  value: number;
  suffix: string;
  translationKey: string;
}

/**
 * Stats data - automation-focused metrics
 */
const stats: Stat[] = [
  { id: "hoursSaved", value: 10000, suffix: "+", translationKey: "hoursSaved.label" },
  { id: "tasksAutomated", value: 500, suffix: "+", translationKey: "tasksAutomated.label" },
  { id: "efficiency", value: 80, suffix: "%", translationKey: "efficiency.label" },
  { id: "clientsServed", value: 50, suffix: "+", translationKey: "clientsServed.label" },
];

/**
 * Stats Component (PRD-02)
 *
 * Displays 4 automation-focused metrics with GSAP counter animations.
 * Features scroll-triggered animations at 80% viewport entry,
 * glassmorphism card styling, and prefers-reduced-motion support.
 *
 * Layout:
 * - Mobile: 2 columns grid
 * - Desktop: 4 columns grid
 *
 * Translation keys used:
 * - about.stats.sectionTitle (optional)
 * - about.stats.hoursSaved.label
 * - about.stats.tasksAutomated.label
 * - about.stats.efficiency.label
 * - about.stats.clientsServed.label
 */
export function Stats() {
  const t = useTranslations("about.stats");
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // Set final values immediately without animation
      counterRefs.current.forEach((el, index) => {
        if (el) {
          el.innerText = stats[index].value.toLocaleString();
        }
      });
      // Make cards visible immediately
      cardRefs.current.forEach((card) => {
        if (card) {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Set initial state for cards (hidden and shifted down)
      cardRefs.current.forEach((card) => {
        if (card) {
          gsap.set(card, { opacity: 0, y: 30 });
        }
      });

      // Card fade-in animation with stagger
      gsap.to(cardRefs.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      // Counter animations with ScrollTrigger
      counterRefs.current.forEach((el, index) => {
        if (!el) return;
        const target = stats[index].value;

        // Create a proxy object for GSAP to animate
        const proxy = { value: 0 };

        gsap.to(proxy, {
          value: target,
          duration: 2.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
          onUpdate: () => {
            el.innerText = Math.round(proxy.value).toLocaleString();
          },
        });
      });
    }, sectionRef);

    // Cleanup ScrollTrigger instances on unmount
    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-brand-dark"
      role="group"
      aria-label="Company statistics and automation metrics"
    >
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="bg-[#111113]/80 backdrop-blur-md border border-white/10 rounded-xl md:rounded-2xl p-6 md:p-8"
            >
              {/* Value with animated counter */}
              <div className="flex items-baseline">
                <span
                  ref={(el) => {
                    counterRefs.current[index] = el;
                  }}
                  className="text-4xl md:text-5xl font-bold text-white"
                  aria-live="polite"
                >
                  0
                </span>
                {/* Static suffix with accent color */}
                <span className="text-4xl md:text-5xl font-bold text-accent-blue">
                  {stat.suffix}
                </span>
              </div>

              {/* Label */}
              <p className="mt-3 text-sm text-neutral-400 uppercase tracking-wide">
                {t(stat.translationKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;
