import assert from "node:assert/strict";
const { ACTION_CYCLE_SECONDS, ACTION_BOUNDARIES, getRobotActionPose, RUN_CYCLE_SECONDS } = await import(
  new URL("../app/codex-landing/robot-run-cycle.ts", import.meta.url).href
) as typeof import("../app/codex-landing/robot-run-cycle");
const values = (time: number): number[] => {
  const p = getRobotActionPose(time);
  const { expression: _, ...eyes } = p.eyes; void _;
  return [p.bodyLift, ...Object.values(p.root), p.squash, ...Object.values(p.props), ...Object.values(p.trail),
    ...Object.values(eyes), ...Object.values(p.effects), ...Object.values(p.footContacts),
    ...Object.values(p.joints).flatMap((joint) => Object.values(joint))];
};
const difference = (a: number[], b: number[]) => Math.max(...a.map((v, i) => Math.abs(v - b[i])));
const epsilon = 0.000001;
let maximumBoundaryGap = 0, maximumVelocityGap = 0, worstBoundary = 0;
for (const time of ACTION_BOUNDARIES) {
  const before = values(time - epsilon), at = values(time), after = values(time + epsilon);
  const gap = difference(before, after);
  if (gap > maximumBoundaryGap) { maximumBoundaryGap = gap; worstBoundary = time; }
  maximumVelocityGap = Math.max(maximumVelocityGap, difference(at.map((v, i) => (v - before[i]) / epsilon), after.map((v, i) => (v - at[i]) / epsilon)));
}
assert(maximumBoundaryGap < 0.001, `Pose discontinuity at${worstBoundary}: ${maximumBoundaryGap}`);
assert(maximumVelocityGap < 0.1, `Velocity discontinuity: ${maximumVelocityGap}`);
const stridesPerStory = ACTION_CYCLE_SECONDS / RUN_CYCLE_SECONDS;
assert(Math.abs(stridesPerStory - Math.round(stridesPerStory)) < 1e-9, "Story must close on a complete stride");
let minimumForwardVelocity = Infinity, maximumJump = 0;
for (let sample = 0; sample <= 2016; sample++) {
  const time = sample / 100, p = getRobotActionPose(time);
  assert(values(time).every(Number.isFinite), `Non-finite transform at ${time}`);
  assert(difference(values(time), values(time + ACTION_CYCLE_SECONDS)) < 1e-7, `Non-periodic pose at ${time}`);
  assert(Math.abs(p.root.x) <= 0.45 && Math.abs(p.root.z) <= 0.4, "Stage travel escaped envelope");
  assert(p.root.y >= 0 && p.squash === 1, "Contact rig cannot stretch or move through floor");
  for (const value of [...Object.values(p.effects), ...Object.values(p.props)]) assert(value >= -1e-10 && value <= 1 + 1e-10, "Effect weight outside0–1");
  if (p.action === "run" && p.trail.speed >= 0.9999) {
    const a = getRobotActionPose(time - epsilon).root, b = getRobotActionPose(time + epsilon).root;
    const forward = ((b.x - a.x) * Math.sin(p.root.yaw) + (b.z - a.z) * Math.cos(p.root.yaw)) / (2 * epsilon);
    minimumForwardVelocity = Math.min(minimumForwardVelocity, forward);
    assert(forward >= -1e-6, `Stage travel is backwards during sprint at ${time}s`);
  }
  maximumJump = Math.max(maximumJump, p.root.y);
}
assert.equal(getRobotActionPose(4.54).effects.impact, 0, "Impact cue cannot precede landing contact");
assert(getRobotActionPose(4.55).effects.impact < 1e-12);
assert(getRobotActionPose(4.63).effects.impact > 0.99);
assert.equal(getRobotActionPose(4.95).effects.impact, 0);
assert.equal(getRobotActionPose(5.7).props.codeProgress, 0, "Code cannot appear before the laptop opens");
assert(getRobotActionPose(5.7).props.laptopLid < 1);
assert.equal(getRobotActionPose(13.3).props.automationProgress, 0, "Packets cannot flow before activation press");
assert.equal(getRobotActionPose(14.03).props.automationProgress, 1, "Workflow must finish before success");
assert.equal(getRobotActionPose(14).effects.success, 0, "Success cannot precede completed workflow");
assert(maximumJump > 0.73, "Jump must have a substantial ballistic flight arc");
console.log(JSON.stringify({ samples: 2017, duration: ACTION_CYCLE_SECONDS, stride: RUN_CYCLE_SECONDS,
  maximumBoundaryGap, maximumVelocityGap, maximumJump, minimumForwardVelocity, result: "pass" }, null, 2));

// Geometry-only glTF loading checks the same named controls and exact authored units as the renderer.
const { readFile } = await import("node:fs/promises");
const { Group, Mesh, Vector3, Quaternion, Euler } = await import("three");
const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
const glb = await readFile(new URL("../public/models/kohelet-robot-king.glb", import.meta.url));
const oldLength = glb.readUInt32LE(12), document = JSON.parse(glb.subarray(20, 20 + oldLength).toString("utf8"));
document.materials = document.materials.map(() => ({})); document.images = []; document.textures = [];
const json = Buffer.from(JSON.stringify(document)), pad = (4 - json.length % 4) % 4;
const chunk = Buffer.alloc(8 + json.length + pad, 0x20); chunk.writeUInt32LE(json.length + pad, 0); chunk.writeUInt32LE(0x4e4f534a, 4); json.copy(chunk, 8);
const binary = glb.subarray(20 + oldLength), header = Buffer.from(glb.subarray(0, 12)); header.writeUInt32LE(12 + chunk.length + binary.length, 8);
const geometryGlb = Buffer.concat([header, chunk, binary]);
const gltf = await new GLTFLoader().parseAsync(Uint8Array.from(geometryGlb).buffer, "");
const actionRoot = new Group(); actionRoot.add(gltf.scene);
const rests = Object.keys(getRobotActionPose(0).joints).map((name) => {
  const object = gltf.scene.getObjectByName(name); assert(object, `Missing exported joint ${name}`);
  return { name: name as keyof ReturnType<typeof getRobotActionPose>["joints"], object, rotation: object.rotation.clone(), position: object.position.clone() };
});
const boots: { side: "right" | "left"; meshes: InstanceType<typeof Mesh>[] }[] = [];
for (const [name, side] of [["Boot_R_Pivot", "right"], ["Boot_L_Pivot", "left"]] as const) {
  const meshes: InstanceType<typeof Mesh>[] = [];
  gltf.scene.getObjectByName(name)?.traverse((o) => { if (o instanceof Mesh) meshes.push(o); });
  assert(meshes.length > 0); boots.push({ side, meshes });
}
function apply(time: number) {
  const p = getRobotActionPose(time); actionRoot.position.set(p.root.x, p.root.y, p.root.z); actionRoot.rotation.y = p.root.yaw;
  for (const { name, object, rotation, position } of rests) {
    const offset = p.joints[name]; object.rotation.set(rotation.x + offset.x, rotation.y + offset.y, rotation.z + offset.z); object.position.copy(position);
    if (name === "Body_Pivot") { object.position.y += p.bodyLift; object.scale.setScalar(1); }
  }
  actionRoot.updateMatrixWorld(true); return p;
}
let minimumClearance = Infinity, minimumFootY = Infinity, worstTime = 0, maximumContactError = 0, worstContactTime = 0;
const point = new Vector3();
for (let sample = 0; sample <= 2016; sample++) {
  const time = sample / 100, p = apply(time);
  for (const boot of boots) {
    let lowest = Infinity;
    for (const mesh of boot.meshes) {
      const a = mesh.geometry.getAttribute("position");
      for (let index = 0; index < a.count; index++) { point.fromBufferAttribute(a, index).applyMatrix4(mesh.matrixWorld); lowest = Math.min(lowest, point.y); }
    }
    if (lowest < minimumFootY) { minimumFootY = lowest; worstTime = time; }
    minimumClearance = Math.min(minimumClearance, lowest + 0.025);
    if (p.footContacts[boot.side] > 0.9999 && p.root.y === 0 && Math.abs(lowest + 0.023) > maximumContactError) { maximumContactError = Math.abs(lowest + 0.023); worstContactTime = time; }
  }
}
assert(minimumClearance >= -1e-6, `Boot clips floor at ${worstTime}s by ${-minimumClearance}`);
assert(maximumContactError < 0.006, `Support foot floats ${maximumContactError} from the intended contact plane`);
// Both task ankles must remain fixed relative to their root while hands articulate.
for (const [start, end] of [[5.9, 8.8], [10.3, 13.9]]) {
  apply(start); const initial = boots.map(({ meshes }) => actionRoot.worldToLocal(meshes[0].getWorldPosition(new Vector3())).clone());
  for (let t = start; t < end; t += 0.07) {
    apply(t); boots.forEach(({ meshes }, index) => { const position = actionRoot.worldToLocal(meshes[0].getWorldPosition(new Vector3())); assert(position.distanceTo(initial[index]) < 1e-5, `Task foot slides at ${t}`); });
  }
}
console.log(JSON.stringify({ rigSamples: 2017, minimumClearance, minimumFootY, worstTime, maximumContactError, worstContactTime, result: "pass" }, null, 2));

// The new articulated wrists put real geometry at the intended grab/drag coordinates.
for (const [time, expected] of [[10.95, [-0.68, 1.53, 0.76]], [12.3, [-0.35, 1.72, 0.82]]] as [number, [number, number, number]][]) {
  apply(time); const wrist = gltf.scene.getObjectByName("Wrist_R_Pivot"); assert(wrist);
  const fist = actionRoot.worldToLocal(wrist.localToWorld(new Vector3(0, 0, 0.12)));
  assert(fist.distanceTo(new Vector3(...expected)) < 0.003, `Hand misses workflow target at ${time}s: ${fist.toArray()}`);
}
for (const side of ["R", "L"] as const) {
  const elbows = [6.05, 6.14, 6.23, 6.32].map((t) => getRobotActionPose(t).joints[`Elbow_${side}_Pivot`].x);
  const wrists = [6.05, 6.14, 6.23, 6.32].map((t) => getRobotActionPose(t).joints[`Wrist_${side}_Pivot`].x);
  assert(Math.max(...elbows) - Math.min(...elbows) > 0.01, "Typing must articulate the elbow");
  assert(Math.max(...wrists) - Math.min(...wrists) > 0.01, "Typing must articulate the wrist");
}
console.log(JSON.stringify({ workflowHandTargets: "pass", independentTypingJoints: "pass", pressBeforePackets: "pass" }));

// Compare physical orientations, not Euler representations that can wrap at +/-pi.
const previous = new Map<string, InstanceType<typeof Quaternion>>();
let maximumAngularStep = 0;
for (let time = 0; time <= ACTION_CYCLE_SECONDS; time += 1 / 240) {
  for (const [name, value] of Object.entries(getRobotActionPose(time).joints)) {
    const orientation = new Quaternion().setFromEuler(new Euler(value.x, value.y, value.z));
    const before = previous.get(name);
    if (before) maximumAngularStep = Math.max(maximumAngularStep, before.angleTo(orientation));
    previous.set(name, orientation);
  }
}
assert(maximumAngularStep < 0.18, `Joint snaps during the story: ${maximumAngularStep}radians per1/240s`);
console.log(JSON.stringify({ denseQuaternionSamples: 4839, maximumAngularStep, result: "pass" }));
