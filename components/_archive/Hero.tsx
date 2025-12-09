"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([headlineRef.current, subheadlineRef.current], {
        opacity: 0,
        y: 30,
      });

      gsap.set(ctaContainerRef.current, {
        opacity: 0,
        y: 20,
      });

      // Create animation timeline
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      // Animate headline
      tl.to(headlineRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        delay: 0.3,
      });

      // Animate subheadline
      tl.to(
        subheadlineRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1,
        },
        "-=0.6"
      );

      // Animate CTA buttons
      tl.to(
        ctaContainerRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
        },
        "-=0.4"
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen flex items-center justify-center px-6 md:px-12 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f]"
    >
      <div className="max-w-5xl mx-auto text-center">
        {/* Headline */}
        <h1
          ref={headlineRef}
          className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-[#fafafa] mb-8 leading-tight"
        >
          Crafting Digital Experiences
          <br />
          <span className="font-normal bg-gradient-to-r from-[#d4af37] to-[#2dd4bf] bg-clip-text text-transparent">
            that Inspire
          </span>
        </h1>

        {/* Subheadline */}
        <p
          ref={subheadlineRef}
          className="text-lg md:text-xl lg:text-2xl text-[#a0a0a0] max-w-3xl mx-auto mb-12 leading-relaxed font-light"
        >
          At Kohelet, we design and build websites, apps, and brands that
          elevate your digital presence — combining creativity, technology, and
          strategy for real impact.
        </p>

        {/* CTA Buttons */}
        <div
          ref={ctaContainerRef}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="#contact"
            className="group relative px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#c99a2e] text-[#1a1a1a] font-medium rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#d4af37]/20 hover:scale-105"
          >
            <span className="relative z-10">Let&apos;s Build Together</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#c99a2e] to-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </a>

          <a
            href="#services"
            className="group px-8 py-4 border border-[#a0a0a0]/30 text-[#fafafa] font-medium rounded-lg transition-all duration-300 hover:border-[#2dd4bf] hover:shadow-lg hover:shadow-[#2dd4bf]/10 hover:scale-105"
          >
            View Our Work
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
        <span className="text-xs text-[#a0a0a0] tracking-widest uppercase">
          Scroll
        </span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-[#a0a0a0] to-transparent"></div>
      </div>
    </section>
  );
}
