"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Brand colors
const BRAND_BLUE = 0x0a7cff;
const ACCENT_PURPLE = 0x5b4fff;

interface ThreeBackgroundProps {
  className?: string;
}

export function ThreeBackground({ className }: ThreeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(true);
  const rafIdRef = useRef<number | null>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    composer: EffectComposer;
    logoGroup: THREE.Group;
    wireframe: THREE.LineSegments;
    particlesMesh: THREE.Points;
    particlesMaterial: THREE.PointsMaterial;
    particlesGeometry: THREE.BufferGeometry;
    wireframeMaterial: THREE.LineBasicMaterial;
    bloomPass: UnrealBloomPass;
    spotlight1: THREE.SpotLight;
    particlesCount: number;
  } | null>(null);

  const updateColors = useCallback((color: string) => {
    if (!sceneRef.current) return;
    const { particlesMaterial, wireframeMaterial, bloomPass } = sceneRef.current;
    const newColor = new THREE.Color(color);

    gsap.to(particlesMaterial.color, { r: newColor.r, g: newColor.g, b: newColor.b, duration: 0.5 });
    gsap.to(wireframeMaterial.color, { r: newColor.r, g: newColor.g, b: newColor.b, duration: 0.5 });
    gsap.to(bloomPass, { strength: 3, radius: 1, duration: 0.3 });
  }, []);

  const resetColors = useCallback(() => {
    if (!sceneRef.current) return;
    const { particlesMaterial, wireframeMaterial, bloomPass } = sceneRef.current;
    const blue = new THREE.Color(BRAND_BLUE);

    gsap.to(particlesMaterial.color, { r: blue.r, g: blue.g, b: blue.b, duration: 0.5 });
    gsap.to(wireframeMaterial.color, { r: blue.r, g: blue.g, b: blue.b, duration: 0.5 });
    gsap.to(bloomPass, { strength: 1.8, radius: 0.5, duration: 0.5 });
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020408, 0.02);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ReinhardToneMapping;
    container.appendChild(renderer.domElement);

    // Post Processing (Bloom) - Updated initial settings
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.8,
      0.5,
      0.85
    );
    bloomPass.threshold = 0;
    bloomPass.strength = 1.8;
    bloomPass.radius = 0.5;

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // Logo Group
    const logoGroup = new THREE.Group();

    // Electric Blue wireframe material (no solid mesh - wireframe only)
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: BRAND_BLUE,
      transparent: true,
      opacity: 0.8,
    });

    // Sphere geometry - wireframe only (hollow look)
    const geometry = new THREE.SphereGeometry(1.2, 32, 32);
    const wireframe = new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry),
      wireframeMaterial
    );

    // Add wireframe directly to logoGroup (no solid mesh)
    logoGroup.add(wireframe);
    scene.add(logoGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    // Blue Spotlight
    const spotlight1 = new THREE.SpotLight(BRAND_BLUE, 40);
    spotlight1.position.set(5, 5, 5);
    spotlight1.angle = 0.4;
    spotlight1.penumbra = 0.5;
    scene.add(spotlight1);

    // Violet Spotlight
    const spotlight2 = new THREE.SpotLight(ACCENT_PURPLE, 20);
    spotlight2.position.set(-5, -5, 5);
    spotlight2.angle = 0.5;
    scene.add(spotlight2);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 25;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.04,
      color: BRAND_BLUE,
      transparent: true,
      opacity: 0.6,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    particlesMesh.position.y = -2;
    scene.add(particlesMesh);

    // Store refs (including new references for animations)
    sceneRef.current = {
      scene,
      camera,
      renderer,
      composer,
      logoGroup,
      wireframe,
      particlesMesh,
      particlesMaterial,
      particlesGeometry,
      wireframeMaterial,
      bloomPass,
      spotlight1,
      particlesCount,
    };

    // Animation loop with visibility check
    const animate = () => {
      // Stop animation if not visible
      if (!isVisibleRef.current) {
        rafIdRef.current = null;
        return;
      }

      rafIdRef.current = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      // Logo group rotation
      logoGroup.rotation.y += 0.002;
      logoGroup.rotation.x = Math.sin(time * 0.5) * 0.1;

      // Gentle floating
      logoGroup.position.y = Math.sin(time) * 0.1;

      // Pulsing scale animation for wireframe sphere
      const scale = 1 + Math.sin(time * 2) * 0.02;
      wireframe.scale.set(scale, scale, scale);

      // Particle wave animation
      const positions = particlesGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particlesCount; i++) {
        const x = positions[i * 3];
        positions[i * 3 + 1] = Math.sin(Date.now() * 0.001 + x) * 0.5 - 2;
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      // Particle rotation
      particlesMesh.rotation.y = -time * 0.05;

      composer.render();
    };
    animate();

    // GSAP ScrollTrigger - Enhanced scroll effects
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    // Logo group animations
    tl.to(logoGroup.position, { z: -10, y: 5, duration: 2 }, 0)
      .to(logoGroup.rotation, { x: 1, duration: 2 }, 0);

    // Camera animations
    tl.to(camera.position, { z: 8, duration: 2 }, 0)
      .to(camera.rotation, { z: 0.2, duration: 2 }, 0);

    // Particles: position to y: 0, then scale to 2
    tl.to(particlesMesh.position, { y: 0, duration: 1 }, 1)
      .to(particlesMesh.scale, { x: 2, y: 2, z: 2, duration: 2 }, 2);

    // Color transition: blue (#3B82F6) to purple (#6366f1)
    const purple = new THREE.Color(ACCENT_PURPLE);
    tl.to(
      particlesMaterial.color,
      { r: purple.r, g: purple.g, b: purple.b, duration: 2 },
      1
    ).to(
      wireframeMaterial.color,
      { r: purple.r, g: purple.g, b: purple.b, duration: 2 },
      1
    );

    // Bloom enhancement on scroll
    tl.to(bloomPass, { strength: 3, radius: 1, duration: 2 }, 2);

    // Fog density increase
    tl.to(scene.fog as THREE.FogExp2, { density: 0.05, duration: 2 }, 3);

    // Spotlight intensity and angle on scroll
    tl.to(spotlight1, { intensity: 100, angle: 0.1, duration: 2 }, 3);

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Intersection Observer for pause/resume
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;

        // Resume animation when becoming visible
        if (entry.isIntersecting && rafIdRef.current === null) {
          animate();
        }
      },
      { threshold: 0.1 }
    );

    if (container) {
      observer.observe(container);
    }

    // Cleanup
    return () => {
      // Cancel any pending animation frame
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      // Disconnect observer
      observer.disconnect();

      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      renderer.dispose();
      geometry.dispose();
      wireframeMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Expose color update functions via custom event
  useEffect(() => {
    const handleColorChange = (e: CustomEvent<{ color: string }>) => {
      updateColors(e.detail.color);
    };

    const handleColorReset = () => {
      resetColors();
    };

    window.addEventListener("three-color-change" as keyof WindowEventMap, handleColorChange as EventListener);
    window.addEventListener("three-color-reset" as keyof WindowEventMap, handleColorReset as EventListener);

    return () => {
      window.removeEventListener("three-color-change" as keyof WindowEventMap, handleColorChange as EventListener);
      window.removeEventListener("three-color-reset" as keyof WindowEventMap, handleColorReset as EventListener);
    };
  }, [updateColors, resetColors]);

  return (
    <div
      ref={containerRef}
      id="canvas-container"
      className={className}
      aria-hidden="true"
    />
  );
}

// Helper functions to trigger color changes from other components
export function triggerColorChange(color: string) {
  window.dispatchEvent(
    new CustomEvent("three-color-change", { detail: { color } })
  );
}

export function triggerColorReset() {
  window.dispatchEvent(new CustomEvent("three-color-reset"));
}
