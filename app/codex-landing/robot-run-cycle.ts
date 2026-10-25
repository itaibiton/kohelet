/** Authored seconds and model units. The renderer applies these without a scale conversion. */
export const RUN_CYCLE_SECONDS = 0.63;
export const ACTION_CYCLE_SECONDS = 20.16;
export const ACTION_BOUNDARIES = [0, 2, 3.2, 3.43, 3.55, 4.43, 4.55, 4.62, 4.7, 4.95, 5.35, 5.9, 8.8, 9.25, 9.7, 10.3, 10.8, 11.2, 12.3, 12.6, 13.1, 13.55, 13.9, 15.2, 16, 16.6, 17.5, 20.16];
export type RunJoint = "Body_Pivot" | "Torso_Pivot" | "Head_Pivot" | "Arm_R_Pivot" | "Arm_L_Pivot" |
  "Elbow_R_Pivot" | "Elbow_L_Pivot" | "Wrist_R_Pivot" | "Wrist_L_Pivot" |
  "Leg_R_Pivot" | "Leg_L_Pivot" | "Knee_R_Pivot" | "Knee_L_Pivot" | "Boot_R_Pivot" | "Boot_L_Pivot" | "Cape_Pivot";
export type RobotRotation = { x: number; y: number; z: number };
export type RobotAction = "run" | "jump" | "code" | "automate" | "celebrate";
export type RobotActionPose = {
  phase: number; action: RobotAction; actionProgress: number; bodyLift: number;
  joints: Record<RunJoint, RobotRotation>;
  root: { x: number; y: number; z: number; yaw: number };
  /** Legs keep unit scale for contact. Compression comes from the knees, not stretching the rig. */
  squash: number;
  props: { laptop: number; laptopLid: number; codeProgress: number; automation: number;
    automationProgress: number; automationAssemble: number; automationDrag: number; automationPress: number };
  trail: { speed: number; spread: number };
  eyes: { blink: number; lookX: number; lookY: number; focus: number; surprise: number; pleasure: number; expression: "focused" | "surprised" | "pleased" };
  effects: { speed: number; impact: number; success: number; turn: number; codeTyped: number };
  footContacts: { right: number; left: number };
};
type V = [number, number, number];
type Q = [number, number, number, number];
type Foot = { x: number; z: number; height: number; pitch: number; contact: number };
type Guide = { bodyLift: number; joints: Record<RunJoint, RobotRotation>; feet: { R: Foot; L: Foot } };
const TAU = Math.PI * 2;
const BODY_YAW = Math.PI / 60;
// The exported head is already tilted. Offsets are added to this rest Euler in the renderer.
const HEAD_REST = { x: -0.06892629556095665, y: -0.13639004799409019, z: 0.20054983047430316 };
const FLOOR = -0.025;
const CONTACT_CLEARANCE = 0.002;
const JOINTS: RunJoint[] = ["Body_Pivot", "Torso_Pivot", "Head_Pivot", "Arm_R_Pivot", "Arm_L_Pivot", "Elbow_R_Pivot", "Elbow_L_Pivot", "Wrist_R_Pivot", "Wrist_L_Pivot", "Leg_R_Pivot", "Leg_L_Pivot", "Knee_R_Pivot", "Knee_L_Pivot", "Boot_R_Pivot", "Boot_L_Pivot", "Cape_Pivot"];
const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const mix = (a: number, b: number, u: number) => a + (b - a) * u;
/** Minimum-jerk interpolation of a physical joint target; derivatives vanish at a held key pose. */
const settle = (value: number) => { const u = clamp(value); return clamp(u * u * u * (u * (u * 6 - 15) + 10)); };
const between = (t: number, a: number, b: number) => settle((t - a) / (b - a));
const window = (t: number, a: number, b: number, c: number, d: number) => between(t, a, b) * (1 - between(t, c, d));
const periodic = (t: number, period: number) => ((t % period) + period) % period;
const rotation = (x = 0, y = 0, z = 0): RobotRotation => ({ x, y, z });
const add = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a: V, k: number): V => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a: V, b: V) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const length = (a: V) => Math.sqrt(dot(a, a));
const normalize = (a: V): V => mul(a, 1 / Math.max(1e-10, length(a)));
function qMultiply(a: Q, b: Q): Q {
  return [a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1], a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0], a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3], a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]];
}
const qInverse = (q: Q): Q => [-q[0], -q[1], -q[2], q[3]];
function qEuler({ x, y, z }: RobotRotation): Q {
  const a = Math.cos(x / 2), b = Math.sin(x / 2), c = Math.cos(y / 2), d = Math.sin(y / 2), e = Math.cos(z / 2), f = Math.sin(z / 2);
  return [b * c * e + a * d * f, a * d * e - b * c * f, a * c * f + b * d * e, a * c * e - b * d * f];
}
function qRotate(q: Q, v: V): V { const p = qMultiply(qMultiply(q, [v[0], v[1], v[2], 0]), qInverse(q)); return [p[0], p[1], p[2]]; }
function qToEuler([x, y, z, w]: Q): RobotRotation {
  const m13 = 2 * (x * z + y * w);
  const ry = Math.asin(clamp(m13, -1, 1));
  if (Math.abs(m13) < 0.9999999) return rotation(Math.atan2(2 * (x * w - y * z), 1 - 2 * (x * x + y * y)), ry, Math.atan2(2 * (z * w - x * y), 1 - 2 * (y * y + z * z)));
  return rotation(Math.atan2(2 * (x * w + y * z), 1 - 2 * (x * x + z * z)), ry, 0);
}
function qFromTo(from: V, to: V): Q {
  const a = normalize(from), b = normalize(to), w = 1 + dot(a, b);
  const cross: V = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const n = Math.sqrt(dot(cross, cross) + w * w);
  return n > 1e-8 ? [cross[0] / n, cross[1] / n, cross[2] / n, w / n] : [1, 0, 0, 0];
}
function bodyTransform(guide: Guide) {
  const r = guide.joints.Body_Pivot;
  return { q: qEuler(rotation(r.x, r.y + BODY_YAW, r.z)), position: [0, 1.56 + guide.bodyLift, 0] as V };
}

/** Head targets are in model-root space: the gaze stays ahead while the shoulders move below it. */
function stabilizeHead(guide: Guide) {
  const target = guide.joints.Head_Pivot;
  const parent = qMultiply(bodyTransform(guide).q, qEuler(guide.joints.Torso_Pivot));
  const local = qToEuler(qMultiply(qInverse(parent), qEuler(rotation(target.x, BODY_YAW + target.y, target.z))));
  guide.joints.Head_Pivot = rotation(local.x - HEAD_REST.x, local.y - HEAD_REST.y, local.z - HEAD_REST.z);
}

// Convex Y/Z support hull of the actual exported boot, in its ankle's local space.
// This maintains heel/toe contact as the sole rolls, rather than guessing an ankle bob.
const BOOT_HULL = [[-0.29, -0.3], [-0.2813162, -0.3324573], [-0.2607249, -0.363979], [-0.248979, -0.3757249], [-0.233, -0.38], [0.613, -0.38], [0.628979, -0.3757249], [0.6407249, -0.363979], [0.6613162, -0.3324573], [0.67, -0.3], [0.68, -0.15], [0.68, -0.11], [0.6559526, -0.0201181], [0.5898819, 0.0459527], [0.2199344, 0.2166404], [0.17, 0.23], [-0.13, 0.23], [-0.1799344, 0.2166404], [-0.2166404, 0.1799344], [-0.23, 0.1300001]];
export function bootSupportHeight(pitch: number) {
  let minimum = Infinity;
  for (const [z, y] of BOOT_HULL) minimum = Math.min(minimum, y * Math.cos(pitch) - z * Math.sin(pitch));
  return FLOOR + CONTACT_CLEARANCE - minimum;
}

/** Exact two-bone IK, including small lateral hip shifts and inverse ankle orientation. */
function solveFeet(guide: Guide) {
  const { q, position } = bodyTransform(guide);
  for (const [side, sign] of [["R", -1], ["L", 1]] as const) {
    const foot = guide.feet[side];
    const desired: V = [foot.x, bootSupportHeight(foot.pitch) + foot.height, foot.z];
    const hip: V = [sign * 0.39, -0.42, 0];
    const vector = sub(qRotate(qInverse(q), sub(desired, position)), hip);
    const reach = Math.max(0.1, length(vector));
    // A soft extension limit avoids the IK singularity of a perfectly locked knee.
    const softReach = reach <= 0.73 ? reach : 0.73 + 0.02 * (1 - Math.exp(-(reach - 0.73) / 0.02));
    const distance = mix(Math.min(reach, 0.7599), softReach, 1 - foot.contact);
    const knee = Math.acos(clamp((distance * distance - 0.41 ** 2 - 0.35 ** 2) / (2 * 0.41 * 0.35), -1, 1));
    const plane = 0.41 + 0.35 * Math.cos(knee);
    const roll = Math.asin(clamp(vector[0] / plane, -0.9, 0.9));
    const pitch = Math.atan2(-vector[2], -vector[1]) - Math.atan2(0.35 * Math.sin(knee), plane * Math.cos(roll));
    const hipRotation = rotation(pitch, 0, roll);
    guide.joints[`Leg_${side}_Pivot`] = hipRotation;
    guide.joints[`Knee_${side}_Pivot`] = rotation(knee);
    const chain = qMultiply(qMultiply(q, qEuler(hipRotation)), qEuler(rotation(knee)));
    guide.joints[`Boot_${side}_Pivot`] = qToEuler(qMultiply(qInverse(chain), qEuler(rotation(foot.pitch))));
  }
}

/** IK targets are fist centers; independent elbow/wrist controls keep the hands on their work. */
function aimHand(guide: Guide, side: "R" | "L", target: V, handPitch = 0, elbowPole?: V) {
  const sign = side === "R" ? -1 : 1;
  const body = bodyTransform(guide);
  const torso = qMultiply(body.q, qEuler(guide.joints.Torso_Pivot));
  const torsoPosition = add(body.position, qRotate(body.q, [0, -0.18, 0]));
  const shoulder: V = [sign * 0.65, 0.47, 0];
  const handQ = qEuler(rotation(handPitch));
  const wrist = sub(target, qRotate(handQ, [0, 0, 0.12]));
  const wristLocal = qRotate(qInverse(torso), sub(wrist, torsoPosition));
  const vector = sub(wristLocal, shoulder);
  const upper: V = [sign * 0.16, -0.36, -0.01];
  const forearm: V = [0, 0, 0.37];
  const upperLength = length(upper), lowerLength = 0.37;
  const distance = clamp(length(vector), 0.1, upperLength + lowerLength - 0.001);
  const direction = normalize(vector);
  const elbowHint: V = elbowPole ?? [sign * 0.8, -0.9, -0.15];
  const projected = normalize(sub(elbowHint, mul(direction, dot(elbowHint, direction))));
  const along = (upperLength ** 2 - lowerLength ** 2 + distance ** 2) / (2 * distance);
  const altitude = Math.sqrt(Math.max(0, upperLength ** 2 - along ** 2));
  const elbowVector = add(mul(direction, along), mul(projected, altitude));
  const armQ = qFromTo(upper, elbowVector);
  const elbowPosition = add(shoulder, elbowVector);
  const forearmLocal = qRotate(qInverse(armQ), sub(wristLocal, elbowPosition));
  const elbowQ = qFromTo(forearm, forearmLocal);
  const armChain = qMultiply(qMultiply(torso, armQ), elbowQ);
  guide.joints[`Arm_${side}_Pivot`] = qToEuler(armQ);
  guide.joints[`Elbow_${side}_Pivot`] = qToEuler(elbowQ);
  guide.joints[`Wrist_${side}_Pivot`] = qToEuler(qMultiply(qInverse(armChain), handQ));
}

function baseGuide(): Guide {
  const joints = {} as Record<RunJoint, RobotRotation>;
  for (const name of JOINTS) joints[name] = rotation();
  return { bodyLift: -0.045, joints,
    feet: { R: { x: -0.39, z: 0.03, height: 0, pitch: 0, contact: 1 }, L: { x: 0.39, z: -0.03, height: 0, pitch: 0, contact: 1 } } };
}
function blend(a: Guide, b: Guide, amount: number): Guide {
  const result = baseGuide();
  result.bodyLift = mix(a.bodyLift, b.bodyLift, amount);
  for (const name of JOINTS) for (const axis of ["x", "y", "z"] as const) result.joints[name][axis] = mix(a.joints[name][axis], b.joints[name][axis], amount);
  for (const side of ["R", "L"] as const) for (const key of ["x", "z", "height", "pitch", "contact"] as const) result.feet[side][key] = mix(a.feet[side][key], b.feet[side][key], amount);
  return result;
}
function key(t: number, points: [number, number][]) {
  for (let i = 1; i < points.length; i++) if (t <= points[i][0]) return mix(points[i - 1][1], points[i][1], between(t, points[i - 1][0], points[i][0]));
  return points[points.length - 1][1];
}
/** Cubic Hermite permits constant-speed stance to meet the swing without a velocity snap. */
function hermite(t: number, a: number, b: number, va: number, vb: number, duration: number) {
  return (2 * t ** 3 - 3 * t ** 2 + 1) * a + (t ** 3 - 2 * t ** 2 + t) * va * duration + (-2 * t ** 3 + 3 * t ** 2) * b + (t ** 3 - t ** 2) * vb * duration;
}

/** C2 path with explicit endpoint velocities: swing flows through the keys rather than stopping. */
function flowing(t: number, a: number, b: number, va: number, vb: number, duration: number) {
  const delta = b - a, ma = va * duration, mb = vb * duration;
  return a + ma * t + (10 * delta - 6 * ma - 4 * mb) * t ** 3 +
    (-15 * delta + 8 * ma + 7 * mb) * t ** 4 + (6 * delta - 3 * ma - 3 * mb) * t ** 5;
}
function sprintFoot(q: number, sign: number): Foot {
  let z: number, height = 0, pitch: number;
  const stanceVelocity = -0.44 / 0.36;
  if (q < 0.36) {
    // A planted sole travels backwards at ground speed, then rolls off the toe.
    z = 0.22 + stanceVelocity * q;
    pitch = key(q, [[0, -0.09], [0.11, 0], [0.24, 0.025], [0.36, 0.26]]);
  } else if (q < 0.56) {
    z = flowing((q - 0.36) / 0.20, -0.22, -0.34, stanceVelocity, 0, 0.20);
    pitch = mix(0.26, 0.32, between(q, 0.36, 0.56));
  } else if (q < 0.86) {
    z = flowing((q - 0.56) / 0.30, -0.34, 0.29, 0, 0.1, 0.30);
    pitch = mix(0.32, -0.09, between(q, 0.56, 0.86));
  } else {
    z = flowing((q - 0.86) / 0.14, 0.29, 0.22, 0.1, stanceVelocity, 0.14);
    pitch = -0.09;
  }
  if (q >= 0.36) height = q < 0.64 ? 0.18 * between(q, 0.36, 0.64) : 0.18 * (1 - between(q, 0.64, 1));
  const contact = q < 0.36 ? 1 - between(q, 0.30, 0.36) : between(q, 0.96, 1);
  return { x: sign * 0.39, z, height, pitch, contact };
}
function sprintGuide(time: number): Guide {
  const guide = baseGuide();
  const q = periodic(time / RUN_CYCLE_SECONDS, 1);
  const phase = q * TAU;
  // One soft compression per landing. The torso/head lag the pelvis instead of bobbing in unison.
  guide.bodyLift = -0.068 - 0.024 * Math.sin(phase * 2);
  guide.feet.R = sprintFoot(q, -1); guide.feet.L = sprintFoot(periodic(q + 0.5, 1), 1);
  guide.joints.Body_Pivot = rotation(0.018, 0.035 * Math.cos(phase), 0.016 * Math.cos(phase - 0.12));
  guide.joints.Torso_Pivot = rotation(0.16 + 0.012 * Math.sin(phase * 2 - 0.35), -0.055 * Math.cos(phase - 0.22), -0.024 * Math.cos(phase - 0.28));
  guide.joints.Head_Pivot = rotation(-0.012 + 0.008 * Math.sin(phase * 2 - 0.65), 0.008 * Math.cos(phase - 0.5), 0.006 * Math.cos(phase - 0.4));
  for (const [side, sign, shift] of [["R", -1, 0], ["L", 1, Math.PI]] as const) {
    const armPhase = phase + shift - 0.18;
    const drive = -Math.cos(armPhase + 0.14 * Math.sin(armPhase));
    // Fists follow a compact arc; shoulder, elbow and wrist solve distinct parts of that path.
    aimHand(guide, side, [sign * (0.755 + 0.025 * drive), 1.48 + 0.075 * drive + 0.018 * Math.sin(armPhase - 0.35), 0.18 + 0.28 * drive],
      0.035 + 0.06 * Math.sin(armPhase - 0.4), [sign * 0.18, -0.55, -0.9]);
  }
  guide.joints.Cape_Pivot = rotation(0.18 + 0.025 * Math.sin(phase * 2 - 0.8), 0.025 * Math.cos(phase - 0.65), 0.028 * Math.cos(phase - 0.8));
  return guide;
}
function readyGuide(): Guide {
  const guide = baseGuide();
  guide.joints.Torso_Pivot = rotation(0.04);
  guide.joints.Head_Pivot = rotation(0.005);
  guide.joints.Arm_R_Pivot = rotation(-0.06, 0, -0.04); guide.joints.Arm_L_Pivot = rotation(-0.06, 0, 0.04);
  guide.joints.Elbow_R_Pivot = rotation(0.06); guide.joints.Elbow_L_Pivot = rotation(0.06);
  guide.joints.Cape_Pivot = rotation(0.025);
  return guide;
}
function gatherGuide(): Guide {
  const guide = readyGuide(); guide.bodyLift = -0.18;
  guide.joints.Torso_Pivot.x = 0.25; guide.joints.Head_Pivot.x = 0.025;
  guide.joints.Arm_R_Pivot.x = 0.5; guide.joints.Arm_L_Pivot.x = 0.42;
  guide.joints.Elbow_R_Pivot.x = -0.4; guide.joints.Elbow_L_Pivot.x = -0.4;
  guide.joints.Cape_Pivot.x = 0.12;
  return guide;
}
function launchGuide(): Guide {
  const guide = readyGuide(); guide.bodyLift = 0.02;
  guide.feet.R.pitch = 0.24; guide.feet.L.pitch = 0.24;
  guide.feet.R.z = -0.12; guide.feet.L.z = -0.12;
  guide.joints.Torso_Pivot.x = 0.15; guide.joints.Head_Pivot.x = -0.015;
  guide.joints.Arm_R_Pivot.x = -0.8; guide.joints.Arm_L_Pivot.x = -0.7;
  guide.joints.Elbow_R_Pivot.x = -0.22; guide.joints.Elbow_L_Pivot.x = -0.22;
  guide.joints.Cape_Pivot.x = 0.32;
  return guide;
}
function tuckGuide(): Guide {
  const guide = launchGuide(); guide.bodyLift = -0.06;
  guide.feet.R = { x: -0.39, z: 0.34, height: 0.44, pitch: -0.06, contact: 0 };
  guide.feet.L = { x: 0.39, z: -0.2, height: 0.62, pitch: 0.42, contact: 0 };
  guide.joints.Torso_Pivot = rotation(0.24, -0.12, -0.08);
  guide.joints.Head_Pivot = rotation(0.035, 0.012, 0.008);
  guide.joints.Arm_R_Pivot = rotation(-1.15, -0.1, -0.15); guide.joints.Arm_L_Pivot = rotation(-0.3, 0.1, 0.2);
  guide.joints.Elbow_R_Pivot.x = -0.5; guide.joints.Elbow_L_Pivot.x = -0.8;
  guide.joints.Cape_Pivot = rotation(0.48, 0.05, -0.12);
  return guide;
}
function landGuide(): Guide {
  const guide = readyGuide(); guide.bodyLift = -0.1;
  guide.feet.R.z = 0.12; guide.feet.L.z = -0.12;
  guide.joints.Torso_Pivot = rotation(0.23, 0.06, 0.025);
  guide.joints.Head_Pivot = rotation(0.025);
  guide.joints.Arm_R_Pivot.x = -0.4; guide.joints.Arm_L_Pivot.x = -0.25;
  guide.joints.Elbow_R_Pivot.x = -0.25; guide.joints.Elbow_L_Pivot.x = -0.25;
  guide.joints.Cape_Pivot.x = 0.28;
  return guide;
}
function typingGuide(time: number): Guide {
  const guide = readyGuide(); guide.joints.Torso_Pivot = rotation(0.105, 0, 0);
  const row = key(time, [[5.9, 0], [6.6, 0.06], [7.15, -0.025], [7.8, 0.04], [8.45, 0], [8.8, 0]]);
  guide.joints.Head_Pivot = rotation(0.16, row * 0.6, 0);
  for (const [side, sign, offset] of [["R", -1, 0], ["L", 1, 0.105]] as const) {
    // Fast downstroke, brief contact, slower recovery. Alternate hands over four key positions.
    const cycle = periodic(time - 5.9 + offset, 0.28) / 0.28;
    const tap = cycle < 0.18 ? 1 - between(cycle, 0, 0.18) : between(cycle, 0.34, 1);
    // Smooth the keyboard-row travel independently of the striking finger/wrist.
    aimHand(guide, side, [sign * 0.4 + row * sign, 1.54 + tap * 0.026, 0.70 + row], -0.02 + tap * 0.035);
  }
  return guide;
}
function enterGuide(): Guide {
  const guide = typingGuide(8.8);
  guide.joints.Head_Pivot = rotation(0.13, -0.025, 0);
  aimHand(guide, "R", [-0.52, 1.54, 0.73], 0.04);
  return guide;
}
function workflowGuide(time: number): Guide {
  const guide = readyGuide(); guide.joints.Torso_Pivot = rotation(0.07, -0.035, 0);
  const reach = between(time, 10.3, 10.8);
  const drag = between(time, 11.2, 12.3);
  const release = between(time, 12.3, 12.6);
  const retract = between(time, 12.6, 13.1);
  const press = window(time, 13.1, 13.32, 13.48, 13.72);
  let right: V = [mix(-0.76, -0.68, reach), mix(1.47, 1.53, reach), mix(0.52, 0.76, reach)];
  right = [mix(right[0], -0.35, drag), mix(right[1], 1.72, drag), mix(right[2], 0.82, drag)];
  right = [mix(right[0], -0.5, release * 0.45), mix(right[1], 1.64, release * 0.45), mix(right[2], 0.68, release * 0.45)];
  right = [mix(right[0], -0.56, retract), mix(right[1], 1.53, retract), mix(right[2], 0.63, retract)];
  right = [mix(right[0], -0.40, press), mix(right[1], 1.59, press), mix(right[2], 0.82, press)];
  aimHand(guide, "R", right, mix(0, 0.08, drag));
  aimHand(guide, "L", [0.68, 1.53, 0.70 + reach * 0.06], 0.02);
  guide.joints.Head_Pivot = rotation(0.07 - drag * 0.025, -0.10 + drag * 0.10, 0.006 * drag);
  return guide;
}
function acknowledgeGuide(time: number): Guide {
  const guide = readyGuide();
  const nod = window(time, 14.1, 14.28, 14.38, 14.68);
  guide.joints.Torso_Pivot = rotation(0.02, 0.025, 0);
  guide.joints.Head_Pivot = rotation(0.005 + nod * 0.075, 0.025, -0.008);
  // A small crown-height salute, followed by a settled, confident hold.
  aimHand(guide, "R", [-0.69, 1.91, 0.52], -0.25);
  guide.joints.Elbow_L_Pivot = rotation(-0.18);
  guide.joints.Cape_Pivot = rotation(0.04, 0, -0.035);
  return guide;
}

/** A full-speed reusable stride, with a rolling support foot and separate swing recovery. */
export function getRobotRunPose(time: number) {
  const guide = sprintGuide(time); solveFeet(guide); stabilizeHead(guide);
  return { phase: periodic(time / RUN_CYCLE_SECONDS, 1) * TAU, bodyLift: guide.bodyLift, joints: guide.joints };
}

function rootAt(t: number) {
  const forward = between(t, 0, 3.55), recenter = between(t, 13.9, 15.2);
  const toWork = between(t, 4.7, 5.35), toRun = between(t, 15.2, 17.5);
  return { x: mix(mix(0.12, -0.20, forward), 0.12, recenter), y: 0,
    z: mix(mix(-0.20, 0.27, forward), -0.20, recenter),
    yaw: mix(mix(-0.55, -0.08, toWork), -0.55, toRun) };
}
/**
 * A continuous character performance, not a slideshow of repeating joint oscillations.
 * Contact/swing targets are blended before IK, so knees absorb weight without feet penetrating.
 * Running is on an implied moving ground; stopped task feet are held in model-root space.
 */
export function getRobotActionPose(time: number): RobotActionPose {
  const t = periodic(time, ACTION_CYCLE_SECONDS);
  const run = sprintGuide(t), ready = readyGuide(), gather = gatherGuide(), launch = launchGuide(), land = landGuide();
  let guide = run, action: RobotAction = "run", progress = t / 3.2, speed = 1, rise = 0;
  if (t >= 3.2 && t < 3.43) {
    const u = between(t, 3.2, 3.43); guide = blend(run, gather, u); speed = 1 - u; action = "jump"; progress = 0;
  } else if (t >= 3.43 && t < 3.55) {
    const u = (t - 3.43) / 0.12; guide = blend(gather, launch, settle(u));
    rise = hermite(u, 0, 0.12, 0, 2.8, 0.12); speed = 0; action = "jump"; progress = 0.1 * u;
  } else if (t >= 3.55 && t < 4.43) {
    const u = (t - 3.55) / 0.88;
    const tuck = window(u, 0, 0.34, 0.58, 1);
    guide = blend(launch, tuckGuide(), tuck);
    const extend = between(u, 0.7, 1); guide = blend(guide, land, extend);
    rise = 0.12 + 2.8 * (t - 3.55) - (2.8 / 0.88) * (t - 3.55) ** 2;
    speed = 0; action = "jump"; progress = 0.1 + 0.8 * u;
  } else if (t >= 4.43 && t < 4.55) {
    const u = (t - 4.43) / 0.12; guide = land;
    rise = hermite(u, 0.12, 0, -2.8, 0, 0.12); speed = 0; action = "jump"; progress = 0.9 + 0.1 * u;
  } else if (t >= 4.55 && t < 4.95) {
    const absorb = gatherGuide(); absorb.bodyLift = -0.21; absorb.joints.Torso_Pivot.x = 0.34;
    guide = t < 4.7 ? blend(land, absorb, between(t, 4.55, 4.7)) : blend(absorb, land, between(t, 4.7, 4.95));
    speed = 0; action = "jump"; progress = 1;
  } else if (t >= 4.95 && t < 5.35) {
    guide = blend(land, ready, between(t, 4.95, 5.35));
    guide.joints.Torso_Pivot.z += 0.10 * window(t, 4.95, 5.06, 5.15, 5.35);
    speed = 0; action = "code"; progress = 0;
  } else if (t >= 5.35 && t < 5.9) {
    guide = blend(ready, typingGuide(t), between(t, 5.35, 5.9)); speed = 0; action = "code"; progress = 0;
  } else if (t >= 5.9 && t < 8.8) {
    guide = typingGuide(t); speed = 0; action = "code"; progress = (t - 5.9) / 3.35;
  } else if (t >= 8.8 && t < 9.25) {
    guide = blend(typingGuide(t), enterGuide(), between(t, 8.8, 9.02));
    guide.joints.Wrist_R_Pivot.x += 0.10 * window(t, 9.02, 9.08, 9.12, 9.25);
    speed = 0; action = "code"; progress = (t - 5.9) / 3.35;
  } else if (t >= 9.25 && t < 9.7) {
    guide = blend(enterGuide(), ready, between(t, 9.25, 9.7)); speed = 0; action = "code"; progress = 1;
  } else if (t >= 9.7 && t < 10.3) {
    guide = blend(ready, workflowGuide(t), between(t, 9.7, 10.3)); speed = 0; action = "automate"; progress = 0;
  } else if (t >= 10.3 && t < 13.9) {
    guide = workflowGuide(t); speed = 0; action = "automate"; progress = (t - 10.3) / 3.6;
  } else if (t >= 13.9 && t < 15.2) {
    guide = blend(workflowGuide(t), acknowledgeGuide(t), between(t, 13.9, 14.25));
    speed = 0; action = "celebrate"; progress = (t - 13.9) / 1.3;
  } else if (t >= 15.2 && t < 16) {
    guide = blend(acknowledgeGuide(t), gather, between(t, 15.2, 16)); speed = 0; progress = 0;
  } else if (t >= 16 && t < 16.6) {
    guide = blend(gather, run, between(t, 16, 16.6)); speed = between(t, 16, 16.6) * 0.6; progress = 0;
  } else if (t >= 16.6 && t < 17.5) {
    guide = run; speed = mix(0.6, 1, between(t, 16.6, 17.5)); progress = (t - 16.6) / 0.9;
    guide.joints.Torso_Pivot.x += 0.10 * window(t, 16.6, 16.82, 17.05, 17.5);
  } else if (t >= 17.5) { progress = (t - 17.5) / (ACTION_CYCLE_SECONDS - 17.5); }
  solveFeet(guide); stabilizeHead(guide);
  const root = rootAt(t); root.y = Math.max(0, rise);
  const blink = Math.max(window(t, 1.28, 1.34, 1.38, 1.46), window(t, 5.08, 5.14, 5.17, 5.24), window(t, 9.40, 9.46, 9.49, 9.57), window(t, 14.78, 14.84, 14.87, 14.95), window(t, 18.46, 18.52, 18.56, 18.64));
  const success = window(t, 14.03, 14.25, 14.8, 15.25);
  const surprise = window(t, 3.35, 3.65, 4.25, 4.75);
  const pleasure = window(t, 14.0, 14.25, 15.1, 15.6);
  return {
    phase: periodic(t / RUN_CYCLE_SECONDS, 1) * TAU, action, actionProgress: clamp(progress),
    bodyLift: guide.bodyLift, joints: guide.joints, root, squash: 1,
    props: {
      laptop: window(t, 5.05, 5.6, 9.35, 9.7), laptopLid: window(t, 5.3, 5.85, 9.25, 9.62),
      codeProgress: between(t, 5.9, 9.12) * (1 - between(t, 9.75, 10.1)),
      automation: window(t, 9.7, 10.2, 14.25, 14.65), automationAssemble: between(t, 9.8, 10.65) * (1 - between(t, 14.65, 15)),
      automationDrag: between(t, 11.2, 12.3) * (1 - between(t, 14.65, 15)),
      automationPress: window(t, 13.1, 13.32, 13.48, 13.72),
      automationProgress: between(t, 13.35, 14.03) * (1 - between(t, 14.65, 15)),
    },
    trail: { speed, spread: 1 + rise * 0.65 },
    eyes: { blink, focus: 1 - Math.max(surprise, pleasure), surprise, pleasure,
      lookX: -0.12 * window(t, 10.3, 10.8, 11.2, 12.3),
      lookY: -0.18 * window(t, 5.5, 5.9, 9.1, 9.7) + 0.06 * window(t, 3.43, 3.8, 4.15, 4.55),
      expression: action === "jump" ? "surprised" : action === "celebrate" ? "pleased" : "focused" },
    effects: { speed, impact: window(t, 4.55, 4.62, 4.7, 4.95), success, turn: 0,
      codeTyped: between(t, 5.9, 9.12) * (1 - between(t, 9.75, 10.1)) },
    footContacts: { right: guide.feet.R.contact, left: guide.feet.L.contact },
  };
}
