"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";

export default function MouseGlow() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const locale = useLocale();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
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
