"use client";

import { useRef, useEffect } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
}

interface Edge {
  p1: number; // Index of first particle
  p2: number; // Index of second particle
}

interface Graph {
  particles: Particle[];
  edges: Edge[];
}

interface Props {
  shape?: "globe" | "triangle";
  rotationSpeed?: number;
}

const GLOBE_SIZE = 200;
const TRIANGLE_SIZE = 290;

// Easing function for smooth transitions (re-introduced)
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Initializer for Globe: connecting neighbors
function initGlobeGraph(): Graph {
  const particles: Particle[] = [];
  const edges: Edge[] = [];
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

  // Connect neighbors
  for (let i = 0; i < DOT_COUNT; i++) {
    let nearest: { idx: number; dist: number }[] = [];
    const p1 = particles[i];

    for (let j = 0; j < DOT_COUNT; j++) {
      if (i === j) continue;
      const p2 = particles[j];
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dz = p1.z - p2.z;
      const dist = dx * dx + dy * dy + dz * dz;
      nearest.push({ idx: j, dist });
    }
    nearest.sort((a, b) => a.dist - b.dist);
    for (let k = 0; k < 2; k++) {
      const neighbor = nearest[k];
      if (i < neighbor.idx) {
        edges.push({ p1: i, p2: neighbor.idx });
      }
    }
  }

  return { particles, edges };
}

// Initializer for Triangle (Tetrahedron)
function initTriangleGraph(): Graph {
  // Tetrahedron vertices
  // V1: Top (0, y, 0)
  // V2, V3, V4: Base triangle
  const s = TRIANGLE_SIZE;
  const h = s * Math.sqrt(2 / 3); // Height of tetrahedron

  const vTop = { x: 0, y: -h / 1.5, z: 0 };
  const vFront = { x: 0, y: h / 2, z: s / Math.sqrt(3) };
  const vLeft = { x: -s / 2, y: h / 2, z: -s / (2 * Math.sqrt(3)) };
  const vRight = { x: s / 2, y: h / 2, z: -s / (2 * Math.sqrt(3)) };

  const corners = [vTop, vFront, vLeft, vRight];

  // Create subdivded edges to have enough points
  const particles: Particle[] = [];
  const edges: Edge[] = [];
  const steps = 15; // High subdivision for density relative to globe

  // Define edges pairs (indices into corners array)
  const lines = [
    [0, 1], [0, 2], [0, 3], // Top to Base
    [1, 2], [2, 3], [3, 1]  // Base edges
  ];

  let pIndex = 0;

  lines.forEach(([startIdx, endIdx]) => {
    const start = corners[startIdx];
    const end = corners[endIdx];

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      particles.push({
        x: start.x + (end.x - start.x) * t,
        y: start.y + (end.y - start.y) * t,
        z: start.z + (end.z - start.z) * t
      });

      if (i > 0) {
        edges.push({ p1: pIndex - 1, p2: pIndex });
      }
      pIndex++;
    }
  });

  // Fill faces randomly (stochastically) to add volume
  // Face 0: 0-1-2, Face 1: 0-2-3, Face 2: 0-3-1, Face 3: 1-2-3
  const faces = [
    [vTop, vFront, vLeft],
    [vTop, vLeft, vRight],
    [vTop, vRight, vFront],
    [vFront, vLeft, vRight]
  ];

  // Add ~200 random points per face for volume
  const pointsPerFace = 50;

  faces.forEach(([A, B, C]) => {
    for (let i = 0; i < pointsPerFace; i++) {
      // Uniform point in triangle using barycentric coords
      let r1 = Math.random();
      let r2 = Math.random();
      if (r1 + r2 > 1) {
        r1 = 1 - r1;
        r2 = 1 - r2;
      }
      const r3 = 1 - r1 - r2;

      const x = r1 * A.x + r2 * B.x + r3 * C.x;
      const y = r1 * A.y + r2 * B.y + r3 * C.y;
      const z = r1 * A.z + r2 * B.z + r3 * C.z;

      particles.push({ x, y, z });
      // No edges for internal points? Or connect them randomly?
      // Let's connect them to nearest existing structural point to keep "network" look
      // Or simpler: internal points are just dots.
    }
  });

  return { particles, edges };
}

// Normalize graphs for morphing (re-introduced)
function normalizeGraph(g1: Graph, g2: Graph): { g1: Graph, g2: Graph } {
  const maxP = Math.max(g1.particles.length, g2.particles.length);
  const maxE = Math.max(g1.edges.length, g2.edges.length);

  const p1 = [...g1.particles];
  const e1 = [...g1.edges];
  const p2 = [...g2.particles];
  const e2 = [...g2.edges];

  while (p1.length < maxP) p1.push({ x: 0, y: 0, z: 0 });
  while (p2.length < maxP) p2.push({ x: 0, y: 0, z: 0 });

  while (e1.length < maxE) e1.push({ p1: 0, p2: 0 });
  while (e2.length < maxE) e2.push({ p1: 0, p2: 0 });

  return {
    g1: { particles: p1, edges: e1 },
    g2: { particles: p2, edges: e2 }
  };
}

export default function HolographicNetwork({ shape = "globe", rotationSpeed = 0.004 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const graphRef = useRef<Graph>({ particles: [], edges: [] });
  const targetGraphRef = useRef<Graph>({ particles: [], edges: [] });
  const startGraphRef = useRef<Graph>({ particles: [], edges: [] });
  const rotationSpeedRef = useRef<number>(rotationSpeed);

  const currentShapeRef = useRef<string>(shape);
  const transitionProgressRef = useRef<number>(1);
  const isTransitioningRef = useRef<boolean>(false);

  // Sync prop to ref
  useEffect(() => {
    rotationSpeedRef.current = rotationSpeed;
  }, [rotationSpeed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;

    // Initialize
    if (graphRef.current.particles.length === 0) {
      graphRef.current = shape === "globe" ? initGlobeGraph() : initTriangleGraph();
      currentShapeRef.current = shape;
    }

    // Trigger Morph
    if (currentShapeRef.current !== shape) {
      const next = shape === "globe" ? initGlobeGraph() : initTriangleGraph();
      const { g1, g2 } = normalizeGraph(graphRef.current, next);

      startGraphRef.current = g1;
      targetGraphRef.current = g2;
      graphRef.current = g1;

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

      rotation += rotationSpeedRef.current;

      // Morphing Logic
      if (isTransitioningRef.current) {
        transitionProgressRef.current += 0.02; // Transition speed
        if (transitionProgressRef.current >= 1) {
          transitionProgressRef.current = 1;
          isTransitioningRef.current = false;
          graphRef.current = targetGraphRef.current;
        } else {
          const t = easeInOutCubic(transitionProgressRef.current);
          // Morph Particles
          for (let i = 0; i < graphRef.current.particles.length; i++) {
            const start = startGraphRef.current.particles[i];
            const target = targetGraphRef.current.particles[i];
            if (start && target) {
              graphRef.current.particles[i] = {
                x: start.x + (target.x - start.x) * t,
                y: start.y + (target.y - start.y) * t,
                z: start.z + (target.z - start.z) * t
              };
            }
          }
          // Switch edges topology halfway
          graphRef.current.edges = (transitionProgressRef.current > 0.5)
            ? targetGraphRef.current.edges
            : startGraphRef.current.edges;
        }
      }

      // Project Particles
      const projected: { x: number, y: number, z: number }[] = [];
      const ps = graphRef.current.particles;

      const cosY = Math.cos(rotation);
      const sinY = Math.sin(rotation);
      const cosX = Math.cos(0.3); // Fixed tilt
      const sinX = Math.sin(0.3);

      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.x * sinY + p.z * cosY;
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        const scale = 800 / (800 + z2);
        projected.push({
          x: x1 * scale + rect.width / 2,
          y: y2 * scale + rect.height / 2,
          z: z2
        });
      }

      // Draw Edges (O(E) complexity)
      ctx.lineWidth = 0.5;
      const edges = graphRef.current.edges;

      for (let i = 0; i < edges.length; i++) {
        const e = edges[i];
        const p1 = projected[e.p1];
        const p2 = projected[e.p2];

        if (!p1 || !p2) continue;

        const avgZ = (p1.z + p2.z) / 2;
        if (avgZ >= 200) continue; // Clip back

        const alpha = (1 - (avgZ + 200) / 400) * 0.4;

        ctx.strokeStyle = `rgba(100, 149, 237, ${Math.max(0.1, alpha)})`;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // Draw Vertices
      ctx.fillStyle = "rgba(100, 149, 237, 0.6)";
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        if (p.z < 200) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => initCanvas();

    initCanvas();
    animate();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [shape]); // Trigger on shape change

  return (
    <div
      ref={containerRef}
      className="w-full h-[600px] flex items-center justify-center relative overflow-visible"
    >
      <div className="absolute inset-0 bg-blue-900/5 blur-[80px] rounded-full transform scale-75 opacity-40 z-0" />
      <canvas ref={canvasRef} className="relative z-10" />
    </div>
  );
}
