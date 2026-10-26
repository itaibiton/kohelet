"use client";

import { useEffect } from "react";

const DELAY_MS = 1000;
const DURATION_MS = 1800;
const EASING = "cubic-bezier(0.65, 0, 0.35, 1)";
const LOGO_UNITS = 122;

/**
 * Hero entrance. The four letters are laid out (by CSS) in their final corner
 * positions; this effect first pulls them together into the whole mark at
 * `--kd-S` size and shows it (no fade), then after 1s animates every letter to
 * its corner while the frame scales up, all on one timing. When that ends, the
 * background field of floating letter copies fades in. Transforms only: no layout shift.
 */
export function HeroIntro() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".kd-hero");
    const logo = hero?.querySelector<HTMLElement>(".kd-hero-logo");
    const frame = hero?.querySelector<HTMLElement>(".kd-hero-frame");
    const sizer = hero?.querySelector<HTMLElement>(".kd-logo-sizer");
    const swarm = hero?.querySelector<HTMLElement>(".kd-swarm");
    if (!hero || !logo || !frame || !sizer) return;

    const glyphs = Array.from(logo.querySelectorAll<SVGSVGElement>(".kd-glyph"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || typeof logo.animate !== "function") {
      logo.style.opacity = "1";
      frame.style.opacity = "1";
      swarm?.classList.add("is-on");
      return;
    }

    const S = sizer.getBoundingClientRect().width;
    const h = hero.getBoundingClientRect();
    const originX = h.left + h.width / 2 - S / 2;
    const originY = h.top + h.height / 2 - S / 2;
    const unit = S / LOGO_UNITS;

    const animations: Animation[] = [];
    const timing = { duration: DURATION_MS, delay: DELAY_MS, easing: EASING, fill: "both" as const };

    for (const el of glyphs) {
      const [bx, by, bw] = (el.dataset.box ?? "0,0,1,1").split(",").map(Number);
      const f = el.getBoundingClientRect();
      const aw = bw * unit;
      const k = aw / f.width;
      const dx = originX + bx * unit + aw / 2 - (f.left + f.width / 2);
      const dy = originY + by * unit + (aw / (f.width / f.height)) / 2 - (f.top + f.height / 2);
      animations.push(
        el.animate(
          [{ transform: `translate(${dx}px, ${dy}px) scale(${k})` }, { transform: "none" }],
          timing
        )
      );
    }

    // The reassembled mark simply appears once the transforms are in place.
    logo.style.opacity = "1";
    animations.push(
      frame.animate(
        [
          { opacity: 0, transform: "scale(0.02)" },
          { opacity: 1, offset: 0.12 },
          { opacity: 1, transform: "scale(1)" },
        ],
        timing
      )
    );

    let cancelled = false;
    Promise.all(animations.map((a) => a.finished))
      .then(() => {
        if (!cancelled) swarm?.classList.add("is-on");
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      animations.forEach((a) => a.cancel());
    };
  }, []);

  return null;
}
