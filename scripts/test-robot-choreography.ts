import assert from "node:assert/strict";
// Node runs this source directly; a URL import keeps its required .ts extension out of application resolution.
const { ACTION_CYCLE_SECONDS, getRobotActionPose, RUN_CYCLE_SECONDS } = await import(
  new URL("../app/codex-landing/robot-run-cycle.ts", import.meta.url).href
) as typeof import("../app/codex-landing/robot-run-cycle");

// Check numerical properties of the motion itself, rather than implementation structure.
const continuousValues = (time: number): number[] => {
  const pose = getRobotActionPose(time);
  return [pose.bodyLift, ...Object.values(pose.root), pose.squash, ...Object.values(pose.props), ...Object.values(pose.trail),
    ...Object.values(pose.joints).flatMap((joint) => Object.values(joint))];
};
const difference = (a: number[], b: number[]) => Math.max(...a.map((value, index) => Math.abs(value - b[index])));
const times = [0, 2.1, 2.4, 3.3, 3.6, 4.1, 6.6, 7.1, 8.4, 8.9, 11.4, 12, ACTION_CYCLE_SECONDS];
const epsilon = 0.00001;
let maximumBoundaryGap = 0;
let maximumVelocityGap = 0;
for (const time of times) {
  const before = continuousValues(time - epsilon);
  const at = continuousValues(time);
  const after = continuousValues(time + epsilon);
  maximumBoundaryGap = Math.max(maximumBoundaryGap, difference(before, after));
  const velocityBefore = at.map((value, index) => (value - before[index]) / epsilon);
  const velocityAfter = after.map((value, index) => (value - at[index]) / epsilon);
  maximumVelocityGap = Math.max(maximumVelocityGap, difference(velocityBefore, velocityAfter));
}
assert(maximumBoundaryGap < 0.001, `Pose discontinuity: ${maximumBoundaryGap}`);
assert(maximumVelocityGap < 0.05, `Velocity discontinuity: ${maximumVelocityGap}`);
assert.equal(ACTION_CYCLE_SECONDS / RUN_CYCLE_SECONDS, 24, "Loop must contain a whole number of strides");
let maximumJump = 0;
let minimumForwardVelocity = Infinity;
for (let sample = 0; sample <= 1440; sample++) {
  const time = sample * ACTION_CYCLE_SECONDS / 1440;
  const pose = getRobotActionPose(time);
  assert(continuousValues(time).every(Number.isFinite), `Non-finite transform at ${time}`);
  assert(difference(continuousValues(time), continuousValues(time + ACTION_CYCLE_SECONDS)) < 1e-10, `Non-periodic pose at ${time}`);
  assert(pose.root.y >= 0, "Jump cannot move through the floor");
  assert(Math.abs(pose.root.x) <= 0.21 && Math.abs(pose.root.z) <= 0.33, "Stage travel escaped its envelope");
  assert(pose.joints.Knee_L_Pivot.x >= 0 && pose.joints.Knee_R_Pivot.x >= 0, "Knee folded backwards");
  maximumJump = Math.max(maximumJump, pose.root.y);
  if (pose.action === "run" && pose.trail.speed >= 0.99999) {
    const delta = 0.0001;
    const before = getRobotActionPose(time - delta).root;
    const after = getRobotActionPose(time + delta).root;
    const velocityX = (after.x - before.x) / (delta * 2);
    const velocityZ = (after.z - before.z) / (delta * 2);
    const forwardVelocity = velocityX * Math.sin(pose.root.yaw) + velocityZ * Math.cos(pose.root.yaw);
    minimumForwardVelocity = Math.min(minimumForwardVelocity, forwardVelocity);
    assert(forwardVelocity >= -1e-8, `Running backwards at ${time}s: ${forwardVelocity}`);
  }
}
assert(maximumJump > 0.66, "The jump should be visibly airborne");
for (const time of [4.2, 5.2, 6.2, 9, 10, 11]) {
  const pose = getRobotActionPose(time);
  assert.equal(pose.trail.speed, 0, "Stopped work needs a still trail");
  assert.equal(pose.joints.Leg_R_Pivot.x, -0.05, "Right foot must stay planted during work");
  assert.equal(pose.joints.Leg_L_Pivot.x, -0.05, "Left foot must stay planted during work");
}
assert.equal(getRobotActionPose(5).props.laptop, 1);
assert.equal(getRobotActionPose(10).props.automation, 1);
assert.equal(getRobotActionPose(0).props.laptop, 0);
assert.equal(getRobotActionPose(0).props.automation, 0);
console.log(JSON.stringify({ samples: 1441, duration: ACTION_CYCLE_SECONDS, stride: RUN_CYCLE_SECONDS,
  maximumBoundaryGap, maximumVelocityGap, maximumJump, minimumForwardVelocity, result: "pass" }, null, 2));

// Check the actual exported boots against the real contact plane. Removing materials
// lets Node load glTF geometry without emulating a browser's image decoder.
const { readFile } = await import("node:fs/promises");
const { Box3, Group, Mesh, Vector3 } = await import("three");
const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
const glb = await readFile(new URL("../public/models/kohelet-robot-king.glb", import.meta.url));
const originalJsonLength = glb.readUInt32LE(12);
const document = JSON.parse(glb.subarray(20, 20 + originalJsonLength).toString("utf8"));
document.materials = document.materials.map(() => ({ pbrMetallicRoughness: { metallicFactor: 0, roughnessFactor: 1 } }));
document.images = [];
document.textures = [];
const json = Buffer.from(JSON.stringify(document));
const jsonPadding = (4 - json.length % 4) % 4;
const jsonChunk = Buffer.alloc(8 + json.length + jsonPadding, 0x20);
jsonChunk.writeUInt32LE(json.length + jsonPadding, 0);
jsonChunk.writeUInt32LE(0x4e4f534a, 4);
json.copy(jsonChunk, 8);
const binaryChunk = glb.subarray(20 + originalJsonLength);
const header = Buffer.from(glb.subarray(0, 12));
header.writeUInt32LE(12 + jsonChunk.length + binaryChunk.length, 8);
const geometryGlb = Buffer.concat([header, jsonChunk, binaryChunk]);
const gltf = await new GLTFLoader().parseAsync(Uint8Array.from(geometryGlb).buffer, "");
const modelHeight = new Box3().setFromObject(gltf.scene).getSize(new Vector3()).y;
const scale = modelHeight / 4.4;
const actionRoot = new Group();
actionRoot.add(gltf.scene);
const jointRests = Object.keys(getRobotActionPose(0).joints).map((name) => {
  const object = gltf.scene.getObjectByName(name);
  assert(object, `Missing exported joint ${name}`);
  return { name: name as keyof ReturnType<typeof getRobotActionPose>["joints"], object,
    rotation: object.rotation.clone(), position: object.position.clone() };
});
const boots: InstanceType<typeof Mesh>[] = [];
for (const name of ["Boot_R_Pivot", "Boot_L_Pivot"]) {
  gltf.scene.getObjectByName(name)?.traverse((object) => { if (object instanceof Mesh) boots.push(object); });
}
assert(boots.length >= 2, "No exported boot geometry found");
let minimumFootY = Infinity;
let minimumClearance = Infinity;
let lowestTime = 0;
const vertex = new Vector3();
for (let sample = 0; sample <= 720; sample++) {
  const time = sample * ACTION_CYCLE_SECONDS / 720;
  const pose = getRobotActionPose(time);
  actionRoot.position.set(pose.root.x * scale, pose.root.y * scale, pose.root.z * scale);
  actionRoot.rotation.y = pose.root.yaw;
  for (const { name, object, rotation, position } of jointRests) {
    const offset = pose.joints[name];
    object.rotation.set(rotation.x + offset.x, rotation.y + offset.y, rotation.z + offset.z);
    object.position.copy(position);
    if (name === "Body_Pivot") {
      object.position.y += pose.bodyLift * scale;
      object.scale.set(1 / Math.sqrt(pose.squash), pose.squash, 1 / Math.sqrt(pose.squash));
    }
  }
  actionRoot.updateMatrixWorld(true);
  let lowest = Infinity;
  for (const boot of boots) {
    const positions = boot.geometry.getAttribute("position");
    for (let index = 0; index < positions.count; index++) {
      vertex.fromBufferAttribute(positions, index).applyMatrix4(boot.matrixWorld);
      lowest = Math.min(lowest, vertex.y);
    }
  }
  if (lowest < minimumFootY) { minimumFootY = lowest; lowestTime = time; }
  minimumClearance = Math.min(minimumClearance, lowest + 0.025);
}
assert(minimumClearance >= 0, `Boot clips contact plane by ${-minimumClearance} at ${lowestTime}s`);
console.log(JSON.stringify({ rigSamples: 721, bootMeshes: boots.length, minimumFootY,
  minimumClearance, lowestTime, contactPlaneY: -0.025, result: "pass" }, null, 2));
