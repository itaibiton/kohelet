export const RUN_CYCLE_SECONDS = 0.6;
export const ACTION_CYCLE_SECONDS = 14.4;

export type RunJoint =
  | "Body_Pivot" | "Head_Pivot" | "Arm_R_Pivot" | "Arm_L_Pivot"
  | "Leg_R_Pivot" | "Leg_L_Pivot" | "Knee_R_Pivot" | "Knee_L_Pivot"
  | "Boot_R_Pivot" | "Boot_L_Pivot" | "Cape_Pivot";

export type RobotRotation = { x: number; y: number; z: number };
export type RobotAction = "run" | "jump" | "code" | "automate";
type JointPose = { bodyLift: number; joints: Record<RunJoint, RobotRotation> };
export type RobotActionPose = JointPose & {
  phase: number;
  action: RobotAction;
  actionProgress: number;
  root: { x: number; y: number; z: number; yaw: number };
  /** Volume-preserving stretch around Body_Pivot; the workstation stays rigid. */
  squash: number;
  props: { laptop: number; automation: number; codeProgress: number; automationProgress: number };
  trail: { speed: number; spread: number };
};

const TAU = Math.PI * 2;
const JOINTS: RunJoint[] = [
  "Body_Pivot", "Head_Pivot", "Arm_R_Pivot", "Arm_L_Pivot", "Leg_R_Pivot", "Leg_L_Pivot",
  "Knee_R_Pivot", "Knee_L_Pivot", "Boot_R_Pivot", "Boot_L_Pivot", "Cape_Pivot",
];
const clamp = (value: number) => Math.min(1, Math.max(0, value));
const mix = (a: number, b: number, amount: number) => a + (b - a) * amount;
/** Minimum-jerk joint interpolation: position, velocity, and acceleration match at each boundary. */
const settle = (value: number) => { const x = clamp(value); return x * x * x * (x * (x * 6 - 15) + 10); };
const between = (time: number, start: number, end: number) => settle((time - start) / (end - start));
const window = (time: number, enter: number, entered: number, leave: number, left: number) =>
  between(time, enter, entered) * (1 - between(time, leave, left));

function blend(a: JointPose, b: JointPose, amount: number): JointPose {
  const joints = {} as Record<RunJoint, RobotRotation>;
  for (const name of JOINTS) {
    joints[name] = {
      x: mix(a.joints[name].x, b.joints[name].x, amount),
      y: mix(a.joints[name].y, b.joints[name].y, amount),
      z: mix(a.joints[name].z, b.joints[name].z, amount),
    };
  }
  return { bodyLift: mix(a.bodyLift, b.bodyLift, amount), joints };
}

/** One fast, seamless stride. Every value is an offset from the authored neutral rig. */
export function getRobotRunPose(time: number) {
  const phase = ((time % RUN_CYCLE_SECONDS) / RUN_CYCLE_SECONDS) * TAU + Math.PI / 2;
  const stride = Math.sin(phase);
  const hipR = -0.72 * stride;
  const hipL = 0.72 * stride;
  const kneeR = 0.16 + 1.05 * Math.max(0, -stride) ** 2;
  const kneeL = 0.16 + 1.05 * Math.max(0, stride) ** 2;
  const joints: Record<RunJoint, RobotRotation> = {
    Body_Pivot: { x: 0.2, y: 0.045 * stride, z: 0.025 * stride },
    Head_Pivot: { x: -0.13 + 0.035 * Math.cos(phase * 2), y: -0.035 * stride, z: -0.018 * stride },
    Arm_R_Pivot: { x: 0.72 * stride, y: 0, z: -0.035 * Math.cos(phase) },
    Arm_L_Pivot: { x: -0.72 * stride, y: 0, z: 0.035 * Math.cos(phase) },
    Leg_R_Pivot: { x: hipR, y: 0, z: 0 },
    Leg_L_Pivot: { x: hipL, y: 0, z: 0 },
    Knee_R_Pivot: { x: kneeR, y: 0, z: 0 },
    Knee_L_Pivot: { x: kneeL, y: 0, z: 0 },
    Boot_R_Pivot: { x: -0.16 - 0.72 * hipR - 0.38 * kneeR, y: 0, z: 0 },
    Boot_L_Pivot: { x: -0.16 - 0.72 * hipL - 0.38 * kneeL, y: 0, z: 0 },
    Cape_Pivot: { x: 0.21 + 0.08 * Math.sin(phase * 2 - 0.7), y: 0.06 * stride, z: 0.055 * Math.sin(phase - 0.4) },
  };
  return { phase, bodyLift: 0.078 + 0.09 * Math.cos(phase * 2), joints };
}

function standing(time: number): JointPose {
  // These tiny motions are local to the hands/head; both planted legs stay still.
  const breathe = Math.sin(time * TAU / 2.4);
  return {
    bodyLift: 0.07,
    joints: {
      Body_Pivot: { x: 0.045, y: 0, z: 0 },
      Head_Pivot: { x: 0.08 + 0.008 * breathe, y: 0, z: 0 },
      Arm_R_Pivot: { x: -0.08, y: 0, z: -0.025 },
      Arm_L_Pivot: { x: -0.08, y: 0, z: 0.025 },
      Leg_R_Pivot: { x: -0.05, y: 0, z: 0 },
      Leg_L_Pivot: { x: -0.05, y: 0, z: 0 },
      Knee_R_Pivot: { x: 0.1, y: 0, z: 0 },
      Knee_L_Pivot: { x: 0.1, y: 0, z: 0 },
      Boot_R_Pivot: { x: -0.095, y: 0, z: 0 },
      Boot_L_Pivot: { x: -0.095, y: 0, z: 0 },
      Cape_Pivot: { x: 0.04 + 0.008 * breathe, y: 0, z: 0.01 * breathe },
    },
  };
}

function crouching(time: number): JointPose {
  const pose = standing(time);
  pose.bodyLift = 0.015;
  pose.joints.Body_Pivot.x = 0.1;
  pose.joints.Head_Pivot.x = -0.06;
  for (const side of ["R", "L"] as const) {
    pose.joints[`Leg_${side}_Pivot`].x = -0.26;
    pose.joints[`Knee_${side}_Pivot`].x = 0.52;
    pose.joints[`Boot_${side}_Pivot`].x = -0.36;
    pose.joints[`Arm_${side}_Pivot`].x = 0.2;
  }
  return pose;
}

function airborne(time: number): JointPose {
  const pose = standing(time);
  pose.bodyLift = 0.07;
  pose.joints.Body_Pivot.x = 0.19;
  pose.joints.Head_Pivot.x = -0.12;
  pose.joints.Arm_R_Pivot = { x: -1.05, y: -0.1, z: -0.17 };
  pose.joints.Arm_L_Pivot = { x: -0.85, y: 0.1, z: 0.17 };
  pose.joints.Leg_R_Pivot.x = -0.65;
  pose.joints.Leg_L_Pivot.x = 0.2;
  pose.joints.Knee_R_Pivot.x = 1.18;
  pose.joints.Knee_L_Pivot.x = 0.9;
  pose.joints.Boot_R_Pivot.x = -0.6;
  pose.joints.Boot_L_Pivot.x = -0.8;
  pose.joints.Cape_Pivot = { x: 0.38, y: 0.02, z: -0.1 };
  return pose;
}

function coding(time: number): JointPose {
  const pose = standing(time);
  const tap = Math.sin(time * TAU * 4);
  pose.joints.Head_Pivot.x = 0.13 + Math.sin(time * TAU * 0.8) * 0.015;
  pose.joints.Head_Pivot.y = Math.sin(time * TAU * 0.6) * 0.035;
  pose.joints.Arm_R_Pivot = { x: 0.045 * tap, y: 0.035, z: -0.11 };
  pose.joints.Arm_L_Pivot = { x: -0.045 * tap, y: -0.035, z: 0.11 };
  return pose;
}

function automating(time: number): JointPose {
  const pose = standing(time);
  // A deliberate press, then a tracing gesture along the connected workflow.
  const local = clamp((time - 8.9) / 2.5);
  const press = window(local, 0.05, 0.2, 0.35, 0.5);
  const trace = window(local, 0.38, 0.58, 0.82, 0.98);
  pose.joints.Head_Pivot = { x: 0.04, y: -0.11 * trace, z: 0 };
  pose.joints.Arm_R_Pivot = { x: -0.4 - 0.24 * press, y: -0.1 * trace, z: -0.12 + 0.13 * trace };
  pose.joints.Arm_L_Pivot = { x: -0.22, y: 0.04, z: 0.08 };
  return pose;
}

/**
 * A floor-level, repeating marketing vignette: sprint, hop, code, connect a workflow, sprint.
 * Time is elapsed PLAYING time, so pausing does not skip ahead through the story.
 * The 14.4s story contains exactly 24 strides; both pose and velocity match at the loop seam.
 */
export function getRobotActionPose(time: number): RobotActionPose {
  const t = ((time % ACTION_CYCLE_SECONDS) + ACTION_CYCLE_SECONDS) % ACTION_CYCLE_SECONDS;
  const run = getRobotRunPose(t);
  const rest = standing(t);
  let pose: JointPose = run;
  let action: RobotAction = "run";
  let actionProgress = t / 2.1;
  let runAmount = 1;
  let yaw = -0.55;
  let rise = 0;
  let squash = 1;

  if (t >= 2.1 && t < 2.4) {
    const amount = between(t, 2.1, 2.4);
    pose = blend(run, crouching(t), amount);
    action = "jump"; actionProgress = (t - 2.1) / 1.5;
    runAmount = 1 - amount;
    squash = mix(1, 0.975, amount);
  } else if (t >= 2.4 && t < 3.3) {
    const progress = (t - 2.4) / 0.9;
    const arch = Math.sin(progress * Math.PI) ** 2;
    pose = blend(crouching(t), airborne(t), arch);
    rise = 0.67 * arch;
    squash = mix(0.975, 1.025, arch);
    action = "jump"; actionProgress = (t - 2.1) / 1.5;
    runAmount = 0;
  } else if (t >= 3.3 && t < 3.6) {
    const amount = between(t, 3.3, 3.6);
    pose = blend(crouching(t), rest, amount);
    squash = mix(0.975, 1, amount);
    action = "jump"; actionProgress = (t - 2.1) / 1.5;
    runAmount = 0;
  } else if (t >= 3.6 && t < 4.1) {
    const amount = between(t, 3.6, 4.1);
    pose = blend(rest, coding(t), amount);
    yaw = mix(-0.55, -0.08, amount);
    action = "code"; actionProgress = 0;
    runAmount = 0;
  } else if (t >= 4.1 && t < 6.6) {
    pose = coding(t); yaw = -0.08;
    action = "code"; actionProgress = (t - 4.1) / 2.5;
    runAmount = 0;
  } else if (t >= 6.6 && t < 7.1) {
    const amount = between(t, 6.6, 7.1);
    pose = blend(coding(t), run, amount);
    yaw = mix(-0.08, -0.55, amount);
    actionProgress = 0; runAmount = amount;
  } else if (t >= 7.1 && t < 8.4) {
    actionProgress = (t - 7.1) / 1.3;
  } else if (t >= 8.4 && t < 8.9) {
    const amount = between(t, 8.4, 8.9);
    pose = blend(run, automating(t), amount);
    yaw = mix(-0.55, -0.08, amount);
    action = "automate"; actionProgress = 0;
    runAmount = 1 - amount;
  } else if (t >= 8.9 && t < 11.4) {
    pose = automating(t); yaw = -0.08;
    action = "automate"; actionProgress = (t - 8.9) / 2.5;
    runAmount = 0;
  } else if (t >= 11.4 && t < 12) {
    const amount = between(t, 11.4, 12);
    pose = blend(automating(t), run, amount);
    yaw = mix(-0.08, -0.55, amount);
    actionProgress = 0; runAmount = amount;
  } else if (t >= 12) {
    actionProgress = (t - 12) / 2.4;
  }

  // The opening burst travels in the facing direction. Later sprints run on the
  // spot; the quieter automation beat gently recenters the whole workstation.
  // Reversing stage travel during a sprint would make the feet appear to run backwards.
  const forward = between(t, 0, 3.6);
  const recenter = between(t, 8.9, 11.4);
  const x = mix(mix(0.16, -0.2, forward), 0.16, recenter);
  const z = mix(mix(-0.25, 0.32, forward), -0.25, recenter);

  return {
    ...pose,
    phase: run.phase,
    action,
    actionProgress: clamp(actionProgress),
    root: { x, y: rise, z, yaw },
    squash,
    props: {
      laptop: window(t, 3.65, 4.02, 6.42, 6.8),
      automation: window(t, 8.45, 8.85, 11.2, 11.62),
      codeProgress: between(t, 4.1, 6.4) * (1 - between(t, 6.8, 7.1)),
      automationProgress: between(t, 8.9, 11.2) * (1 - between(t, 11.62, 12)),
    },
    trail: { speed: runAmount, spread: 1 + rise * 0.7 },
  };
}
