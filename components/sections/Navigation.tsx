"use client";

import { useState, useEffect } from "react";
import { CodeIcon, ChevronRightIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#020204]/80 backdrop-blur-xl border-b border-white/5 py-4"
          : "bg-transparent border-transparent py-8"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-8 h-8 relative flex items-center justify-center overflow-hidden bg-white/5 rounded-sm border border-white/10 group-hover:border-white/20 transition-colors">
            <CodeIcon size={16} className="text-white relative z-10" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white">
            KOHELET
          </span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {["Solutions", "Process", "Intelligence"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[11px] font-medium text-neutral-400 hover:text-white transition-colors uppercase tracking-widest relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-300"></span>
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all clip-hud relative overflow-hidden group">
          <span className="relative z-10 flex items-center gap-2">
            Start Project <ChevronRightIcon size={10} />
          </span>
        </button>
      </div>
    </nav>
  );
}
