"use client";

import { useState, useEffect } from "react";

export default function MouseGlow() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020204]/90 to-[#020204]" />
      <div
        className="absolute w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[100px] transition-transform duration-200 ease-out mix-blend-screen"
        style={{
          transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)`,
        }}
      />
    </div>
  );
}
