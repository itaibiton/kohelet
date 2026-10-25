import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { Box3, Group, Matrix4, Mesh, Vector3 } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import ts from "typescript";

const { ACTION_CYCLE_SECONDS, getRobotActionPose } = await import(
  new URL("../app/codex-landing/robot-run-cycle.ts", import.meta.url).href
) as typeof import("../app/codex-landing/robot-run-cycle");
// Compile the exact browser source with its dependencies resolved to file URLs.
// This avoids a Node24-only loader hook while keeping extensionless Next.js imports.
const hurdleSource = await readFile(new URL("../app/codex-landing/robot-tech-hurdle.ts", import.meta.url), "utf8");
const hurdleModule = ts.transpileModule(hurdleSource
  .replaceAll('"three"', JSON.stringify(import.meta.resolve("three")))
  .replaceAll('"three/addons/utils/BufferGeometryUtils.js"', JSON.stringify(import.meta.resolve("three/addons/utils/BufferGeometryUtils.js")))
  .replaceAll('"./robot-run-cycle"', JSON.stringify(new URL("../app/codex-landing/robot-run-cycle.ts", import.meta.url).href)), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText;
const { createRobotTechHurdle, getRobotHurdleState, ROBOT_HURDLE } = await import(
  `data:text/javascript;base64,${Buffer.from(hurdleModule).toString("base64")}`
) as typeof import("../app/codex-landing/robot-tech-hurdle");

// Material-free glTF preserves every vertex and joint while avoiding browser image decoding.
const glb = await readFile(new URL("../public/models/kohelet-robot-king.glb", import.meta.url));
const oldLength = glb.readUInt32LE(12);
const document = JSON.parse(glb.subarray(20, 20 + oldLength).toString("utf8"));
document.materials = document.materials.map(() => ({})); document.images = []; document.textures = [];
const json = Buffer.from(JSON.stringify(document));
const chunk = Buffer.alloc(8 + json.length + (4 - json.length % 4) % 4, 0x20);
chunk.writeUInt32LE(chunk.length - 8, 0); chunk.writeUInt32LE(0x4e4f534a, 4); json.copy(chunk, 8);
const binary = glb.subarray(20 + oldLength), header = Buffer.from(glb.subarray(0, 12));
header.writeUInt32LE(12 + chunk.length + binary.length, 8);
const gltf = await new GLTFLoader().parseAsync(Uint8Array.from(Buffer.concat([header, chunk, binary])).buffer, "");
const actionRoot = new Group(); actionRoot.add(gltf.scene);
const hurdle = createRobotTechHurdle();
const scene = new Group(); scene.add(actionRoot, hurdle.root);
const rests = Object.keys(getRobotActionPose(0).joints).map((name) => {
  const object = gltf.scene.getObjectByName(name); assert(object);
  return { name: name as keyof ReturnType<typeof getRobotActionPose>["joints"], object,
    rotation: object.rotation.clone(), position: object.position.clone() };
});
const boots: Mesh[] = [];
for (const name of ["Boot_R_Pivot", "Boot_L_Pivot"]) {
  gltf.scene.getObjectByName(name)?.traverse((object) => { if (object instanceof Mesh) boots.push(object); });
}
assert(boots.length >= 2, "Both exported boots need real geometry");
const obstacles: Mesh[] = [];
hurdle.root.traverse((object) => { if (object instanceof Mesh) obstacles.push(object); });
assert.equal(obstacles.length, 6, "The hurdle must remain six merged draw calls");

const point = new Vector3(), inverseHurdle = new Matrix4();
const bootBox = new Box3();
let overlappingSamples = 0, minimumPassingClearance = Infinity, apexClearance = Infinity;
let maxWidth = 0, maxDepth = 0, maximumOpacityGap = 0, maximumVisibleMotionGap = 0;
for (let index = 0; index <= 2016; index++) {
  const time = index / 100, pose = getRobotActionPose(time), state = getRobotHurdleState(time);
  actionRoot.position.set(pose.root.x, pose.root.y, pose.root.z); actionRoot.rotation.y = pose.root.yaw;
  for (const { name, object, rotation, position } of rests) {
    const offset = pose.joints[name]; object.rotation.set(rotation.x + offset.x, rotation.y + offset.y, rotation.z + offset.z);
    object.position.copy(position); if (name === "Body_Pivot") object.position.y += pose.bodyLift;
  }
  hurdle.update(time, pose); scene.updateMatrixWorld(true);
  assert(Object.values(state).every(Number.isFinite));
  assert(state.opacity >= 0 && state.opacity <= 1);
  const next = getRobotHurdleState(time + ACTION_CYCLE_SECONDS);
  for (const key of Object.keys(state) as (keyof typeof state)[]) {
    assert(Math.abs(state[key] - next[key]) < 1e-10, `Hurdle loop seam in ${key}`);
  }
  if (state.opacity < 0.001) continue;
  assert(time < 5.12, "Hurdle must leave before the workstation appears");
  inverseHurdle.copy(hurdle.root.matrixWorld).invert();
  for (const boot of boots) {
    bootBox.makeEmpty(); const vertices = boot.geometry.getAttribute("position");
    for (let v = 0; v < vertices.count; v++) {
      point.fromBufferAttribute(vertices, v).applyMatrix4(boot.matrixWorld).applyMatrix4(inverseHurdle);
      bootBox.expandByPoint(point);
    }
    maxWidth = Math.max(maxWidth, bootBox.max.x - bootBox.min.x);
    maxDepth = Math.max(maxDepth, bootBox.max.z - bootBox.min.z);
    for (const obstacle of obstacles) {
      obstacle.geometry.computeBoundingBox(); const obstacleBox = obstacle.geometry.boundingBox; assert(obstacleBox);
      const horizontalOverlap = bootBox.max.x > obstacleBox.min.x && bootBox.min.x < obstacleBox.max.x &&
        bootBox.max.z > obstacleBox.min.z && bootBox.min.z < obstacleBox.max.z;
      if (!horizontalOverlap) continue;
      const clearance = bootBox.min.y - obstacleBox.max.y;
      assert(clearance > 0.12, `Boot clips the hurdle at ${time}s; clearance ${clearance}`);
      overlappingSamples++;
      minimumPassingClearance = Math.min(minimumPassingClearance, clearance);
      if (Math.abs(time - 4.0) < 0.001) apexClearance = Math.min(apexClearance, clearance);
    }
  }
}
const epsilon = 1e-6;
for (const time of [0, 2.65, 2.9, 3.08, 4.0, 4.72, 5.1, 5.12, ACTION_CYCLE_SECONDS]) {
  const a = getRobotHurdleState(time - epsilon), b = getRobotHurdleState(time + epsilon);
  maximumOpacityGap = Math.max(maximumOpacityGap, Math.abs(a.opacity - b.opacity));
  if (a.opacity > 0.001 || b.opacity > 0.001) {
    maximumVisibleMotionGap = Math.max(maximumVisibleMotionGap, Math.abs(a.x - b.x), Math.abs(a.y - b.y), Math.abs(a.z - b.z));
  }
}
// A hidden reset is harmless; visible entrance/exit is C2 continuous at the same floor plane.
assert(maximumOpacityGap < 0.0001);
assert(maximumVisibleMotionGap < 0.0001);
assert(getRobotHurdleState(3.2).opacity > 0.99, "Barrier must be readable before takeoff");
assert(getRobotHurdleState(4.55).opacity > 0.99, "Barrier must still exist after landing");
assert.equal(getRobotHurdleState(7).opacity, 0);
assert(overlappingSamples > 10, "The jump must actually cross the obstacle, not pass beside it");
assert(apexClearance > 0.12, "The tucked boots must visibly clear the PCB at the apex");
assert(ROBOT_HURDLE.height <= 0.45);
console.log(JSON.stringify({ samples: 2017, hurdleDraws: obstacles.length, overlappingSamples,
  minimumPassingClearance, apexClearance, maxBootWidth: maxWidth, maxBootDepth: maxDepth,
  maximumOpacityGap, maximumVisibleMotionGap, obstacleHeight: ROBOT_HURDLE.height, result: "pass" }, null, 2));
