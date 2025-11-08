"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Discover",
    description: "Understand needs, users, and goals.",
  },
  {
    number: "02",
    title: "Design",
    description: "Create the look, flow, and interactions.",
  },
  {
    number: "03",
    title: "Develop",
    description: "Build with precision and best practices.",
  },
  {
    number: "04",
    title: "Launch & Evolve",
    description: "Optimize, maintain, and grow.",
  },
];

export default function Approach() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial state to ensure content is visible
      gsap.set(titleRef.current, { opacity: 1, y: 0 });
      gsap.set(introRef.current, { opacity: 1, y: 0 });
      
      const stepElements = timelineRef.current?.querySelectorAll(".step-item");
      const timelineLine = timelineRef.current?.querySelector(".timeline-line");
      
      if (stepElements) {
        gsap.set(stepElements, { opacity: 1, x: 0 });
      }
      if (timelineLine) {
        gsap.set(timelineLine, { scaleY: 1 });
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

      // Intro text animation
      gsap.fromTo(introRef.current,
        { opacity: 0, y: 30 },
        {
          scrollTrigger: {
            trigger: introRef.current,
            start: "top 75%",
            end: "top 45%",
            scrub: 1,
          },
          opacity: 1,
          y: 0,
        }
      );

      // Timeline steps animation
      if (stepElements) {
        stepElements.forEach((step, index) => {
          gsap.fromTo(step,
            { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
            {
              scrollTrigger: {
                trigger: step,
                start: "top 80%",
                end: "top 50%",
                scrub: 1,
              },
              opacity: 1,
              x: 0,
            }
          );
        });
      }

      // Animate timeline line
      if (timelineLine) {
        gsap.fromTo(timelineLine,
          { scaleY: 0 },
          {
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 70%",
              end: "bottom 30%",
              scrub: 1,
            },
            scaleY: 1,
            transformOrigin: "top",
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="approach"
      className="relative w-full py-32 px-6 md:px-12 bg-[#1a1a1a]"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Title */}
        <h2
          ref={titleRef}
          className="text-4xl md:text-5xl lg:text-6xl font-light text-[#fafafa] mb-12 tracking-tight text-center"
        >
          Our{" "}
          <span className="bg-gradient-to-r from-[#d4af37] to-[#2dd4bf] bg-clip-text text-transparent font-normal">
            Approach
          </span>
        </h2>

        {/* Intro Text */}
        <p
          ref={introRef}
          className="text-xl md:text-2xl text-[#a0a0a0] leading-relaxed font-light text-center mb-20 max-w-3xl mx-auto"
        >
          Every project starts with listening — understanding your goals, your
          users, and your story. We then design and build digital experiences
          that merge technology and aesthetics seamlessly.
        </p>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Vertical line */}
          <div className="timeline-line absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#d4af37] via-[#2dd4bf] to-[#d4af37] hidden md:block"></div>

          {/* Steps */}
          <div className="space-y-16 md:space-y-24">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`step-item relative flex flex-col md:flex-row items-center gap-8 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div
                  className={`flex-1 ${
                    index % 2 === 0 ? "md:text-right" : "md:text-left"
                  } text-center md:text-inherit`}
                >
                  <div className="text-6xl md:text-7xl font-light text-[#d4af37]/20 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-normal text-[#fafafa] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-lg text-[#a0a0a0] font-light">
                    {step.description}
                  </p>
                </div>

                {/* Center dot */}
                <div className="hidden md:block relative z-10">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#d4af37] to-[#2dd4bf] shadow-lg shadow-[#d4af37]/50"></div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block flex-1"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
