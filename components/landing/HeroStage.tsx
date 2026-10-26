"use client";

import { useEffect, useState, type ReactNode } from "react";

const INTERVAL_MS = 4000;

interface HeroStageProps {
  lead: string;
  words: string[];
  /** vw cap for the headline font so the longest line fits the 50vw frame. */
  fitVw: number;
  frames: ReactNode[];
}

/**
 * The rounded frame in the middle of the split logo: visuals crossfade and the
 * last headline line swaps in sync, every 4s. Static under prefers-reduced-motion.
 */
export function HeroStage({ lead, words, fitVw, frames }: HeroStageProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setTick((t) => t + 1), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  const activeFrame = tick % frames.length;
  const word = words[tick % words.length];

  return (
    <div className="kd-hero-frame">
      {frames.map((frame, i) => (
        <div key={i} className={`kd-hero-visual${i === activeFrame ? " is-active" : ""}`} aria-hidden={i !== activeFrame}>
          {frame}
        </div>
      ))}
      <h1 className="kd-hero-title" style={{ "--kd-h1-fit": fitVw } as React.CSSProperties}>
        <span className="kd-hero-text">
          {lead}
          {"\n"}
          <span className="kd-hero-word">{word}</span>
        </span>
      </h1>
    </div>
  );
}
