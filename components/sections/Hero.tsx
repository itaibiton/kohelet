"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect, useRef } from "react";
import { ChevronRight, Bot, User, Zap } from "lucide-react";

function useCountUp(target: number, duration = 2000, delay = 0, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) { setCount(0); return; }
    const timeout = setTimeout(() => {
      const startTime = Date.now();
      const step = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [start, target, duration, delay]);

  return count;
}

function ChatPanel() {
  const t = useTranslations("hero");
  const [phase, setPhase] = useState(0);
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [text3, setText3] = useState("");
  const [textUser, setTextUser] = useState("");
  const [textAi, setTextAi] = useState("");
  const [textStatus, setTextStatus] = useState("");
  const [progressWidth, setProgressWidth] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const line1 = `@System: ${t("chat.system_message")}`;
  const line2 = `>> ${t("chat.optimization_complete")}`;
  const line3 = t("chat.launching_protocols");
  const userLine = t("chat.user_message");
  const aiLine = t("chat.executing");
  const statusLine = t("chat.status");

  useEffect(() => {
    // Start after a delay
    timerRef.current = setTimeout(() => setPhase(1), 1000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  // Typing helper
  function typeText(
    fullText: string,
    setter: (v: string) => void,
    speed: number,
    onDone: () => void
  ) {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setter(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(interval);
        onDone();
      }
    }, speed);
    return interval;
  }

  useEffect(() => {
    if (phase === 1) {
      typeText(line1, setText1, 25, () => {
        setTimeout(() => setPhase(2), 150);
      });
    } else if (phase === 2) {
      typeText(line2, setText2, 25, () => {
        setTimeout(() => setPhase(3), 150);
      });
    } else if (phase === 3) {
      typeText(line3, setText3, 25, () => {
        setTimeout(() => setPhase(4), 500);
      });
    } else if (phase === 4) {
      typeText(userLine, setTextUser, 30, () => {
        setTimeout(() => setPhase(5), 500);
      });
    } else if (phase === 5) {
      typeText(aiLine, setTextAi, 25, () => {
        setTimeout(() => setPhase(6), 300);
      });
    } else if (phase === 6) {
      setProgressWidth(100);
      typeText(statusLine, setTextStatus, 25, () => {
        setTimeout(() => setPhase(7), 300);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const stat1 = useCountUp(47, 1500, 0, phase >= 7);
  const stat2 = useCountUp(97, 1500, 200, phase >= 7);

  return (
    <div className="relative w-[340px] h-[580px] bg-[#050505]/95 rounded-[32px] border border-white/10 shadow-[0_0_60px_rgba(59,130,246,0.15)] overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 w-full h-16 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
          <div className="w-2 h-2 rounded-full bg-green-500/50" />
        </div>
        <div className="text-[10px] font-mono text-white/30">agent_v4.tsx</div>
      </div>

      {/* Content */}
      <div className="pt-20 px-6 pb-6 h-full flex flex-col relative">
        <div className="space-y-3 mb-8">
          {/* AI Message 1 */}
          <div className={`flex gap-3 transition-all duration-500 ${phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center border border-accent-blue/20 shrink-0">
              <Bot className="w-4 h-4 text-accent-blue" />
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-4 text-xs text-white/80 leading-relaxed font-light min-h-[60px]">
              <span className="text-accent-blue">{text1}</span>
              {phase >= 2 && <><br /><span className="text-emerald-400">{text2}</span></>}
              {phase >= 3 && <><br />{text3}</>}
              {phase >= 1 && phase < 4 && (
                <span className="inline-block w-[2px] h-3 bg-accent-blue/70 animate-pulse ml-0.5 align-middle" />
              )}
            </div>
          </div>

          {/* User Message */}
          <div className={`flex gap-3 flex-row-reverse transition-all duration-500 ${phase >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="bg-accent-blue/10 border border-accent-blue/20 rounded-2xl rounded-tr-none p-4 text-xs text-white/90 font-light">
              {textUser}
              {phase === 4 && (
                <span className="inline-block w-[2px] h-3 bg-white/70 animate-pulse ml-0.5 align-middle" />
              )}
            </div>
          </div>

          {/* AI Message 2 */}
          <div className={`flex gap-3 transition-all duration-500 ${phase >= 5 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center border border-accent-blue/20 shrink-0">
              <Bot className="w-4 h-4 text-accent-blue" />
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-4 text-xs text-white/80 leading-relaxed font-light">
              {textAi}
              {phase >= 6 && (
                <div className="mt-2 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-blue rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progressWidth}%` }}
                  />
                </div>
              )}
              {textStatus && (
                <span className="block mt-1 text-[10px] text-white/40">{textStatus}</span>
              )}
              {phase >= 5 && phase < 7 && (
                <span className="inline-block w-[2px] h-3 bg-accent-blue/70 animate-pulse ml-0.5 align-middle" />
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className={`mt-auto grid grid-cols-2 gap-3 transition-all duration-700 ${phase >= 7 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
              {t("stats.traffic_label")}
            </div>
            <div className="text-lg font-medium text-white font-mono">
              +{stat1}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
              {t("stats.leads_label")}
            </div>
            <div className="text-lg font-medium text-white font-mono">
              {stat2}%
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
    </div>
  );
}

export function Hero() {
  const t = useTranslations("hero");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <section className="min-h-screen w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center px-6 pt-32 pb-12 gap-12 relative">
      {/* Left Content */}
      <div className="flex-1 w-full space-y-8 relative z-10">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-blue/30 bg-accent-blue/10 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <Zap className="w-3 h-3 text-accent-blue fill-accent-blue" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-accent-blue">
            {t("badge.text")}
          </span>
        </div>

        <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <p className="text-accent-blue font-medium text-sm tracking-wide">{t("tagline")}</p>
          <h1 className="text-5xl font-display font-semibold tracking-tighter leading-[0.95] text-white">
            {t("headline.prefix")}
            <span className="text-accent-blue">{t("headline.highlight")}</span>
            {t("headline.middle")}
            <br />
            <span className="text-white/30">{t("headline.faded")}</span>
          </h1>
        </div>

        <div className="space-y-6 max-w-lg animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <h2 className="text-xl text-white font-medium">
            {t("secondary.prefix")}{" "}
            <span className="text-accent-blue border-b border-accent-blue/30 pb-0.5">
              {t("secondary.highlight")}
            </span>{" "}
            {t("secondary.suffix")}
          </h2>
          <p className="text-sm md:text-[15px] text-white/50 leading-relaxed font-light">
            {t("subtitle")}
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <a
            href="#contact"
            className="group relative inline-flex items-center gap-2 px-8 py-3.5 bg-accent-blue text-white rounded-full text-sm font-semibold tracking-wide transition-all duration-300 border border-accent-blue hover:bg-accent-blue-hover hover:border-accent-blue-hover shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]"
          >
            {t("cta_primary")}
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
          </a>
          <a
            href="#solutions"
            className="group inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-full text-sm font-medium text-white transition-all"
          >
            {t("cta_secondary")}
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
          </a>
        </div>
      </div>

      {/* Right Content: Animated Chat */}
      <div
        className="flex-1 w-full flex justify-center md:justify-end relative z-10 animate-fade-in-up"
        style={{ animationDelay: "0.9s" }}
      >
        {mounted ? (
          <ChatPanel />
        ) : (
          <div className="w-[340px] h-[580px] bg-[#050505]/95 rounded-[32px] border border-white/10" />
        )}
      </div>
    </section>
  );
}

export default Hero;
