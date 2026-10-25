import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { Euler, Group, Matrix4, Quaternion, Vector3 } from "three";

const { ACTION_BOUNDARIES, ACTION_CYCLE_SECONDS, RUN_CYCLE_SECONDS, getRobotActionPose, getRobotRunPose } = await import(
  new URL("../app/codex-landing/robot-run-cycle.ts", import.meta.url).href
) as typeof import("../app/codex-landing/robot-run-cycle");

// Read the actual exported hierarchy. This catches gaze errors hidden by checking authored offsets alone.
const binary = await readFile(new URL("../public/models/kohelet-robot-king.glb", import.meta.url));
type Node = { name: string; children?: number[]; translation?: number[]; rotation?: number[]; scale?: number[]; matrix?: number[] };
const gltf = JSON.parse(binary.subarray(20, 20 + binary.readUInt32LE(12)).toString("utf8")) as {
  nodes: Node[]; scenes: { nodes: number[] }[]; scene?: number;
};
const objects = gltf.nodes.map((node) => {
  const object = new Group(); object.name = node.name;
  if (node.translation) object.position.fromArray(node.translation);
  if (node.rotation) object.quaternion.fromArray(node.rotation);
  if (node.scale) object.scale.fromArray(node.scale);
  if (node.matrix) new Matrix4().fromArray(node.matrix).decompose(object.position, object.quaternion, object.scale);
  return object;
});
gltf.nodes.forEach((node, index) => node.children?.forEach((child) => objects[index].add(objects[child])));
const root = new Group();
gltf.scenes[gltf.scene ?? 0].nodes.forEach((index) => root.add(objects[index]));
const find = (name: string) => { const object = root.getObjectByName(name); assert(object, `Missing rig control ${name}`); return object; };
const head = find("Head_Pivot"), body = find("Body_Pivot");
assert(head.quaternion.angleTo(new Quaternion(-0.04102100431919098, -0.06431831419467926, 0.10215108841657639, 0.991839587688446)) < 1e-6,
  "The GLB head rest pose changed; update the hierarchy-aware gaze compensation");
assert(body.quaternion.angleTo(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 60)) < 1e-6,
  "The GLB body heading changed; update its IK and gaze rest transform");
const rests = Object.keys(getRobotActionPose(0).joints).map((name) => {
  const object = find(name);
  return { name: name as keyof ReturnType<typeof getRobotActionPose>["joints"], object, rotation: object.rotation.clone(), position: object.position.clone() };
});
function apply(time: number) {
  const pose = getRobotActionPose(time);
  root.position.set(pose.root.x, pose.root.y, pose.root.z); root.rotation.y = pose.root.yaw;
  for (const { name, object, rotation, position } of rests) {
    const joint = pose.joints[name]; object.rotation.set(rotation.x + joint.x, rotation.y + joint.y, rotation.z + joint.z);
    object.position.copy(position); if (name === "Body_Pivot") object.position.y += pose.bodyLift;
  }
  root.updateMatrixWorld(true); return pose;
}
const localPosition = (name: string) => root.worldToLocal(find(name).getWorldPosition(new Vector3()));

let maximumRunGazeAngle = 0, maximumRunHeadRoll = 0, minimumTaskDownwardGaze = Infinity;
const ankleZ: number[] = [], handZ: number[] = [], stanceSpeeds: number[] = [];
let stanceSamples = 0, maximumRecoveryKnee = 0, maximumStanceKnee = 0;
for (let index = 0; index < 240; index++) {
  const time = index / 240 * RUN_CYCLE_SECONDS, pose = apply(time);
  const forward = new Vector3(0, 0, 1).applyQuaternion(head.getWorldQuaternion(new Quaternion()));
  const heading = new Vector3(Math.sin(pose.root.yaw + Math.PI / 60), 0, Math.cos(pose.root.yaw + Math.PI / 60));
  maximumRunGazeAngle = Math.max(maximumRunGazeAngle, forward.angleTo(heading));
  const headUp = new Vector3(0, 1, 0).applyQuaternion(head.getWorldQuaternion(new Quaternion()));
  maximumRunHeadRoll = Math.max(maximumRunHeadRoll, Math.abs(Math.asin(headUp.x * heading.z - headUp.z * heading.x)));
  assert(Math.abs(pose.root.yaw + 0.55) < 1e-9, "A sprint must not turn away from its travel lane");
  assert(Math.abs(pose.eyes.lookX) < 1e-10, "Running eyes should attend to the path ahead");
  ankleZ.push(localPosition("Boot_R_Pivot").z); handZ.push(localPosition("Wrist_R_Pivot").z);
  if (pose.footContacts.right > 0.99) { stanceSamples++; maximumStanceKnee = Math.max(maximumStanceKnee, pose.joints.Knee_R_Pivot.x); }
  else maximumRecoveryKnee = Math.max(maximumRecoveryKnee, pose.joints.Knee_R_Pivot.x);
  if (index / 240 > 0.04 && index / 240 < 0.24) {
    const dt = 1e-5; apply(time - dt); const before = localPosition("Boot_R_Pivot").z;
    apply(time + dt); stanceSpeeds.push((localPosition("Boot_R_Pivot").z - before) / (2 * dt));
  }
}
assert(maximumRunGazeAngle < Math.PI / 60, `Run gaze wanders ${maximumRunGazeAngle} radians away from its lane`);
assert(maximumRunHeadRoll < Math.PI / 180, "The head should remain level above the counterrotating shoulders");
assert(stanceSamples / 240 > 0.25 && stanceSamples / 240 < 0.4, "Run needs a readable support phase and an airborne recovery");
assert(maximumRecoveryKnee > maximumStanceKnee + 0.35, "Recovery must fold the knee instead of moving a stiff leg");
assert(Math.max(...stanceSpeeds) - Math.min(...stanceSpeeds) < 0.001, "A planted ankle changes ground speed during support");
assert(stanceSpeeds.every((speed) => speed < -0.5), "The support foot must push backwards rather than slide forwards");
const mean = (a: number[]) => a.reduce((sum, value) => sum + value, 0) / a.length;
const az = mean(ankleZ), hz = mean(handZ);
const covariance = ankleZ.reduce((sum, value, index) => sum + (value - az) * (handZ[index] - hz), 0);
const correlation = covariance / Math.sqrt(ankleZ.reduce((sum, value) => sum + (value - az) ** 2, 0) * handZ.reduce((sum, value) => sum + (value - hz) ** 2, 0));
assert(correlation < -0.6, "The arm must oppose its leg rather than swing both forwards together");
for (const time of [6, 7, 8]) {
  apply(time); const forward = new Vector3(0, 0, 1).applyQuaternion(head.getWorldQuaternion(new Quaternion()));
  minimumTaskDownwardGaze = Math.min(minimumTaskDownwardGaze, -forward.y);
}
assert(minimumTaskDownwardGaze > 0.1, "Coding gaze must lower toward the laptop");

// Compare orientations and one-sided velocities across every story / stride key and the wrap.
const restRotations = new Map(rests.map(({ name, rotation }) => [name, rotation]));
function orientation(name: keyof ReturnType<typeof getRobotRunPose>["joints"], value: { x: number; y: number; z: number }) {
  const rest = restRotations.get(name); assert(rest);
  return new Quaternion().setFromEuler(new Euler(rest.x + value.x, rest.y + value.y, rest.z + value.z));
}
function angularVelocity(a: Quaternion, b: Quaternion, dt: number) {
  const delta = a.clone().invert().multiply(b); if (delta.w < 0) delta.set(-delta.x, -delta.y, -delta.z, -delta.w);
  return new Vector3(delta.x, delta.y, delta.z).multiplyScalar(2 / dt);
}
let maximumPoseGap = 0, maximumVelocityGap = 0;
const epsilon = 1e-6;
function checkBoundary(time: number, sample: typeof getRobotRunPose | typeof getRobotActionPose) {
  const a = sample(time - epsilon), b = sample(time), c = sample(time + epsilon);
  for (const name of Object.keys(b.joints) as (keyof typeof b.joints)[]) {
    const qa = orientation(name, a.joints[name]), qb = orientation(name, b.joints[name]), qc = orientation(name, c.joints[name]);
    maximumPoseGap = Math.max(maximumPoseGap, qa.angleTo(qc));
    maximumVelocityGap = Math.max(maximumVelocityGap, angularVelocity(qa, qb, epsilon).distanceTo(angularVelocity(qb, qc, epsilon)));
  }
}
ACTION_BOUNDARIES.forEach((time) => checkBoundary(time, getRobotActionPose));
for (const phase of [0, 0.11, 0.24, 0.30, 0.36, 0.56, 0.64, 0.86, 0.96, 1]) {
  checkBoundary(phase * RUN_CYCLE_SECONDS, getRobotRunPose);
  checkBoundary(((phase + 0.5) % 1) * RUN_CYCLE_SECONDS, getRobotRunPose);
}
assert(maximumPoseGap < 0.0001, `Joint position snaps at a transition: ${maximumPoseGap}`);
assert(maximumVelocityGap < 0.02, `Joint velocity snaps at a transition: ${maximumVelocityGap}`);
assert(Math.abs(ACTION_CYCLE_SECONDS / RUN_CYCLE_SECONDS - Math.round(ACTION_CYCLE_SECONDS / RUN_CYCLE_SECONDS)) < 1e-9,
  "Story wrap must land on the same stride phase");
console.log(JSON.stringify({ strideSeconds: RUN_CYCLE_SECONDS, storySeconds: ACTION_CYCLE_SECONDS,
  maximumRunGazeDegrees: maximumRunGazeAngle * 180 / Math.PI, maximumRunHeadRollDegrees: maximumRunHeadRoll * 180 / Math.PI,
  supportFraction: stanceSamples / 240, supportSpeedVariation: Math.max(...stanceSpeeds) - Math.min(...stanceSpeeds),
  armLegCorrelation: correlation, minimumTaskDownwardGaze, maximumPoseGap, maximumVelocityGap, result: "pass" }, null, 2));
