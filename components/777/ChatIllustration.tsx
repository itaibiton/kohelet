"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function ChatIllustration() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const bubbles = el.querySelectorAll(".chat-bubble");
    const typing = el.querySelector(".typing-dots");

    // Stagger bubbles in
    gsap.fromTo(
      bubbles,
      { opacity: 0, y: 15, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.6, ease: "back.out(1.4)", delay: 0.3 }
    );

    // Typing indicator pulses after bubbles
    if (typing) {
      gsap.fromTo(
        typing,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.4, delay: 2.2, ease: "back.out(1.4)" }
      );
    }

    // Loop: fade out and repeat
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1, delay: 4 });
    tl.to(bubbles, { opacity: 0, y: -10, duration: 0.4, stagger: 0.1 })
      .to(typing!, { opacity: 0, duration: 0.3 }, "<")
      .set(bubbles, { y: 15, scale: 0.9 })
      .set(typing!, { scale: 0.8 })
      .to(bubbles, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.6, ease: "back.out(1.4)" })
      .to(typing!, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.4)" }, "-=0.2");

    return () => { tl.kill(); };
  }, []);

  return (
    <div ref={containerRef} className="w-full max-w-[240px] sm:max-w-[280px] flex flex-col gap-2 sm:gap-2.5 px-1 sm:px-2">
      {/* Incoming message */}
      <div className="chat-bubble opacity-0 flex items-end gap-2">
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          </svg>
        </div>
        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl rounded-br-sm px-3 py-2 sm:px-4 sm:py-2.5 max-w-[170px] sm:max-w-[200px]">
          <p className="text-[10px] sm:text-xs text-zinc-300 leading-relaxed">היי, ראיתי את המבצע של 777 ₪ 👋</p>
        </div>
      </div>

      {/* Outgoing message */}
      <div className="chat-bubble opacity-0 flex items-end gap-2 flex-row-reverse">
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
          <span className="text-amber-400 text-xs font-bold">K</span>
        </div>
        <div className="bg-amber-500/15 border border-amber-500/20 rounded-2xl rounded-bl-sm px-3 py-2 sm:px-4 sm:py-2.5 max-w-[170px] sm:max-w-[200px]">
          <p className="text-[10px] sm:text-xs text-amber-200 leading-relaxed">בטח! נשמח לעזור 🎰 מתי נוח לדבר?</p>
        </div>
      </div>

      {/* Incoming reply */}
      <div className="chat-bubble opacity-0 flex items-end gap-2">
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          </svg>
        </div>
        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl rounded-br-sm px-3 py-2 sm:px-4 sm:py-2.5 max-w-[170px] sm:max-w-[200px]">
          <p className="text-[10px] sm:text-xs text-zinc-300 leading-relaxed">עכשיו! אפשר להתקשר?</p>
        </div>
      </div>

      {/* Typing indicator */}
      <div className="typing-dots opacity-0 flex items-end gap-2">
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
          <span className="text-amber-400 text-xs font-bold">K</span>
        </div>
        <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-2xl px-4 py-3 flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400/60 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 rounded-full bg-amber-400/60 animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 rounded-full bg-amber-400/60 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
