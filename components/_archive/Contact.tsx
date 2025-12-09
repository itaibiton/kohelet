"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          end: "top 50%",
          scrub: 1,
        },
        opacity: 0,
        y: 50,
      });

      // Subtitle animation
      gsap.from(subtitleRef.current, {
        scrollTrigger: {
          trigger: subtitleRef.current,
          start: "top 75%",
          end: "top 45%",
          scrub: 1,
        },
        opacity: 0,
        y: 30,
      });

      // Form animation
      gsap.from(formRef.current, {
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 70%",
          end: "top 40%",
          scrub: 1,
        },
        opacity: 0,
        y: 40,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    // You can add your form submission logic here
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full py-32 px-6 md:px-12 bg-[#1a1a1a]"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        <h2
          ref={titleRef}
          className="text-4xl md:text-5xl lg:text-6xl font-light text-[#fafafa] mb-8 tracking-tight text-center"
        >
          Let&apos;s Create Something{" "}
          <span className="bg-gradient-to-r from-[#d4af37] to-[#2dd4bf] bg-clip-text text-transparent font-normal">
            Exceptional
          </span>
        </h2>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl text-[#a0a0a0] leading-relaxed font-light text-center mb-16"
        >
          Tell us about your idea — we&apos;ll help you turn it into a powerful
          digital experience.
        </p>

        {/* Contact Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-6 bg-[#2a2a2a]/30 backdrop-blur-sm p-8 md:p-12 rounded-2xl border border-[#a0a0a0]/10"
        >
          {/* Name Field */}
          <div className="group">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[#a0a0a0] mb-2 group-focus-within:text-[#d4af37] transition-colors duration-300"
            >
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#a0a0a0]/20 rounded-lg text-[#fafafa] placeholder-[#a0a0a0]/50 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all duration-300"
              placeholder="John Doe"
            />
          </div>

          {/* Email Field */}
          <div className="group">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#a0a0a0] mb-2 group-focus-within:text-[#d4af37] transition-colors duration-300"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#a0a0a0]/20 rounded-lg text-[#fafafa] placeholder-[#a0a0a0]/50 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all duration-300"
              placeholder="john@example.com"
            />
          </div>

          {/* Message Field */}
          <div className="group">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-[#a0a0a0] mb-2 group-focus-within:text-[#d4af37] transition-colors duration-300"
            >
              Tell us about your project
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#a0a0a0]/20 rounded-lg text-[#fafafa] placeholder-[#a0a0a0]/50 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all duration-300 resize-none"
              placeholder="I'd like to discuss..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full group relative px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#c99a2e] text-[#1a1a1a] font-medium rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#d4af37]/30 hover:scale-[1.02]"
          >
            <span className="relative z-10">Start a Project</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#c99a2e] to-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </form>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-[#a0a0a0] text-sm">
            Or reach us at{" "}
            <a
              href="mailto:hello@kohelet.com"
              className="text-[#2dd4bf] hover:text-[#d4af37] transition-colors duration-300"
            >
              hello@kohelet.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
