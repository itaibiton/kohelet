"use client";

import dynamic from "next/dynamic";

/**
 * EffectsWrapper Component
 *
 * Dynamically loads visual effects to reduce initial bundle size:
 * - Uses dynamic import with ssr: false for both effects
 * - MouseGlow: Interactive cursor effect, client-side only
 * - NoiseOverlay: Visual texture overlay, client-side only
 * - No loading skeleton needed - effects are visual enhancements that can fade in
 * - Loads after main content to prioritize critical rendering path
 */

// Dynamically import MouseGlow with no SSR
const MouseGlow = dynamic(() => import("./MouseGlow"), {
  ssr: false,
});

// Dynamically import NoiseOverlay with no SSR
const NoiseOverlay = dynamic(() => import("./NoiseOverlay"), {
  ssr: false,
});

interface EffectsWrapperProps {
  className?: string;
}

/**
 * Renders both visual effects with optimized loading
 * Effects load independently and asynchronously after main content
 */
export function EffectsWrapper({ className }: EffectsWrapperProps) {
  return (
    <>
      <NoiseOverlay />
      <MouseGlow />
    </>
  );
}

export default EffectsWrapper;
