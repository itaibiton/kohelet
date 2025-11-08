"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: "Website Development",
    description:
      "Custom-built, high-performance websites using modern frameworks like Next.js, React, and TailwindCSS.",
  },
  {
    title: "App & Web App Development",
    description:
      "Robust, scalable, and intuitive apps built with cutting-edge technologies and clean code architecture.",
  },
  {
    title: "Web Design & UI/UX",
    description:
      "Intuitive, elegant interfaces focused on user engagement and smooth digital experiences.",
  },
  {
    title: "Brand Design",
    description:
      "Distinctive logos, color systems, and visuals that express your identity and vision.",
  },
  {
    title: "SEO & Performance",
    description:
      "Optimization strategies that ensure visibility, speed, and discoverability.",
  },
  {
    title: "Social Media & Digital Strategy",
    description:
      "Cohesive strategies to grow your online footprint and strengthen your brand story.",
  },
  {
    title: "Custom Development",
    description:
      "Tailored digital solutions designed to meet unique business goals and challenges.",
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial state to ensure content is visible
      gsap.set(titleRef.current, { opacity: 1, y: 0 });
      
      const cards = gridRef.current?.querySelectorAll(".service-card");
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

      // Service cards stagger animation
      if (cards) {
        gsap.fromTo(cards,
          { opacity: 0, y: 60 },
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
      id="services"
      className="relative w-full py-32 px-6 md:px-12 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <h2
          ref={titleRef}
          className="text-4xl md:text-5xl lg:text-6xl font-light text-[#fafafa] mb-20 tracking-tight text-center"
        >
          What We{" "}
          <span className="bg-gradient-to-r from-[#d4af37] to-[#2dd4bf] bg-clip-text text-transparent font-normal">
            Do
          </span>
        </h2>

        {/* Services Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => (
            <div
              key={index}
              className="service-card group relative p-8 bg-[#2a2a2a]/40 backdrop-blur-sm rounded-2xl border border-[#a0a0a0]/10 hover:border-[#d4af37]/50 transition-all duration-500 hover:shadow-xl hover:shadow-[#d4af37]/10 hover:-translate-y-2"
            >
              {/* Card Number */}
              <div className="text-5xl font-light text-[#d4af37]/20 group-hover:text-[#d4af37]/40 transition-colors duration-500 mb-4">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Service Title */}
              <h3 className="text-2xl font-normal text-[#fafafa] mb-4 group-hover:text-[#d4af37] transition-colors duration-300">
                {service.title}
              </h3>

              {/* Service Description */}
              <p className="text-[#a0a0a0] leading-relaxed font-light">
                {service.description}
              </p>

              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/0 via-[#d4af37]/0 to-[#2dd4bf]/0 group-hover:from-[#d4af37]/5 group-hover:to-[#2dd4bf]/5 rounded-2xl transition-all duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
