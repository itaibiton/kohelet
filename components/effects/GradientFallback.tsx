"use client";

/**
 * GradientFallback Component
 *
 * CSS-based gradient fallback for mobile devices, devices without WebGL support,
 * or low-end devices (< 4 CPU cores). Matches the dark theme and glassmorphism
 * aesthetic while being highly performant.
 */

interface GradientFallbackProps {
  className?: string;
}

export function GradientFallback({ className }: GradientFallbackProps) {
  return (
    <div
      id="gradient-fallback"
      className={className}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        background: `
          radial-gradient(ellipse at 50% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 60%, rgba(91, 79, 255, 0.1) 0%, transparent 50%),
          radial-gradient(ellipse at 20% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
          linear-gradient(180deg, #020204 0%, #08080a 100%)
        `,
      }}
    >
      {/* Subtle animated overlay for depth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 50%)
          `,
          animation: 'pulse-gradient 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }}
      />

      {/* CSS-only gradient animation */}
      <style jsx>{`
        @keyframes pulse-gradient {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          div {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
