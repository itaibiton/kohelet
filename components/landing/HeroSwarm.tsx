"use client";

import { useEffect, useRef } from "react";
import { GLYPH_ORDER, KoheletGlyph, type GlyphName } from "./KoheletGlyphs";

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

const SWARM_COUNT = 220;
/** Cursor influence radius (px) and how far a letter right under it is pushed (px). */
const PUSH_RADIUS = 170;
const PUSH_STRENGTH = 110;

/* Many small letter copies, random glyph, size, tilt, drift and opacity. Sizes are
   skewed small with a low cap so the field reads as texture, not a second logo. */
function swarmLayout() {
  const rnd = seeded(20261026);
  const items: { name: GlyphName; style: React.CSSProperties }[] = [];
  const sign = () => (rnd() < 0.5 ? -1 : 1);
  for (let i = 0; i < SWARM_COUNT; i++) {
    const name = GLYPH_ORDER[Math.floor(rnd() * GLYPH_ORDER.length)];
    const size = 1 + Math.pow(rnd(), 2) * 4.5; // 1vh to 5.5vh, mostly small
    const drift = 0.8 + rnd() * 3.5;
    const angle = rnd() * Math.PI * 2;
    items.push({
      name,
      style: {
        "--x": `${(-4 + rnd() * 104).toFixed(1)}vw`,
        "--y": `${(-4 + rnd() * 104).toFixed(1)}vh`,
        "--h": `${size.toFixed(2)}vh`,
        "--o": (0.05 + Math.pow(rnd(), 1.5) * 0.14).toFixed(2),
        "--r": `${(sign() * rnd() * 70).toFixed(0)}deg`,
        "--dx": `${(Math.cos(angle) * drift).toFixed(2)}vw`,
        "--dy": `${(Math.sin(angle) * drift).toFixed(2)}vh`,
        "--dur": `${(7 + rnd() * 14).toFixed(1)}s`,
        "--delay": `${(-rnd() * 20).toFixed(1)}s`,
      } as React.CSSProperties,
    });
  }
  return items;
}

const SWARM = swarmLayout();

/**
 * Background field of floating letters. Letters near the cursor are pushed away
 * and spring back once it leaves; the slow CSS drift keeps running underneath.
 */
export function HeroSwarm() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = ref.current;
    const hero = layer?.parentElement;
    if (!layer || !hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const glyphs = Array.from(layer.querySelectorAll<HTMLElement>(".kd-swarm-glyph"));
    const n = glyphs.length;
    const px = new Float32Array(n);
    const py = new Float32Array(n);
    const vx = new Float32Array(n);
    const vy = new Float32Array(n);
    let pointer: { x: number; y: number } | null = null;
    let raf = 0;
    let idleFrames = 0;

    const step = () => {
      raf = 0;
      let moving = false;
      for (let i = 0; i < n; i++) {
        const el = glyphs[i];
        let tx = 0;
        let ty = 0;
        if (pointer) {
          const r = el.getBoundingClientRect();
          // Base centre = current centre minus the push already applied.
          const cx = r.left + r.width / 2 - px[i];
          const cy = r.top + r.height / 2 - py[i];
          const dx = cx - pointer.x;
          const dy = cy - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < PUSH_RADIUS && d > 0.001) {
            const f = ((PUSH_RADIUS - d) / PUSH_RADIUS) * PUSH_STRENGTH;
            tx = (dx / d) * f;
            ty = (dy / d) * f;
          }
        }
        // Critically-damped-ish spring toward the target offset.
        vx[i] = (vx[i] + (tx - px[i]) * 0.14) * 0.78;
        vy[i] = (vy[i] + (ty - py[i]) * 0.14) * 0.78;
        px[i] += vx[i];
        py[i] += vy[i];
        if (Math.abs(vx[i]) > 0.02 || Math.abs(vy[i]) > 0.02 || Math.abs(px[i]) > 0.1 || Math.abs(py[i]) > 0.1) {
          moving = true;
          el.style.setProperty("--px", `${px[i].toFixed(1)}px`);
          el.style.setProperty("--py", `${py[i].toFixed(1)}px`);
        } else if (px[i] !== 0 || py[i] !== 0) {
          px[i] = py[i] = vx[i] = vy[i] = 0;
          el.style.removeProperty("--px");
          el.style.removeProperty("--py");
        }
      }
      idleFrames = moving || pointer ? 0 : idleFrames + 1;
      if (idleFrames < 2) raf = requestAnimationFrame(step);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY };
      kick();
    };
    const onLeave = () => {
      pointer = null;
      kick();
    };
    hero.addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerleave", onLeave);
    hero.addEventListener("pointercancel", onLeave);
    return () => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      hero.removeEventListener("pointercancel", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="kd-swarm" aria-hidden="true">
      {SWARM.map((item, i) => (
        <KoheletGlyph key={i} name={item.name} className="kd-swarm-glyph" style={item.style} />
      ))}
    </div>
  );
}
