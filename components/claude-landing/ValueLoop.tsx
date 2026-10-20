"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { Search, Workflow, Compass, RefreshCw } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { loop, type LoopStage } from "./content";

/**
 * The value loop: Visibility → Workflows → Decisions → Improve → …
 *
 * A pulse travels the loop (SMIL animateMotion: scales with the viewBox and
 * runs off the main thread). The caption follows the pulse. Picking a node
 * takes control: the pulse pauses and the caption switches with a short
 * blur crossfade. Reduced motion: no pulse, no autoplay, opacity-only fades.
 */

const CYCLE_S = 10;
// Fraction of the cycle at which each stage becomes active (pulse arrives).
const STAGE_STARTS = [0, 0.22, 0.44, 0.68];
const STAGE_DURATIONS_MS = [2200, 2200, 2400, 3200];
const KEY_TIMES = "0;0.12;0.22;0.34;0.44;0.56;0.68;0.80;1";

const DESKTOP = {
  viewBox: "0 0 800 360",
  tracks: ["M180 120 H340", "M460 120 H620"],
  returnPath: "M680 180 V230 Q680 260 650 260 H150 Q120 260 120 230 V180",
  pulsePath:
    "M120 120 H400 H680 V230 Q680 260 650 260 H400 H150 Q120 260 120 230 V120",
  keyPoints: "0;0;0.204;0.204;0.408;0.408;0.704;0.704;1",
};

const MOBILE = {
  viewBox: "0 0 360 640",
  tracks: ["M180 150 V260", "M180 380 V490"],
  returnPath: "M120 550 H60 Q40 550 40 530 V110 Q40 90 60 90 H120",
  pulsePath:
    "M180 90 V320 V550 H60 Q40 550 40 530 V320 V110 Q40 90 60 90 H180",
  keyPoints: "0;0;0.195;0.195;0.389;0.389;0.695;0.695;1",
};

const ICONS = {
  visibility: Search,
  workflows: Workflow,
  decisions: Compass,
  improve: RefreshCw,
} as const;

function LoopSvg({
  variant,
  className,
  svgRef,
  showPulse,
}: {
  variant: typeof DESKTOP;
  className: string;
  svgRef: (el: SVGSVGElement | null) => void;
  showPulse: boolean;
}) {
  return (
    <svg
      ref={svgRef}
      className={`cl-loop-svg ${className}`}
      viewBox={variant.viewBox}
      aria-hidden="true"
      focusable="false"
    >
      {variant.tracks.map((d) => (
        <path key={d} d={d} className="cl-loop-track" />
      ))}
      <path d={variant.returnPath} className="cl-loop-track" />
      <path d={variant.returnPath} className="cl-loop-track-dash" />
      {showPulse && (
        <g>
          <circle r="11" className="cl-loop-pulse-halo">
            <animateMotion
              dur={`${CYCLE_S}s`}
              repeatCount="indefinite"
              begin="indefinite"
              calcMode="linear"
              keyTimes={KEY_TIMES}
              keyPoints={variant.keyPoints}
              path={variant.pulsePath}
            />
          </circle>
          <circle r="4.5" className="cl-loop-pulse">
            <animateMotion
              dur={`${CYCLE_S}s`}
              repeatCount="indefinite"
              begin="indefinite"
              calcMode="linear"
              keyTimes={KEY_TIMES}
              keyPoints={variant.keyPoints}
              path={variant.pulsePath}
            />
          </circle>
        </g>
      )}
    </svg>
  );
}

export function ValueLoop() {
  const reduce = useReducedMotion();
  const stages = loop.stages;

  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(0);
  const [captionState, setCaptionState] = useState<"in" | "out">("in");
  const [auto, setAuto] = useState(true);
  const [running, setRunning] = useState(false);

  const svgs = useRef<Set<SVGSVGElement>>(new Set());
  const rootRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const activeRef = useRef(0);
  const swapTimer = useRef<number | null>(null);

  // Caption crossfade: fade out, swap content, fade in.
  const changeStage = useCallback(
    (idx: number) => {
      if (activeRef.current === idx) return;
      activeRef.current = idx;
      setActive(idx);
      setCaptionState("out");
      if (swapTimer.current) window.clearTimeout(swapTimer.current);
      swapTimer.current = window.setTimeout(
        () => {
          setShown(idx);
          setCaptionState("in");
        },
        reduce ? 150 : 220
      );
    },
    [reduce]
  );

  useEffect(() => {
    return () => {
      if (swapTimer.current) window.clearTimeout(swapTimer.current);
    };
  }, []);

  const registerSvg = useCallback((el: SVGSVGElement | null) => {
    if (el) svgs.current.add(el);
  }, []);

  const showPulse = !reduce;

  // Start the pulse and the follower loop when the diagram scrolls into view.
  useEffect(() => {
    if (reduce) return;
    const root = rootRef.current;
    if (!root) return;

    let raf = 0;
    const tick = () => {
      const first = svgs.current.values().next().value as SVGSVGElement | undefined;
      if (first) {
        const t = (first.getCurrentTime() % CYCLE_S) / CYCLE_S;
        let idx = 0;
        for (let i = 0; i < STAGE_STARTS.length; i++) {
          if (t >= STAGE_STARTS[i]) idx = i;
        }
        changeStage(idx);
      }
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        svgs.current.forEach((svg) => {
          if (visible) {
            if (!started.current) {
              svg.setCurrentTime(0);
              svg.querySelectorAll("animateMotion").forEach((a) =>
                (a as SVGAnimateMotionElement).beginElement()
              );
            }
            if (auto) svg.unpauseAnimations();
          } else {
            svg.pauseAnimations();
          }
        });
        if (visible) {
          started.current = true;
          if (auto) {
            setRunning(true);
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(tick);
          }
        } else {
          setRunning(false);
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.35 }
    );
    io.observe(root);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduce, auto, changeStage]);

  const takeControl = (idx: number) => {
    if (auto) {
      setAuto(false);
      setRunning(false);
      svgs.current.forEach((svg) => svg.pauseAnimations());
    }
    changeStage(idx);
  };

  const stage: LoopStage = stages[shown];
  const progressStyle = useMemo(
    () => ({ "--duration": `${STAGE_DURATIONS_MS[shown]}ms` }) as CSSProperties,
    [shown]
  );

  return (
    <div
      ref={rootRef}
      className="cl-loop"
      data-active={stages[active].id}
    >
      <div className="relative">
        <LoopSvg
          variant={DESKTOP}
          className="hidden md:block"
          svgRef={registerSvg}
          showPulse={showPulse}
        />
        <LoopSvg
          variant={MOBILE}
          className="block md:hidden"
          svgRef={registerSvg}
          showPulse={showPulse}
        />

        <div role="group" aria-label="Stages of the value loop">
          {stages.map((s, i) => {
            const Icon = ICONS[s.id];
            return (
              <button
                key={s.id}
                type="button"
                className="cl-node"
                data-pos={i}
                aria-pressed={active === i}
                aria-label={`${s.label}: ${s.title}`}
                onClick={() => takeControl(i)}
              >
                <Icon aria-hidden="true" strokeWidth={1.6} />
                <span className="cl-node-label">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="mx-auto mt-10 max-w-xl text-center md:mt-8"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="cl-caption" data-state={captionState}>
          <p className="cl-eyebrow justify-center">{stage.label}</p>
          <h3 className="cl-h2 mt-3 text-2xl md:text-3xl">{stage.title}</h3>
          <p className="cl-lede mt-3 text-[15px] leading-relaxed md:text-base">
            {stage.body}
          </p>
        </div>
        <div
          className="cl-progress mx-auto mt-6 w-24"
          data-running={running && auto ? "true" : "false"}
          key={`${shown}-${running}`}
          style={progressStyle}
          aria-hidden="true"
        >
          <span />
        </div>
      </div>
    </div>
  );
}
