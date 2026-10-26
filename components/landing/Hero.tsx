import Image from "next/image";
import type { HeroVisual, LandingContent } from "@/content/landing";

interface HeroProps {
  brand: LandingContent["brand"];
  hero: LandingContent["hero"];
}

const CYCLE_SECONDS = 2.5;

function Visual({ visual }: { visual: HeroVisual }) {
  switch (visual.kind) {
    case "robot":
      return (
        <div className="kd-tile kd-tile--robot">
          {/* TODO: replace with the final Robot King render (this is the Blender preview from the mascot branch). */}
          <Image
            src="/images/robot-king.png"
            alt={visual.alt}
            width={1024}
            height={1024}
            priority
            sizes="(min-width: 1280px) 60vw, (min-width: 768px) 70vw, 92vw"
            className="h-full w-auto max-h-full object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.35)]"
          />
        </div>
      );
    case "tagline":
      return (
        <div className="kd-tile kd-tile--tagline" aria-hidden="true">
          <p>{visual.text}</p>
        </div>
      );
    case "workflow":
      return (
        <div className="kd-tile kd-tile--workflow" aria-hidden="true">
          <svg
            viewBox="0 0 400 300"
            className="h-full w-full"
            fill="none"
            stroke="#F6F4ED"
            strokeWidth="2"
          >
            <path d="M60 150 H140" />
            <path d="M200 150 H260 V80 H300" />
            <path d="M200 150 H260 V220 H300" />
            <circle cx="40" cy="150" r="20" fill="#2547E8" stroke="none" />
            <rect x="140" y="120" width="60" height="60" rx="12" fill="#F6F4ED" stroke="none" />
            <rect x="300" y="60" width="60" height="40" rx="10" fill="#2547E8" stroke="none" />
            <rect x="300" y="200" width="60" height="40" rx="10" fill="#2547E8" stroke="none" />
            <path d="M160 150 h20 M170 140 v20" stroke="#20211E" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <span className="absolute bottom-[8%] start-[8%] text-lg font-black tracking-tight text-[#F6F4ED]">
            {visual.label}
          </span>
        </div>
      );
    case "engines":
      return (
        <div className="kd-tile kd-tile--engines" aria-hidden="true">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-base font-bold opacity-80 md:text-xl">{visual.label}</p>
            <ul className="flex flex-wrap justify-center gap-2 md:gap-3">
              {visual.engines.map((name) => (
                <li key={name} className="kd-chip">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
  }
}

export function Hero({ brand, hero }: HeroProps) {
  const count = hero.visuals.length;

  return (
    <section id="top" className="kd-hero on-dark" aria-label={brand.name}>
      <p className="kd-wordmark kd-wordmark--top" aria-hidden="true">
        {brand.wordmarkTop}
      </p>

      <div className="kd-hero-stage">
        <div className="kd-hero-frame" role="group" aria-label={brand.tagline}>
          {hero.visuals.map((visual, i) => (
            <div
              key={visual.kind}
              className="kd-hero-visual"
              style={
                {
                  // Negative delay so item i becomes visible at i × 2.5s without a flash.
                  "--kd-delay": `${-(count - i) * CYCLE_SECONDS}s`,
                } as React.CSSProperties
              }
            >
              <Visual visual={visual} />
            </div>
          ))}
        </div>

        <div className="kd-hero-headline">
          <h1>{hero.headline}</h1>
        </div>
      </div>

      <div className="kd-hero-meta">
        <p className="max-w-[18ch] text-sm font-bold leading-snug text-white/80 md:text-base">
          {hero.sub}
        </p>
        <a href="#contact" className="kd-btn kd-btn--light">
          {hero.cta}
        </a>
      </div>

      <p className="kd-wordmark kd-wordmark--bottom" aria-hidden="true">
        {brand.wordmarkBottom}
      </p>
    </section>
  );
}
