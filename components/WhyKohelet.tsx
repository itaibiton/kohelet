"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reasons = [
  {
    icon: "✨",
    title: "Elegant & Modern Design",
    description: "Sophisticated aesthetics that stand the test of time.",
  },
  {
    icon: "⚡",
    title: "Fast, Scalable, Future-Ready Code",
    description: "Built for performance and growth.",
  },
  {
    icon: "🧭",
    title: "Strategy-Driven Development",
    description: "Every decision guided by your business goals.",
  },
  {
    icon: "🎯",
    title: "Results that Matter",
    description: "We measure success by your success.",
  },
  {
    icon: "🤝",
    title: "Transparent & Collaborative Process",
    description: "You're part of the journey, every step of the way.",
  },
];

export default function WhyKohelet() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial state to ensure content is visible
      gsap.set(titleRef.current, { opacity: 1, y: 0 });
      
      const cards = gridRef.current?.querySelectorAll(".reason-card");
      if (cards) {
        gsap.set(cards, { opacity: 1, y: 0 });
      }

      // Title animation
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 50 },
        {
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
          },
          opacity: 1,
          y: 0,
        }
      );

      // Reason cards stagger animation
      if (cards) {
        gsap.fromTo(cards,
          { opacity: 0, y: 50 },
          {
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why-kohelet"
      className="relative w-full py-32 px-6 md:px-12 bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <h2
          ref={titleRef}
          className="text-4xl md:text-5xl lg:text-6xl font-light text-[#fafafa] mb-20 tracking-tight text-center"
        >
          Why{" "}
          <span className="bg-gradient-to-r from-[#d4af37] to-[#2dd4bf] bg-clip-text text-transparent font-normal">
            Kohelet
          </span>
          ?
        </h2>

        {/* Reasons Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="reason-card group relative p-8 bg-[#2a2a2a]/30 backdrop-blur-sm rounded-xl border border-[#a0a0a0]/10 hover:border-[#2dd4bf]/50 transition-all duration-500 hover:shadow-xl hover:shadow-[#2dd4bf]/10 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {reason.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-normal text-[#fafafa] mb-3 group-hover:text-[#2dd4bf] transition-colors duration-300">
                {reason.title}
              </h3>

              {/* Description */}
              <p className="text-[#a0a0a0] leading-relaxed font-light">
                {reason.description}
              </p>

              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#2dd4bf]/0 to-[#d4af37]/0 group-hover:from-[#2dd4bf]/5 group-hover:to-[#d4af37]/5 rounded-xl transition-all duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
