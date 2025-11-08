"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Initial animation
    const ctx = gsap.context(() => {
      // Set initial state to ensure navigation is visible
      gsap.set(navRef.current, { opacity: 1, y: 0 });
      
      gsap.fromTo(navRef.current,
        { y: -100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.5,
          ease: "power3.out",
        }
      );
    }, navRef);

    // Scroll listener for navbar background
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      ctx.revert();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#1a1a1a]/90 backdrop-blur-md shadow-lg shadow-black/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="text-2xl font-light text-[#fafafa] hover:text-[#d4af37] transition-colors duration-300"
          >
            Kohelet
          </a>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#about"
              className="text-[#a0a0a0] hover:text-[#fafafa] transition-colors duration-300 text-sm font-light"
            >
              About
            </a>
            <a
              href="#services"
              className="text-[#a0a0a0] hover:text-[#fafafa] transition-colors duration-300 text-sm font-light"
            >
              Services
            </a>
            <a
              href="#approach"
              className="text-[#a0a0a0] hover:text-[#fafafa] transition-colors duration-300 text-sm font-light"
            >
              Approach
            </a>
            <a
              href="#contact"
              className="px-6 py-2 bg-gradient-to-r from-[#d4af37] to-[#c99a2e] text-[#1a1a1a] text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-[#d4af37]/20 transition-all duration-300 hover:scale-105"
            >
              Contact
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#fafafa] hover:text-[#d4af37] transition-colors duration-300"
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
