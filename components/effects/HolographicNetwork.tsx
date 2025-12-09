"use client";

import { useRef, useEffect } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
}

const GLOBE_RADIUS = 220;
const DOT_COUNT = 600;
const CONNECTION_DISTANCE = 40;

export default function HolographicNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;
    const particles: Particle[] = [];

    // Initialize particles using Fibonacci sphere distribution
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < DOT_COUNT; i++) {
      const y = 1 - (i / (DOT_COUNT - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      particles.push({
        x: x * GLOBE_RADIUS,
        y: y * GLOBE_RADIUS,
        z: z * GLOBE_RADIUS,
      });
    }

    const initCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(2, 2);
    };

    const animate = () => {
      const rect = container.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Increment rotation
      rotation += 0.002;

      // Transform and project particles
      const projectedParticles: Array<{
        x2d: number;
        y2d: number;
        z2: number;
        original: Particle;
      }> = [];

      particles.forEach((particle) => {
        // Apply Y-axis rotation
        const cosY = Math.cos(rotation);
        const sinY = Math.sin(rotation);
        const x1 = particle.x * cosY - particle.z * sinY;
        const z1 = particle.x * sinY + particle.z * cosY;

        // Apply X-axis tilt (0.3 rad)
        const cosX = Math.cos(0.3);
        const sinX = Math.sin(0.3);
        const y2 = particle.y * cosX - z1 * sinX;
        const z2 = particle.y * sinX + z1 * cosX;

        // 2D projection with perspective
        const perspective = 800;
        const scale = perspective / (perspective + z2);
        const x2d = x1 * scale + rect.width / 2;
        const y2d = y2 * scale + rect.height / 2;

        projectedParticles.push({
          x2d,
          y2d,
          z2,
          original: particle,
        });
      });

      // Draw connections between nearby particles
      for (let i = 0; i < projectedParticles.length; i++) {
        const p1 = projectedParticles[i];
        if (p1.z2 >= 200) continue; // Only front half

        // Randomly connect particles
        if (Math.random() > 0.98) {
          for (let j = i + 1; j < projectedParticles.length; j++) {
            const p2 = projectedParticles[j];
            if (p2.z2 >= 200) continue;

            // Calculate distance in 3D space
            const dx = p1.original.x - p2.original.x;
            const dy = p1.original.y - p2.original.y;
            const dz = p1.original.z - p2.original.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (distance < CONNECTION_DISTANCE) {
              const alpha = (1 - distance / CONNECTION_DISTANCE) * 0.3;
              ctx.strokeStyle = `rgba(100, 149, 237, ${alpha})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(p1.x2d, p1.y2d);
              ctx.lineTo(p2.x2d, p2.y2d);
              ctx.stroke();
            }
          }
        }
      }

      // Draw particles as dots (only front half)
      projectedParticles.forEach((p) => {
        if (p.z2 < 200) {
          const alpha = 0.3 + (200 - p.z2) / 400;
          ctx.fillStyle = `rgba(100, 149, 237, ${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x2d, p.y2d, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      initCanvas();
    };

    initCanvas();
    animate();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-[600px] flex items-center justify-center relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-blue-900/5 blur-[80px] rounded-full transform scale-75 opacity-40 z-0" />
      <canvas ref={canvasRef} className="relative z-10" />
    </div>
  );
}
