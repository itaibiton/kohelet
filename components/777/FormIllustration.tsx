"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function FormIllustration() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const fields = el.querySelectorAll<HTMLElement>(".form-field");
    const inputs = el.querySelectorAll<HTMLElement>(".form-input");
    const btn = el.querySelector(".form-btn");
    const check = el.querySelector(".form-check");
    const texts = el.querySelectorAll(".typed-text");

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2, delay: 0.5 });

    // Phase 1: Fields appear
    tl.fromTo(fields, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.2, ease: "power2.out" });

    // Phase 2: Highlight first field + type
    tl.to(inputs[0]!, { backgroundColor: "rgba(251,191,36,0.15)", borderColor: "rgba(251,191,36,0.4)", duration: 0.3 }, "+=0.3");
    tl.fromTo(texts[0]!, { width: 0, opacity: 1 }, { width: "auto", duration: 0.8, ease: "steps(8)" }, "<0.1");

    // Phase 3: Unhighlight first, highlight second + type
    tl.to(inputs[0]!, { backgroundColor: "rgba(39,39,42,0.8)", borderColor: "rgba(63,63,70,1)", duration: 0.2 }, "+=0.2");
    tl.to(inputs[1]!, { backgroundColor: "rgba(251,191,36,0.15)", borderColor: "rgba(251,191,36,0.4)", duration: 0.3 }, "<");
    tl.fromTo(texts[1]!, { width: 0, opacity: 1 }, { width: "auto", duration: 0.6, ease: "steps(10)" }, "<0.1");

    // Phase 4: Unhighlight second, highlight third + type
    tl.to(inputs[1]!, { backgroundColor: "rgba(39,39,42,0.8)", borderColor: "rgba(63,63,70,1)", duration: 0.2 }, "+=0.2");
    tl.to(inputs[2]!, { backgroundColor: "rgba(251,191,36,0.15)", borderColor: "rgba(251,191,36,0.4)", duration: 0.3 }, "<");
    tl.fromTo(texts[2]!, { width: 0, opacity: 1 }, { width: "auto", duration: 0.7, ease: "steps(14)" }, "<0.1");

    // Phase 5: Unhighlight third, click button
    tl.to(inputs[2]!, { backgroundColor: "rgba(39,39,42,0.8)", borderColor: "rgba(63,63,70,1)", duration: 0.2 }, "+=0.3");
    tl.to(btn!, { scale: 0.93, duration: 0.1 }, "+=0.1");
    tl.to(btn!, { scale: 1, duration: 0.2, ease: "back.out(2)" });

    // Phase 6: Show success check
    tl.to(btn!, { opacity: 0, y: -5, duration: 0.2 }, "+=0.1");
    tl.fromTo(check!, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, "<0.1");

    // Phase 7: Reset
    tl.to([...fields, check!], { opacity: 0, duration: 0.4 }, "+=1.5");
    tl.set(texts, { width: 0 });
    tl.set(inputs, { backgroundColor: "rgba(39,39,42,0.8)", borderColor: "rgba(63,63,70,1)" });
    tl.set(btn!, { opacity: 1, y: 0 });
    tl.set(check!, { opacity: 0, scale: 0.5 });

    return () => { tl.kill(); };
  }, []);

  return (
    <div ref={containerRef} className="w-full max-w-[190px] sm:max-w-[220px] relative">
      <div className="flex flex-col gap-1 sm:gap-1.5 relative">
        {/* Name field */}
        <div className="form-field opacity-0">
          <div className="form-input bg-zinc-800/80 border border-zinc-700 rounded-md px-2.5 py-1.5 flex items-center gap-1.5 transition-colors duration-200">
            <svg className="w-3 h-3 text-zinc-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            <div className="overflow-hidden">
              <span className="typed-text text-[10px] text-zinc-300 whitespace-nowrap inline-block overflow-hidden" style={{ width: 0 }}>ישראל ישראלי</span>
            </div>
          </div>
        </div>

        {/* Phone field */}
        <div className="form-field opacity-0">
          <div className="form-input bg-zinc-800/80 border border-zinc-700 rounded-md px-2.5 py-1.5 flex items-center gap-1.5 transition-colors duration-200">
            <svg className="w-3 h-3 text-zinc-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
            </svg>
            <div className="overflow-hidden" dir="ltr">
              <span className="typed-text text-[10px] text-zinc-300 whitespace-nowrap inline-block overflow-hidden" style={{ width: 0 }}>050-123-4567</span>
            </div>
          </div>
        </div>

        {/* Email field */}
        <div className="form-field opacity-0">
          <div className="form-input bg-zinc-800/80 border border-zinc-700 rounded-md px-2.5 py-1.5 flex items-center gap-1.5 transition-colors duration-200">
            <svg className="w-3 h-3 text-zinc-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" />
            </svg>
            <div className="overflow-hidden" dir="ltr">
              <span className="typed-text text-[10px] text-zinc-300 whitespace-nowrap inline-block overflow-hidden" style={{ width: 0 }}>israel@email.com</span>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="form-field opacity-0">
          <div className="form-btn bg-gradient-to-l from-amber-500 to-yellow-400 rounded-md px-3 py-1.5 text-center cursor-pointer">
            <span className="text-[10px] font-bold text-black">שלח פרטים →</span>
          </div>
        </div>

        {/* Success check */}
        <div className="form-check opacity-0 absolute inset-0 flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
