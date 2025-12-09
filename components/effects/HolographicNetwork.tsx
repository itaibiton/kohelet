"use client";

import { useRef, useEffect } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
}

interface Props {
  shape?: "globe" | "cube";
}

const GLOBE_SIZE = 180;
const CUBE_SIZE = 140;
const CONNECTION_DISTANCE = 50;

// Easing function for smooth transitions
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Initialize particles for globe using Fibonacci sphere distribution
function initGlobeParticles(): Particle[] {
  const particles: Particle[] = [];
  const DOT_COUNT = 600;
  const phi = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < DOT_COUNT; i++) {
    const y = 1 - (i / (DOT_COUNT - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = phi * i;
    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;
    particles.push({
      x: x * GLOBE_SIZE,
      y: y * GLOBE_SIZE,
      z: z * GLOBE_SIZE,
    });
  }

  return particles;
}

// Initialize particles for cube wireframe
function initCubeParticles(): Particle[] {
  const particles: Particle[] = [];
  const size = CUBE_SIZE;
  const pointsPerEdge = 15;

  // 8 corners of the cube
  const corners: [number, number, number][] = [
    [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
    [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
  ];

  // 12 edges defined by corner indices
  const edges: [number, number][] = [
    // Bottom face
    [0, 1], [1, 2], [2, 3], [3, 0],
    // Top face
    [4, 5], [5, 6], [6, 7], [7, 4],
    // Vertical edges
    [0, 4], [1, 5], [2, 6], [3, 7],
  ];

  // Add corner particles (larger presence)
  corners.forEach(([cx, cy, cz]) => {
    particles.push({ x: cx * size, y: cy * size, z: cz * size });
  });

  // Add particles along each edge
  edges.forEach(([startIdx, endIdx]) => {
    const start = corners[startIdx];
    const end = corners[endIdx];

    for (let i = 1; i < pointsPerEdge; i++) {
      const t = i / pointsPerEdge;
      particles.push({
        x: (start[0] + (end[0] - start[0]) * t) * size,
        y: (start[1] + (end[1] - start[1]) * t) * size,
        z: (start[2] + (end[2] - start[2]) * t) * size,
      });
    }
  });

  // Add some particles on faces for a more filled look
  const facePointsPerAxis = 4;
  const faces: { normal: [number, number, number]; corners: number[] }[] = [
    { normal: [0, 0, -1], corners: [0, 1, 2, 3] }, // Front
    { normal: [0, 0, 1], corners: [4, 5, 6, 7] },  // Back
    { normal: [-1, 0, 0], corners: [0, 3, 7, 4] }, // Left
    { normal: [1, 0, 0], corners: [1, 2, 6, 5] },  // Right
    { normal: [0, -1, 0], corners: [0, 1, 5, 4] }, // Bottom
    { normal: [0, 1, 0], corners: [2, 3, 7, 6] },  // Top
  ];

  faces.forEach((face) => {
    const [c0, c1, c2, c3] = face.corners.map((i) => corners[i]);

    for (let i = 1; i < facePointsPerAxis; i++) {
      for (let j = 1; j < facePointsPerAxis; j++) {
        const u = i / facePointsPerAxis;
        const v = j / facePointsPerAxis;

        // Bilinear interpolation
        const x = (1 - u) * (1 - v) * c0[0] + u * (1 - v) * c1[0] + u * v * c2[0] + (1 - u) * v * c3[0];
        const y = (1 - u) * (1 - v) * c0[1] + u * (1 - v) * c1[1] + u * v * c2[1] + (1 - u) * v * c3[1];
        const z = (1 - u) * (1 - v) * c0[2] + u * (1 - v) * c1[2] + u * v * c2[2] + (1 - u) * v * c3[2];

        particles.push({ x: x * size, y: y * size, z: z * size });
      }
    }
  });

  return particles;
}

// Normalize particle arrays to same length for morphing
function normalizeParticleArrays(
  from: Particle[],
  to: Particle[]
): { normalized1: Particle[]; normalized2: Particle[] } {
  const maxLength = Math.max(from.length, to.length);
  const centerPoint = { x: 0, y: 0, z: 0 };

  const normalized1 = [...from];
  const normalized2 = [...to];

  // Pad shorter array with center points
  while (normalized1.length < maxLength) {
    normalized1.push({ ...centerPoint });
  }
  while (normalized2.length < maxLength) {
    normalized2.push({ ...centerPoint });
  }

  return { normalized1, normalized2 };
}

export default function HolographicNetwork({ shape = "globe" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Animation state refs to avoid re-renders
  const particlesRef = useRef<Particle[]>([]);
  const targetParticlesRef = useRef<Particle[]>([]);
  const startParticlesRef = useRef<Particle[]>([]);
  const transitionProgressRef = useRef<number>(1); // Start at 1 (completed)
  const isTransitioningRef = useRef<boolean>(false);
  const currentShapeRef = useRef<string>(shape);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;

    // Initialize particles based on initial shape
    if (particlesRef.current.length === 0) {
      particlesRef.current = shape === "globe" ? initGlobeParticles() : initCubeParticles();
      currentShapeRef.current = shape;
    }

    // Check if shape changed - trigger transition
    if (currentShapeRef.current !== shape) {
      const newTargetParticles = shape === "globe" ? initGlobeParticles() : initCubeParticles();

      // Normalize arrays to same length
      const { normalized1, normalized2 } = normalizeParticleArrays(
        particlesRef.current,
        newTargetParticles
      );

      // Store start and target positions
      startParticlesRef.current = normalized1;
      targetParticlesRef.current = normalized2;
      particlesRef.current = [...normalized1]; // Copy start positions

      // Start transition
      transitionProgressRef.current = 0;
      isTransitioningRef.current = true;
      currentShapeRef.current = shape;
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

      // Handle morphing transition
      if (isTransitioningRef.current) {
        transitionProgressRef.current += 0.025; // ~40 frames = ~0.67s at 60fps

        if (transitionProgressRef.current >= 1) {
          // Transition complete
          transitionProgressRef.current = 1;
          isTransitioningRef.current = false;
          particlesRef.current = [...targetParticlesRef.current];
        } else {
          // Interpolate between start and target
          const easedProgress = easeInOutCubic(transitionProgressRef.current);

          for (let i = 0; i < particlesRef.current.length; i++) {
            const start = startParticlesRef.current[i];
            const target = targetParticlesRef.current[i];

            particlesRef.current[i] = {
              x: start.x + (target.x - start.x) * easedProgress,
              y: start.y + (target.y - start.y) * easedProgress,
              z: start.z + (target.z - start.z) * easedProgress,
            };
          }
        }
      }

      // Increment rotation
      rotation += 0.004;

      // Transform and project particles
      const projectedParticles: Array<{
        x2d: number;
        y2d: number;
        z2: number;
        original: Particle;
      }> = [];

      particlesRef.current.forEach((particle) => {
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

        // For cube, always draw connections; for globe, random
        const shouldConnect = shape === "cube" ? true : Math.random() > 0.98;

        if (shouldConnect) {
          for (let j = i + 1; j < projectedParticles.length; j++) {
            const p2 = projectedParticles[j];
            if (p2.z2 >= 200) continue;

            // Calculate distance in 3D space
            const dx = p1.original.x - p2.original.x;
            const dy = p1.original.y - p2.original.y;
            const dz = p1.original.z - p2.original.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (distance < CONNECTION_DISTANCE) {
              const alpha = (1 - distance / CONNECTION_DISTANCE) * 0.4;
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
  }, [shape]);

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
