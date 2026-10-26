import Image from "next/image";
import type { HeroVisual, LandingContent } from "@/content/landing";
import { GLYPH_ORDER, KoheletGlyph, type GlyphName } from "./KoheletGlyphs";
import { HeroStage } from "./HeroStage";
import { HeroIntro } from "./HeroIntro";

interface HeroProps {
  brand: LandingContent["brand"];
  hero: LandingContent["hero"];
}

const IVORY = "#F6F4ED";
const BLUE = "#2547E8";
const DARK = "#20211E";

/* Illustrations that cycle in the frame. Decorative except the mascot photo.
   Focal content sits in the upper ~65% so the caption at the bottom never covers it. */
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
            sizes="50vw"
            className="kd-robot"
          />
        </div>
      );

    case "automation":
      // Inputs on the start side flow through one blue "brain" node into finished outputs.
      return (
        <div className="kd-tile kd-tile--automation" aria-hidden="true">
          <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" className="kd-illu">
            <g className="kd-flow" fill="none" stroke={IVORY} strokeWidth="3" strokeLinecap="round">
              <path d="M70 70 C120 70 120 130 170 130" />
              <path d="M70 130 H170" />
              <path d="M70 190 C120 190 120 130 170 130" />
              <path d="M230 130 C270 130 270 90 310 90" />
              <path d="M230 130 C270 130 270 170 310 170" />
            </g>
            <g fill={IVORY}>
              <circle cx="56" cy="70" r="16" />
              <circle cx="56" cy="130" r="16" />
              <circle cx="56" cy="190" r="16" />
            </g>
            <g fill={DARK} opacity="0.7">
              <rect x="48" y="66" width="16" height="3" rx="1.5" />
              <rect x="48" y="128" width="16" height="3" rx="1.5" />
              <rect x="48" y="186" width="16" height="3" rx="1.5" />
              <rect x="48" y="74" width="10" height="3" rx="1.5" />
              <rect x="48" y="134" width="10" height="3" rx="1.5" />
              <rect x="48" y="194" width="10" height="3" rx="1.5" />
            </g>
            <rect x="170" y="100" width="60" height="60" rx="16" fill={BLUE} />
            <path
              d="M200 112 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4z"
              fill={IVORY}
            />
            <rect x="310" y="72" width="64" height="36" rx="10" fill={IVORY} />
            <rect x="310" y="152" width="64" height="36" rx="10" fill={IVORY} />
            <path d="M324 90 l8 8 16 -16" fill="none" stroke={BLUE} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M324 170 l8 8 16 -16" fill="none" stroke={BLUE} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );

    case "answers":
      // A chat thread where the answer bubble highlights one line: the business shows up in AI answers.
      return (
        <div className="kd-tile kd-tile--answers" aria-hidden="true">
          <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" className="kd-illu">
            <rect x="150" y="34" width="200" height="44" rx="18" fill={IVORY} opacity="0.9" />
            <rect x="170" y="50" width="120" height="6" rx="3" fill={DARK} opacity="0.45" />
            <rect x="300" y="50" width="30" height="6" rx="3" fill={DARK} opacity="0.45" />
            <rect x="50" y="96" width="250" height="118" rx="22" fill={DARK} />
            <path d="M80 214 l-14 22 32 -22z" fill={DARK} />
            <rect x="74" y="118" width="150" height="7" rx="3.5" fill={IVORY} opacity="0.55" />
            <rect x="74" y="136" width="200" height="7" rx="3.5" fill={IVORY} opacity="0.55" />
            <rect x="74" y="158" width="190" height="20" rx="10" fill={BLUE} />
            <rect x="86" y="165" width="110" height="6" rx="3" fill={IVORY} />
            <rect x="74" y="190" width="120" height="7" rx="3.5" fill={IVORY} opacity="0.55" />
            <path d="M318 112 l6 16 16 6 -16 6 -6 16 -6 -16 -16 -6 16 -6z" fill={IVORY} />
            <path d="M345 150 l3.5 9 9 3.5 -9 3.5 -3.5 9 -3.5 -9 -9 -3.5 9 -3.5z" fill={IVORY} opacity="0.8" />
          </svg>
        </div>
      );

    case "build":
      // A browser window being assembled from blocks, with a bolt for speed.
      return (
        <div className="kd-tile kd-tile--build" aria-hidden="true">
          <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" className="kd-illu">
            <rect x="60" y="40" width="280" height="200" rx="18" fill="none" stroke={IVORY} strokeWidth="3" />
            <path d="M60 76 H340" stroke={IVORY} strokeWidth="3" />
            <circle cx="82" cy="58" r="5" fill={IVORY} />
            <circle cx="100" cy="58" r="5" fill={IVORY} />
            <circle cx="118" cy="58" r="5" fill={IVORY} />
            <rect x="84" y="98" width="110" height="60" rx="10" fill={IVORY} />
            <rect x="208" y="98" width="108" height="28" rx="8" fill={IVORY} opacity="0.6" />
            <rect x="208" y="134" width="80" height="24" rx="8" fill={BLUE} />
            <rect x="84" y="174" width="232" height="14" rx="7" fill={IVORY} opacity="0.5" />
            <rect x="84" y="198" width="160" height="14" rx="7" fill={IVORY} opacity="0.5" />
            <path d="M300 180 l-26 40 h22 l-10 40 36 -52 h-22 l12 -28z" fill={IVORY} />
          </svg>
        </div>
      );
  }
}

/* Deterministic layout for the background field of letter copies (same on
   server and client, so no hydration mismatch). */
function seeded(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const SWARM_COUNT = 22;

function swarmLayout() {
  const rnd = seeded(20261026);
  const items: { name: GlyphName; style: React.CSSProperties }[] = [];
  for (let i = 0; i < SWARM_COUNT; i++) {
    const name = GLYPH_ORDER[i % GLYPH_ORDER.length];
    const sign = () => (rnd() < 0.5 ? -1 : 1);
    items.push({
      name,
      style: {
        "--x": `${(-6 + rnd() * 104).toFixed(1)}vw`,
        "--y": `${(-6 + rnd() * 104).toFixed(1)}vh`,
        "--h": `${(5 + rnd() * 11).toFixed(1)}vh`,
        "--o": (0.1 + rnd() * 0.18).toFixed(2),
        "--r": `${(sign() * (6 + rnd() * 22)).toFixed(0)}deg`,
        "--dx": `${(sign() * (1.5 + rnd() * 3)).toFixed(1)}vw`,
        "--dy": `${(sign() * (1.5 + rnd() * 3)).toFixed(1)}vh`,
        "--dur": `${(9 + rnd() * 9).toFixed(1)}s`,
        "--delay": `${(-rnd() * 12).toFixed(1)}s`,
      } as React.CSSProperties,
    });
  }
  return items;
}

export function Hero({ brand, hero }: HeroProps) {
  const swarm = swarmLayout();
  return (
    <section id="top" className="kd-hero on-dark" aria-label={brand.name}>
      {/* The mark is split into its four letters, each its own SVG. CSS lays them out
          in the four corners; HeroIntro first reassembles the whole mark at --kd-S,
          then flies every letter to its corner while the frame scales up. */}
      <div className="kd-swarm" aria-hidden="true">
        {swarm.map((item, i) => (
          <KoheletGlyph key={i} name={item.name} className="kd-swarm-glyph" style={item.style} />
        ))}
      </div>
      <div className="kd-hero-logo" aria-label={brand.name} role="img">
        <span className="kd-logo-sizer" aria-hidden="true" />
        {GLYPH_ORDER.map((name) => (
          <KoheletGlyph key={name} name={name} className={`kd-glyph kd-glyph--${name}`} />
        ))}
        <div className="kd-hero-stage">
          <HeroStage
            lead={hero.headline.lead}
            words={hero.headline.words}
            fitVw={hero.headline.fitVw}
            frames={hero.visuals.map((visual) => (
              <Visual key={visual.kind} visual={visual} />
            ))}
          />
        </div>
      </div>
      <HeroIntro />
    </section>
  );
}
