"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { RobotKingController } from "./RobotKingScene";

type RobotKingProps = {
  label: string;
  controlLabel: string;
  playLabel: string;
  pauseLabel: string;
};

export default function RobotKing({ label, controlLabel, playLabel, pauseLabel }: RobotKingProps) {
  const [manualPlaying, setManualPlaying] = useState<boolean | null>(null);
  const subscribeToMotionPreference = useCallback((callback: () => void) => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      setManualPlaying(null);
      callback();
    };
    preference.addEventListener("change", onChange);
    return () => preference.removeEventListener("change", onChange);
  }, []);
  const reducedMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");
  const playing = manualPlaying ?? !reducedMotion;
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
          src="/images/codex-landing/robot-king-3d-poster.webp"
          alt=""
          aria-hidden="true"
          width={1254}
          height={1254}
          sizes="(max-width: 700px) 100vw, (max-width: 1392px) 44vw, 573px"
          priority
        />
        <div className="kl-robot-canvas" ref={mountRef} aria-hidden="true" />
      </div>
      {status === "ready" && (
        <button
          type="button"
          className="kl-robot-control"
          aria-label={`${playing ? pauseLabel : playLabel} — ${controlLabel}`}
          aria-pressed={playing}
          onClick={() => {
            controllerRef.current?.setPlaying(!playing);
            setManualPlaying(!playing);
          }}
        >
          {playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
          <span>{playing ? pauseLabel : playLabel}</span>
        </button>
      )}
    </div>
  );
}
