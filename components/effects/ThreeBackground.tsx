"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Brand Colors
const BRAND_BLUE = new THREE.Color("#0A7CFF");
const ACCENT_PURPLE = new THREE.Color("#5B4FFF");

interface ThreeBackgroundProps {
  className?: string;
}

export function ThreeBackground({ className }: ThreeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    // Deep void fog for fading out the distant tunnel
    scene.fog = new THREE.FogExp2(0x020408, 0.03);

    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ReinhardToneMapping;
    container.appendChild(renderer.domElement);

    // --- Post Processing (Bloom) ---
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, // strength
      0.4, // radius
      0.85 // threshold
    );

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // --- The Tunnel Path ---
    // Create a winding path for the camera to follow
    const points = [];
    for (let i = 0; i < 5; i++) {
      points.push(
        new THREE.Vector3(
          Math.sin(i * 2) * 10,
          Math.cos(i * 1.5) * 5, // Less vertical movement
          i * -20 // Moving forward into negative Z
        )
      );
    }
    // Add points straight ahead for a long distance
    for (let i = 5; i < 20; i++) {
      points.push(
        new THREE.Vector3(
          Math.sin(i * 0.5) * 15,
          Math.cos(i * 0.3) * 10,
          i * -20
        )
      );
    }

    const path = new THREE.CatmullRomCurve3(points);

    // --- Particle System ---
    const particlesCount = 3000;
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    const sizeArray = new Float32Array(particlesCount);

    // We'll spawn particles along the tube of the path
    const tempPos = new THREE.Vector3();
    const tempColor = new THREE.Color();

    for (let i = 0; i < particlesCount; i++) {
      // t is position along the curve (0 to 1)
      const t = Math.random();
      // get point on curve
      const pointOnCurve = path.getPoint(t);

      // Calculate a random offset in a ring/tube shape around that point
      // We need a tangent/normal to construct the ring properly, or just simplified spherical offset
      // Simplified: Random angle, Random radius
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 8; // Tube radius variance

      const xOffset = Math.cos(angle) * radius;
      const yOffset = Math.sin(angle) * radius;

      // We assume the path is roughly moving along Z, so we offset X and Y
      // For more accuracy on winding paths we'd use Frenet frames, but effectively 
      // adding random noise around the points works for abstract tunnels

      posArray[i * 3] = pointOnCurve.x + xOffset;
      posArray[i * 3 + 1] = pointOnCurve.y + yOffset;
      posArray[i * 3 + 2] = pointOnCurve.z;

      // Colors: Mix between Blue and Purple based on depth/position
      // Start (t=0) is Blue, End (t=1) is Purple
      tempColor.lerpColors(BRAND_BLUE, ACCENT_PURPLE, t);

      colorArray[i * 3] = tempColor.r;
      colorArray[i * 3 + 1] = tempColor.g;
      colorArray[i * 3 + 2] = tempColor.b;

      // Random sizes
      sizeArray[i] = Math.random() * 0.15;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false, // Important for transparency
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // --- Animation State ---
    const animationState = {
      cameraProgress: 0.02, // Start slightly inside
    };

    // --- ScrollTrigger ---
    // We map the entire scroll distance to travelling down the tunnel
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5, // Smooth smoothing
      },
    });

    // Animate camera progress along the curve from 0.02 to 0.9
    // We don't go to 1.0 to avoid hitting the very end abruptly
    scrollTl.to(animationState, {
      cameraProgress: 0.9,
      ease: "power1.inOut",
    });

    // Animation Loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // 1. Move Particles (Subtle "alive" motion)
      // We can add a bit of noise or rotation to the whole tube
      const time = Date.now() * 0.0005;
      particlesMesh.rotation.z = time * 0.1; // Slow spin of the tunnel

      // 2. Update Camera Position
      // Get position on curve based on scroll progress
      // We define a loop or clamp? The scrollTl handles the value.

      const camPos = path.getPoint(animationState.cameraProgress);
      // Look at a point slightly ahead
      const lookAtPos = path.getPoint(Math.min(animationState.cameraProgress + 0.05, 0.99));

      // Smoothly interpolate camera position for extra butteriness (optional, but 'scrub' handles most)
      camera.position.copy(camPos);
      camera.lookAt(lookAtPos);

      // Add slight mouse parallax if we wanted, but let's stick to scroll for now to avoid motion sickness

      composer.render();
    };
    animate();

    // --- Resize Handler ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((t) => t.kill());

      renderer.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="canvas-container"
      className={className}
      aria-hidden="true"
    />
  );
}

// Export empty helpers to maintain compatibility if these were imported elsewhere
// (Though they won't do anything now as the logic is different)
export function triggerColorChange(color: string) { }
export function triggerColorReset() { }

