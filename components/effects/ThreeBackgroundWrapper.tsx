"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { GradientFallback } from "./GradientFallback";

/**
 * ThreeBackgroundWrapper Component
 *
 * Intelligently loads the THREE.js background based on device capabilities:
 * - Uses dynamic import with ssr: false to prevent server-side rendering
 * - Shows loading state during import (subtle, non-intrusive)
 * - Falls back to CSS gradient on mobile, low-end devices, or without WebGL
 * - Reduces initial bundle size by ~412KB gzipped (two 206KB chunks)
 */

// Dynamically import ThreeBackground with no SSR
const ThreeBackground = dynamic(
  () => import("./ThreeBackground").then((mod) => mod.ThreeBackground),
  {
    ssr: false,
    loading: () => <LoadingState />,
  }
);

/**
 * Checks if the browser supports WebGL rendering
 */
function hasWebGLSupport(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}

/**
 * Detects low-end devices based on CPU core count
 * Devices with < 4 cores are considered low-end
 */
function isLowEndDevice(): boolean {
  if (typeof navigator === "undefined") return false;

  const cores = navigator.hardwareConcurrency || 4;
  return cores < 4;
}

/**
 * Detects mobile devices via user agent
 */
function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Determines if the device can handle THREE.js rendering
 */
function canRenderThreeJS(): boolean {
  // Always return false on server
  if (typeof window === "undefined") return false;

  // Check all conditions
  const hasWebGL = hasWebGLSupport();
  const isLowEnd = isLowEndDevice();
  const isMobile = isMobileDevice();

  // Render THREE.js only if:
  // 1. WebGL is supported
  // 2. Device is not low-end
  // 3. Device is not mobile
  return hasWebGL && !isLowEnd && !isMobile;
}

/**
 * Loading state shown during dynamic import
 * Subtle and non-intrusive to avoid flash
 */
function LoadingState() {
  return (
    <div
      id="canvas-loading"
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
      style={{
        background: "linear-gradient(180deg, #020204 0%, #08080a 100%)",
        opacity: 1,
        transition: "opacity 0.3s ease-out",
      }}
    />
  );
}

interface ThreeBackgroundWrapperProps {
  className?: string;
}

export function ThreeBackgroundWrapper({
  className,
}: ThreeBackgroundWrapperProps) {
  const [shouldRenderThree, setShouldRenderThree] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Perform capability checks on client side only
    const canRender = canRenderThreeJS();
    setShouldRenderThree(canRender);
    setIsChecking(false);

    // Log for debugging (can be removed in production)
    if (process.env.NODE_ENV === "development") {
      console.log("[ThreeBackgroundWrapper] Capability check:", {
        hasWebGL: hasWebGLSupport(),
        isLowEnd: isLowEndDevice(),
        isMobile: isMobileDevice(),
        willRenderThree: canRender,
      });
    }
  }, []);

  // Show nothing during initial check to prevent flash
  if (isChecking) {
    return <LoadingState />;
  }

  // Render THREE.js or gradient fallback based on capabilities
  if (shouldRenderThree) {
    return <ThreeBackground className={className} />;
  }

  return <GradientFallback className={className} />;
}

// Re-export helper functions for color changes
export { triggerColorChange, triggerColorReset } from "./ThreeBackground";
