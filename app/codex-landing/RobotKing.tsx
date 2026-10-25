"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { RobotKingController } from "./RobotKingScene";

type RobotKingProps = {
  label: string;
};

export default function RobotKing({ label }: RobotKingProps) {
  const subscribeToMotionPreference = useCallback((callback: () => void) => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    preference.addEventListener("change", callback);
    return () => preference.removeEventListener("change", callback);
  }, []);
  const reducedMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");
  const playing = !reducedMotion;
  const stageRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<RobotKingController | null>(null);
  const playingRef = useRef(playing);

  useEffect(() => {
    playingRef.current = playing;
    controllerRef.current?.setPlaying(playing);
  }, [playing]);

  useEffect(() => {
    const stage = stageRef.current;
    const mount = mountRef.current;
    if (!stage || !mount || !("IntersectionObserver" in window)) return;
    let cancelled = false;
    let started = false;
    let visible = false;

    async function startScene() {
      if (started) return;
      started = true;
      try {
        const { createRobotKingScene } = await import("./RobotKingScene");
        if (cancelled) return;
        controllerRef.current = createRobotKingScene(mount!, {
          playing: playingRef.current,
          visible,
          onReady: () => { if (!cancelled) setStatus("ready"); },
          onError: () => { if (!cancelled) setStatus("fallback"); },
        });
      } catch {
        if (!cancelled) setStatus("fallback");
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      controllerRef.current?.setVisible(visible);
      if (visible) void startScene();
    }, { threshold: 0.01 });
    observer.observe(stage);

    return () => {
      cancelled = true;
      observer.disconnect();
      controllerRef.current?.dispose();
      controllerRef.current = null;
    };
  }, []);

  return (
    <div className="kl-hero-art kl-robot-king" data-robot-state={status} data-playing={playing && status === "ready"}>
      <div className="kl-robot-stage" ref={stageRef} role="img" aria-label={label}>
        <Image
          className="kl-robot-poster"
          src="/images/codex-landing/robot-king-performance-poster.webp"
          alt=""
          aria-hidden="true"
          width={1280}
          height={1280}
          sizes="(max-width: 700px) 100vw, (max-width: 1392px) 44vw, 573px"
          priority
        />
        <div className="kl-robot-canvas" ref={mountRef} aria-hidden="true" />
      </div>
    </div>
  );
}
