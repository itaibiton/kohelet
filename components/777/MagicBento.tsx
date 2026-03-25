"use client";

import { useRef, useEffect, useCallback, useState, type ReactNode } from "react";
import { gsap } from "gsap";

const GLOW_COLOR = "251, 191, 36"; // amber-400

interface CardData {
  icon: ReactNode;
  title: string;
  description: string;
  label: string;
  illustration?: ReactNode;
  variant?: "default" | "gold";
}

interface MagicBentoProps {
  cards: CardData[];
  glowColor?: string;
}

function createParticleElement(x: number, y: number, color: string) {
  const el = document.createElement("div");
  el.style.cssText = `
    position:absolute;width:4px;height:4px;border-radius:50%;
    background:rgba(${color},1);box-shadow:0 0 6px rgba(${color},0.6);
    pointer-events:none;z-index:100;left:${x}px;top:${y}px;
  `;
  return el;
}

function ParticleCard({
  children,
  className = "",
  style,
  glowColor = GLOW_COLOR,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  glowColor?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const initRef = useRef(false);

  const init = useCallback(() => {
    if (initRef.current || !cardRef.current) return;
    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: 12 }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor)
    );
    initRef.current = true;
  }, [glowColor]);

  const clearAll = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    particlesRef.current.forEach((p) => {
      gsap.to(p, { scale: 0, opacity: 0, duration: 0.3, ease: "back.in(1.7)", onComplete: () => p.remove() });
    });
    particlesRef.current = [];
  }, []);

  const animate = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;
    if (!initRef.current) init();
    memoizedParticles.current.forEach((particle, i) => {
      const tid = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;
        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current!.appendChild(clone);
        particlesRef.current.push(clone);
        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" });
        gsap.to(clone, { x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100, rotation: Math.random() * 360, duration: 2 + Math.random() * 2, ease: "none", repeat: -1, yoyo: true });
        gsap.to(clone, { opacity: 0.3, duration: 1.5, ease: "power2.inOut", repeat: -1, yoyo: true });
      }, i * 100);
      timeoutsRef.current.push(tid);
    });
  }, [init]);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const onEnter = () => { isHoveredRef.current = true; animate(); };
    const onLeave = () => { isHoveredRef.current = false; clearAll(); };
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      isHoveredRef.current = false;
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      clearAll();
    };
  }, [animate, clearAll]);

  return (
    <div ref={cardRef} className={className} style={{ ...style, position: "relative", overflow: "hidden" }}>
      {children}
    </div>
  );
}

function Spotlight({ gridRef, glowColor = GLOW_COLOR }: { gridRef: React.RefObject<HTMLDivElement | null>; glowColor?: string }) {
  useEffect(() => {
    if (!gridRef?.current) return;
    const spotlight = document.createElement("div");
    spotlight.style.cssText = `
      position:fixed;width:800px;height:800px;border-radius:50%;pointer-events:none;
      background:radial-gradient(circle,rgba(${glowColor},0.15) 0%,rgba(${glowColor},0.06) 25%,rgba(${glowColor},0.02) 40%,transparent 70%);
      z-index:200;opacity:0;transform:translate(-50%,-50%);mix-blend-mode:screen;
    `;
    document.body.appendChild(spotlight);

    const onMove = (e: MouseEvent) => {
      const section = gridRef.current?.closest(".bento-section");
      const rect = section?.getBoundingClientRect();
      const inside = rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (!inside) { gsap.to(spotlight, { opacity: 0, duration: 0.3 }); return; }
      gsap.to(spotlight, { left: e.clientX, top: e.clientY, duration: 0.1, ease: "power2.out" });
      gsap.to(spotlight, { opacity: 0.8, duration: 0.2 });

      gridRef.current?.querySelectorAll<HTMLElement>(".mb-card").forEach((card) => {
        const cr = card.getBoundingClientRect();
        const rx = ((e.clientX - cr.left) / cr.width) * 100;
        const ry = ((e.clientY - cr.top) / cr.height) * 100;
        const dist = Math.max(0, Math.hypot(e.clientX - (cr.left + cr.width / 2), e.clientY - (cr.top + cr.height / 2)) - Math.max(cr.width, cr.height) / 2);
        const glow = dist <= 150 ? 1 : dist <= 225 ? (225 - dist) / 75 : 0;
        card.style.setProperty("--glow-x", `${rx}%`);
        card.style.setProperty("--glow-y", `${ry}%`);
        card.style.setProperty("--glow-intensity", glow.toString());
      });
    };
    const onLeave = () => { gsap.to(spotlight, { opacity: 0, duration: 0.3 }); };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      spotlight.remove();
    };
  }, [gridRef, glowColor]);
  return null;
}

export default function MagicBento({ cards, glowColor = GLOW_COLOR }: MagicBentoProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      <style>{`
        .mb-grid {
          display: grid;
          gap: 0.75rem;
        }
        @media (min-width: 640px) { .mb-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) {
          .mb-grid { grid-template-columns: repeat(4, 1fr); }
          .mb-card:nth-child(3) { grid-column: span 2; grid-row: span 2; }
          .mb-card:nth-child(4) { grid-column: 1 / span 2; grid-row: 2 / span 2; }
          .mb-card:nth-child(6) { grid-column: 4; grid-row: 3; }
        }
        .mb-card {
          --glow-x: 50%; --glow-y: 50%; --glow-intensity: 0; --glow-radius: 200px;
          display: flex; flex-direction: column; justify-content: space-between;
          position: relative; width: 100%;
          padding: 1.25rem; border-radius: 1.25rem;
          border: 1px solid rgba(251,191,36,0.15);
          background: rgba(0,0,0,0.6);
          overflow: hidden; transition: all 0.3s ease;
          min-height: 160px;
        }
        @media (min-width: 640px) {
          .mb-card { aspect-ratio: 4/3; min-height: 200px; padding: 1.5rem; }
        }
        .mb-card:hover {
          box-shadow: 0 8px 25px rgba(0,0,0,0.3), 0 0 30px rgba(251,191,36,0.1);
          border-color: rgba(251,191,36,0.3);
        }
        .mb-card--gold {
          background: linear-gradient(135deg, #f59e0b, #eab308, #f59e0b) !important;
          border-color: rgba(251,191,36,0.5) !important;
        }
        .mb-card--gold:hover {
          box-shadow: 0 8px 30px rgba(251,191,36,0.3), 0 0 40px rgba(251,191,36,0.15) !important;
        }
        .mb-card::after {
          content: ''; position: absolute; inset: 0; padding: 6px;
          background: radial-gradient(
            var(--glow-radius) circle at var(--glow-x) var(--glow-y),
            rgba(${glowColor}, calc(var(--glow-intensity) * 0.8)) 0%,
            rgba(${glowColor}, calc(var(--glow-intensity) * 0.4)) 30%,
            transparent 60%
          );
          border-radius: inherit;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          pointer-events: none; z-index: 1;
        }
      `}</style>

      {!isMobile && <Spotlight gridRef={gridRef} glowColor={glowColor} />}

      <div className="mb-grid bento-section" ref={gridRef}>
        {cards.map((card, i) => (
          <ParticleCard
            key={i}
            className={`mb-card ${card.variant === "gold" ? "mb-card--gold" : ""}`}
            glowColor={glowColor}
          >
            <div className="flex justify-between items-start relative z-10">
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${card.variant === "gold" ? "bg-black/20 border border-black/20 text-black" : "bg-amber-400/10 border border-amber-400/20 text-amber-400"}`}>
                {card.icon}
              </div>
              <span className={`text-[10px] sm:text-xs font-semibold tracking-widest uppercase ${card.variant === "gold" ? "text-black/50" : "text-amber-400/60"}`}>
                {card.label}
              </span>
            </div>
            {card.illustration && (
              <div className="flex-1 flex items-center justify-center relative z-10 pointer-events-none py-3 sm:py-4">
                {card.illustration}
              </div>
            )}
            <div className="flex flex-col gap-1 relative z-10">
              <h3 className={`font-bold text-sm sm:text-base ${card.variant === "gold" ? "text-black" : "text-white"}`}>{card.title}</h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${card.variant === "gold" ? "text-black/60" : "text-zinc-400"}`}>{card.description}</p>
            </div>
          </ParticleCard>
        ))}
      </div>
    </>
  );
}
