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

const SWARM_COUNT = 320;
/** Cursor influence radius (px). */
const PUSH_RADIUS = 200;
/** How much of the cursor's motion a letter under it picks up, along the motion
    and sideways away from the cursor's path (both scale with cursor speed, so a
    still cursor never moves anything). */
const SWEEP_GAIN = 0.5;
const SPREAD_GAIN = 0.3;
/** Per-frame velocity friction and exponential return toward rest. Both real,
    positive factors below 1, so the motion can never oscillate. */
const FRICTION = 0.82;
const RETURN = 0.045;
/** Max displacement (px), approached softly. */
const MAX_PUSH = 150;
/** Letter centres are re-measured every N frames (the drift is slow, so this is plenty). */
const MEASURE_EVERY = 6;

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
 * Background field of floating letters. A moving cursor brushes nearby letters
 * along with it (plus a slight spread away from its path); they coast on
 * friction and ease back to rest. No springs and no radial "orbit" around the
 * cursor, so the motion is smooth and never circles. The slow CSS drift keeps
 * running underneath.
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
    const cx = new Float32Array(n); // rest centre (drift included, push excluded)
    const cy = new Float32Array(n);
    const px = new Float32Array(n); // current displacement
    const py = new Float32Array(n);
    const vx = new Float32Array(n); // current velocity
    const vy = new Float32Array(n);
    let pointer: { x: number; y: number } | null = null;
    const sp = { x: 0, y: 0, vx: 0, vy: 0, live: false }; // low-passed pointer + velocity
    let raf = 0;
    let frame = 0;
    let idleFrames = 0;

    const measure = () => {
      for (let i = 0; i < n; i++) {
        const r = glyphs[i].getBoundingClientRect();
        cx[i] = r.left + r.width / 2 - px[i];
        cy[i] = r.top + r.height / 2 - py[i];
      }
    };

    const step = () => {
      raf = 0;
      frame++;
      if (frame % MEASURE_EVERY === 1) measure();

      // Smooth the pointer and derive its velocity (px per frame).
      if (pointer) {
        if (!sp.live) {
          sp.x = pointer.x;
          sp.y = pointer.y;
          sp.vx = sp.vy = 0;
          sp.live = true;
        } else {
          const nx = sp.x + (pointer.x - sp.x) * 0.35;
          const ny = sp.y + (pointer.y - sp.y) * 0.35;
          sp.vx = nx - sp.x;
          sp.vy = ny - sp.y;
          sp.x = nx;
          sp.y = ny;
        }
      }
      const speed = sp.live ? Math.hypot(sp.vx, sp.vy) : 0;

      let moving = false;
      for (let i = 0; i < n; i++) {
        if (pointer && speed > 0.05) {
          const dx = cx[i] + px[i] - sp.x;
          const dy = cy[i] + py[i] - sp.y;
          const d = Math.hypot(dx, dy);
          if (d < PUSH_RADIUS) {
            const t = 1 - d / PUSH_RADIUS;
            const w = t * t; // squared falloff, zero at the edge
            const inv = 1 / Math.max(d, 16);
            // Brushed along the cursor's motion, plus a sideways spread away from its path.
            vx[i] += (sp.vx * SWEEP_GAIN + dx * inv * speed * SPREAD_GAIN) * w;
            vy[i] += (sp.vy * SWEEP_GAIN + dy * inv * speed * SPREAD_GAIN) * w;
          }
        }
        vx[i] *= FRICTION;
        vy[i] *= FRICTION;
        px[i] += vx[i];
        py[i] += vy[i];
        // Soft clamp, then exponential return toward rest.
        const m = Math.hypot(px[i], py[i]);
        if (m > MAX_PUSH) {
          const k = MAX_PUSH / m;
          px[i] *= k;
          py[i] *= k;
        }
        px[i] -= px[i] * RETURN;
        py[i] -= py[i] * RETURN;

        const el = glyphs[i];
        if (Math.abs(px[i]) > 0.15 || Math.abs(py[i]) > 0.15 || Math.abs(vx[i]) > 0.05 || Math.abs(vy[i]) > 0.05) {
          moving = true;
          el.style.setProperty("--px", `${px[i].toFixed(2)}px`);
          el.style.setProperty("--py", `${py[i].toFixed(2)}px`);
        } else if (px[i] !== 0 || py[i] !== 0) {
          px[i] = py[i] = vx[i] = vy[i] = 0;
          el.style.removeProperty("--px");
          el.style.removeProperty("--py");
        }
      }
      idleFrames = moving || pointer ? 0 : idleFrames + 1;
      if (idleFrames < 2) raf = requestAnimationFrame(step);
      else sp.live = false;
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
    const onResize = () => {
      frame = 0; // force a re-measure on the next frame
      kick();
    };
    hero.addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerleave", onLeave);
    hero.addEventListener("pointercancel", onLeave);
    window.addEventListener("resize", onResize);
    return () => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      hero.removeEventListener("pointercancel", onLeave);
      window.removeEventListener("resize", onResize);
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
