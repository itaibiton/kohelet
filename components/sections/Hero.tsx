"use client";

import { useRef, useLayoutEffect, useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HolographicNetwork from "@/components/effects/HolographicNetwork";
import { StatItem } from "@/components/ui/StatItem";
import { Button } from "@/components/ui/Button";
import {
  TerminalIcon,
  ChevronRightIcon,
  ActivityIcon,
} from "@/components/icons";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const [rotationSpeed, setRotationSpeed] = useState(0.002);
  const [shape, setShape] = useState<"globe" | "triangle">("globe");
  const t = useTranslations("hero");
  const locale = useLocale();
  const isRtl = locale === "he";

  const containerRef = useRef<HTMLElement>(null);
  const visualContainerRef = useRef<HTMLDivElement>(null);
  const floatingCardsRef = useRef<HTMLDivElement>(null);
  const initialContentRef = useRef<HTMLDivElement>(null);
  const newContentRef = useRef<HTMLDivElement>(null);
  const newFloatingCardsRef = useRef<HTMLDivElement>(null);

  // We use a ref to track the current shape inside the GSAP callback
  // This avoids re-creating the timeline when state changes (which would kill the scroll position)
  const currentShapeRef = useRef<"globe" | "triangle">("globe");

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const dir = isRtl ? -1 : 1;
      const speedProxy = { value: 0.002 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=300%", // 300% scroll distance
          pin: true,
          scrub: 1,
          snap: {
            snapTo: "labels", // Snap to defined labels
            duration: { min: 0.2, max: 0.8 }, // Snap animation duration
            delay: 0.2, // Wait before snapping
            ease: "power1.inOut",
          }
        },
        onUpdate: function () {
          // Robust shape switching logic
          // Check progress of the timeline
          const p = this.progress();

          // Switch to Triangle earlier (during the fast spin at center, ~38%)
          if (p > 0.38 && currentShapeRef.current !== "triangle") {
            currentShapeRef.current = "triangle";
            setShape("triangle");
          }
          // Switch back to Globe if we scroll back up (<38%)
          else if (p < 0.38 && currentShapeRef.current !== "globe") {
            currentShapeRef.current = "globe";
            setShape("globe");
          }
        }
      });

      // 1. Initial State: Text fade out, Cards fade out, Visual moves to Center
      tl.addLabel("start") // Snap point: Start
        .to(initialContentRef.current, {
          x: dir * -100,
          opacity: 0,
          duration: 2,
          ease: "power2.inOut",
        })
        .to(floatingCardsRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 1, // Fade out cards faster
          ease: "power2.out",
        }, "<")
        .to(visualContainerRef.current, {
          x: (isRtl ? 55 : -65) + "%", // Tuned centering: -65% for LTR, 55% for RTL
          scale: 1.2,
          duration: 2,
          ease: "power2.inOut",
        }, "<")
        .addLabel("center"); // Snap point: Visual Center

      // 2. Speed Up Rotation
      tl.to(speedProxy, {
        value: 0.08,
        duration: 1.5,
        ease: "power1.in",
        onUpdate: () => setRotationSpeed(speedProxy.value),
      });

      // 3. Move Visual to Side & Reveal New Content
      tl.to(visualContainerRef.current, {
        x: dir * -100 + "%", // Move to opposite side
        scale: 1,
        duration: 2,
        ease: "power2.out",
      })
        .fromTo(newContentRef.current,
          { x: dir * 50, opacity: 0, pointerEvents: "none" },
          { x: 0, opacity: 1, pointerEvents: "auto", duration: 2, ease: "power2.out" },
          "<"
        )
        .fromTo(newFloatingCardsRef.current,
          { x: dir * -80 + "%", opacity: 0, scale: 0.8, pointerEvents: "none" },
          { x: dir * -115 + "%", opacity: 1, scale: 1, pointerEvents: "auto", duration: 2, ease: "power2.out" },
          "<"
        )
        // 4. Slow Down (morph triggered by onUpdate hook above)
        .to(speedProxy, {
          value: 0.002, // Slow back down
          duration: 2,
          ease: "power2.out",
          onUpdate: () => setRotationSpeed(speedProxy.value),
        })
        .addLabel("end"); // Snap point: End

    }, containerRef);

    return () => ctx.revert();
  }, [isRtl]); // IMPORTANT: Do NOT include `shape` here to verify timeline stability

  return (
    <section ref={containerRef} className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 z-10 overflow-visible min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center w-full">
        {/* Column 1: Initial Content */}
        <div className="relative h-[600px] flex flex-col justify-center lg:order-first">
          {/* Initial Content Wrapper */}
          <div ref={initialContentRef} className="space-y-10 relative z-10">
            {/* Decorative line */}
            <div className="absolute -start-12 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent hidden xl:block"></div>

            {/* Status Badge */}
            <div className="inline-flex items-center gap-3 px-3 py-1 bg-white/5 border border-white/5 rounded-full backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-blue-400 text-xs font-mono uppercase tracking-widest">
                {t("badge.text")}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-7xl font-medium leading-[0.95] tracking-tighter-custom text-white">
              {t("headline")}
            </h1>

            {/* Subheadline */}
            <p className="text-neutral-400 text-lg max-w-md leading-relaxed font-light border-s border-white/10 ps-6">
              {t("subheadline")}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <Button
                variant="primary"
                icon={<TerminalIcon size={14} />}
                href={t("cta_primary.href")}
              >
                {t("cta_primary.label")}
              </Button>
              <Button variant="ghost" href={t("cta_secondary.href")}>
                {t("cta_secondary.label")}{" "}
                <ChevronRightIcon
                  size={14}
                  className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform"
                />
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-10 border-t border-white/5 pt-8 mt-6">
              <StatItem
                value={t("stats.0.value").replace("%", "")}
                unit="%"
                label={t("stats.0.label")}
              />
              <StatItem
                value={t("stats.1.value").replace("+", "")}
                unit="+"
                label={t("stats.1.label")}
                color="text-blue-400"
              />
              <StatItem
                value={t("stats.2.value").split("/")[0]}
                unit="/7"
                label={t("stats.2.label")}
              />
            </div>
          </div>
        </div>

        {/* Column 2: Visual & New Content */}
        <div className="relative h-[600px] flex items-center justify-center lg:order-last">

          {/* Visual Container (Moves from here) */}
          <div ref={visualContainerRef} className="absolute inset-0 z-0 flex items-center justify-center">
            <HolographicNetwork shape={shape} rotationSpeed={rotationSpeed} />
          </div>

          {/* Floating Cards (Separate Ref to fade them out) */}
          <div ref={floatingCardsRef} className="absolute inset-0 z-0 pointer-events-none">
            {/* Floating Card 1 - Compile Success */}
            <div className="absolute start-0 top-1/3 p-5 bg-black/60 backdrop-blur-md border border-white/10 rounded-sm w-56 animate-pulse-slow border-s-2 border-s-blue-500 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] text-blue-400 font-mono tracking-widest">
                  COMPILE SUCCESS
                </span>
                <ActivityIcon size={12} className="text-blue-500" />
              </div>
              <div className="space-y-2">
                <div className="h-0.5 w-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-blue-500 w-[85%]"></div>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                  <span>MODULE: CORE_AI</span>
                  <span>85ms</span>
                </div>
              </div>
            </div>

            {/* Floating Card 2 - SEO Traffic */}
            <div className="absolute end-0 bottom-1/3 p-5 bg-black/60 backdrop-blur-md border border-white/10 rounded-sm w-56 animate-pulse-slow border-e-2 border-e-emerald-500 shadow-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-emerald-400 font-mono tracking-widest">
                  SEO TRAFFIC
                </span>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
              <div className="text-xl font-mono text-white mb-1">+428%</div>
              <div className="text-[10px] text-neutral-500 font-mono">
                Organic acquisition vector scaling exponentially.
              </div>
            </div>
          </div>

          {/* New Floating Cards (Separate Ref to fade them IN) */}
          <div ref={newFloatingCardsRef} className="absolute inset-0 z-0 pointer-events-none opacity-0">
            {/* New Card 1 - Knowledge Graph */}
            <div className="absolute start-0 bottom-1/4 p-5 bg-black/60 backdrop-blur-md border border-white/10 rounded-sm w-56 animate-pulse-slow border-s-2 border-s-purple-500 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] text-purple-400 font-mono tracking-widest">
                  GRAPH: OPTIMIZED
                </span>
                <ActivityIcon size={12} className="text-purple-500" />
              </div>
              <div className="space-y-2">
                <div className="h-0.5 w-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-purple-500 w-[95%]"></div>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                  <span>NODES: LINKED</span>
                  <span>1.2M</span>
                </div>
              </div>
            </div>

            {/* New Card 2 - Sources Verified */}
            <div className="absolute end-0 top-1/3 p-5 bg-black/60 backdrop-blur-md border border-white/10 rounded-sm w-56 animate-pulse-slow border-e-2 border-e-blue-400 shadow-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-blue-300 font-mono tracking-widest">
                  SOURCES: VERIFIED
                </span>
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-xl font-mono text-white mb-1">100%</div>
              <div className="text-[10px] text-neutral-500 font-mono">
                Cross-reference checks complete.
              </div>
            </div>
          </div>

          {/* New Content (Reveals here) - Matching Styled 1 */}
          <div ref={newContentRef} className="relative z-10 w-full opacity-0 pointer-events-none flex flex-col justify-center items-start h-full space-y-10">
            {/* Badge for New Content */}
            <div className="inline-flex items-center gap-3 px-3 py-1 bg-white/5 border border-white/5 rounded-full backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-blue-400 text-xs font-mono uppercase tracking-widest">
                THE WISDOM ENGINE
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-5xl lg:text-7xl font-medium leading-[0.95] tracking-tighter-custom text-white">
              Structure Your<br />Knowledge
            </h2>

            {/* Subheadline */}
            <p className="text-neutral-400 text-lg max-w-md leading-relaxed font-light border-s border-white/10 ps-6">
              Kohelet aggregates thousands of sources into a cohesive knowledge graph. Explore wisdom with unprecedented clarity.
            </p>

            {/* Single CTA */}
            <div className="pt-4">
              <Button
                variant="primary"
                icon={<ChevronRightIcon size={14} />}
                href="/technology"
              >
                Explore Architecture
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
