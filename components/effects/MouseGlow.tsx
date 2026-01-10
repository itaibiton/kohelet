"use client";

import { useState, useEffect, useRef } from "react";

export default function MouseGlow() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Don't show mouse glow on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Store latest position
      positionRef.current = { x: e.clientX, y: e.clientY };

      // Only schedule if no pending frame
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          setMousePos(positionRef.current);
          rafRef.current = null;
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      // Cancel any pending RAF
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    // Force LTR direction for the overlay wrapper to ensure coordinates map 1:1 with clientX/Y
    <div className="fixed inset-0 z-0 pointer-events-none" dir="ltr">
      <div
        className="absolute w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] transition-transform duration-200 ease-out"
        style={{
          left: 0,
          top: 0,
          transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)`,
        }}
      />
    </div>
  );
}
