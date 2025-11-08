"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraph1Ref = useRef<HTMLParagraphElement>(null);
  const paragraph2Ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial state to ensure content is visible
      gsap.set(titleRef.current, { opacity: 1, y: 0, scale: 1 });
      gsap.set([paragraph1Ref.current, paragraph2Ref.current], { opacity: 1, y: 0 });

      // Title animation
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
          },
          opacity: 1,
          y: 0,
          scale: 1,
        }
      );

      // Paragraph animations with stagger
      gsap.fromTo([paragraph1Ref.current, paragraph2Ref.current],
        { opacity: 0, y: 40 },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 40%",
            scrub: 1,
          },
          opacity: 1,
          y: 0,
          stagger: 0.2,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full py-32 px-6 md:px-12 bg-[#1a1a1a]"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        <h2
          ref={titleRef}
          className="text-4xl md:text-5xl lg:text-6xl font-light text-[#fafafa] mb-16 tracking-tight"
        >
          Who We{" "}
          <span className="bg-gradient-to-r from-[#d4af37] to-[#2dd4bf] bg-clip-text text-transparent font-normal">
            Are
          </span>
        </h2>

        {/* Content */}
        <div className="space-y-8">
          <p
            ref={paragraph1Ref}
            className="text-xl md:text-2xl text-[#a0a0a0] leading-relaxed font-light"
          >
            Kohelet is a digital studio specializing in{" "}
            <span className="text-[#fafafa] font-normal">
              full-stack development
            </span>
            ,{" "}
            <span className="text-[#fafafa] font-normal">UI/UX design</span>,
            and{" "}
            <span className="text-[#fafafa] font-normal">brand identity</span>.
            We&apos;re passionate about crafting elegant, high-performance
            experiences that connect businesses with their audiences.
          </p>

          <p
            ref={paragraph2Ref}
            className="text-xl md:text-2xl text-[#a0a0a0] leading-relaxed font-light"
          >
            From concept to launch, we combine{" "}
            <span className="text-[#2dd4bf]">design thinking</span>,{" "}
            <span className="text-[#2dd4bf]">modern tech</span>, and{" "}
            <span className="text-[#2dd4bf]">digital strategy</span> to help
            your brand thrive online.
          </p>
        </div>

        {/* Decorative element */}
        <div className="mt-16 h-[1px] bg-gradient-to-r from-transparent via-[#a0a0a0]/20 to-transparent"></div>
      </div>
    </section>
  );
}
