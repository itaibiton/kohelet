import {
  BoxGeometry, CanvasTexture, Color, Group, Mesh, MeshBasicMaterial,
  MeshStandardMaterial, PlaneGeometry, SRGBColorSpace, Vector3,
  type BufferGeometry, type Material,
} from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import type { RobotActionPose } from "./robot-run-cycle";

type TaskState = RobotActionPose["props"];
const clamp = (n: number) => Math.max(0, Math.min(1, n));

/** Workstations are assembled once; transforms and a small screen texture tell the story. */
export function createRobotTaskProps() {
  const root = new Group();
  root.name = "Robot_Workstations";
  const laptop = new Group();
  const workflow = new Group();
  root.add(laptop, workflow);
  const makeMaterial = (color: string) => new MeshStandardMaterial({ color, roughness: 0.78, metalness: 0.16, transparent: true });
  const graphite = makeMaterial("#303b4a");
  const keysMat = makeMaterial("#a3adba");
  const blue = makeMaterial("#2549d6");
  const screenMat = new MeshBasicMaterial({ transparent: true });
  const laptopMaterials: Material[] = [graphite, keysMat, blue, screenMat];

  function merge(parent: Group, pieces: BufferGeometry[], material: Material) {
    const geometry = mergeGeometries(pieces);
    pieces.forEach((piece) => piece.dispose());
    const mesh = new Mesh(geometry, material);
    parent.add(mesh);
    return mesh;
  }
  function box(w: number, h: number, d: number, x: number, y: number, z: number) {
    return new BoxGeometry(w, h, d).translate(x, y, z);
  }
  const base = new Mesh(new RoundedBoxGeometry(1.88, 0.08, 0.86, 2, 0.025), graphite);
  base.position.set(0, 1.49, 0.92);
  laptop.add(base);
  const keyParts: BufferGeometry[] = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 9; col++) keyParts.push(box(0.13, 0.018, 0.105, (col - 4) * 0.178, 1.54, 0.62 + row * 0.14));
  }
  keyParts.push(box(0.53, 0.018, 0.085, 0, 1.54, 1.05));
  merge(laptop, keyParts, keysMat);
  const hinge = new Group();
  hinge.position.set(0, 1.53, 1.32);
  laptop.add(hinge);
  const lid = new Mesh(new RoundedBoxGeometry(1.84, 0.88, 0.065, 2, 0.025), graphite);
  lid.position.y = 0.44;
  hinge.add(lid);
  const bezel = new Mesh(new RoundedBoxGeometry(1.75, 0.8, 0.071, 2, 0.018), blue);
  bezel.position.y = 0.44;
  hinge.add(bezel);
  // Illustrative code, not a client result or live terminal.
  const canvas = document.createElement("canvas");
  canvas.width = 512; canvas.height = 256;
  const context = canvas.getContext("2d");
  const map = new CanvasTexture(canvas);
  map.colorSpace = SRGBColorSpace;
  screenMat.map = map;
  for (const facing of [1, -1]) {
    const display = new Mesh(new PlaneGeometry(1.68, 0.74), screenMat);
    display.position.set(0, 0.44, facing * 0.037);
    display.rotation.y = facing < 0 ? Math.PI : 0;
    hinge.add(display);
  }
  const codeLines = ["const question = discover();", "const plan = connect(question);", "await build(plan);", "return somethingUseful;"];
  let paintedProgress = -1;
  function paintCode(progress: number) {
    const bucket = Math.floor(clamp(progress) * 64);
    if (!context || bucket === paintedProgress) return;
    paintedProgress = bucket;
    context.fillStyle = "#101e35"; context.fillRect(0, 0, 512, 256);
    context.font = "13px monospace"; context.fillStyle = "#7f91a8";
    context.fillText("KOHELET / BUILD", 25, 28);
    let remaining = Math.floor(bucket / 64 * codeLines.join("").length);
    codeLines.forEach((line, i) => {
      context.font = "17px monospace"; context.fillStyle = i % 2 ? "#cbb98b" : "#9ed2dc";
      context.fillText(line.slice(0, Math.max(0, remaining)), 26, 73 + i * 42);
      remaining -= line.length;
    });
    if (bucket === 64) { context.fillStyle = "#94bcb5"; context.fillRect(26, 234, 460, 2); }
    map.needsUpdate = true;
  }
  paintCode(0);

  const points = [new Vector3(-0.68, 1.53, 0.76), new Vector3(0, 1.8, 0.82), new Vector3(0.68, 1.53, 0.76)];
  const workingPoints = points.map((p) => p.clone());
  const dragTarget = new Vector3(-0.35, 1.72, 0.82);
  const wireDirection = new Vector3();
  const wireAxis = new Vector3(1, 0, 0);
  const nodeMaterials = points.map(() => makeMaterial("#2549d6"));
  const nodes = points.map((point, i) => {
    const node = new Mesh(new RoundedBoxGeometry(0.31, 0.31, 0.13, 2, 0.035), nodeMaterials[i]);
    node.position.copy(point); workflow.add(node); return node;
  });
  const wireMat = makeMaterial("#7c8fac");
  const wires = [0, 1].map(() => {
    const mesh = new Mesh(new BoxGeometry(1, 0.025, 0.025), wireMat);
    workflow.add(mesh); return mesh;
  });
  const packetMat = new MeshBasicMaterial({ color: "#d7bf86", transparent: true });
  const packet = new Mesh(new RoundedBoxGeometry(0.09, 0.09, 0.09, 1, 0.015), packetMat);
  workflow.add(packet);
  const checkMat = new MeshBasicMaterial({ color: "#d5dfd2", transparent: true });
  const check = merge(workflow, [box(0.11, 0.026, 0.018, -0.04, 0, 0).rotateZ(-0.7), box(0.19, 0.026, 0.018, 0.05, 0.026, 0).rotateZ(0.75)], checkMat);
  const workflowMaterials: Material[] = [...nodeMaterials, wireMat, packetMat, checkMat];
  const idleColor = new Color("#2549d6"); const readyColor = new Color("#548a96");
  function show(group: Group, materials: Material[], opacity: number) {
    group.visible = opacity > 0.002;
    materials.forEach((mat) => { mat.opacity = opacity; mat.depthWrite = opacity > 0.99; });
    group.position.y = (1 - opacity) * -0.1; group.scale.setScalar(0.94 + opacity * 0.06);
  }
  return {
    root,
    update(state: TaskState) {
      show(laptop, laptopMaterials, state.laptop); show(workflow, workflowMaterials, state.automation);
      hinge.rotation.x = -Math.PI / 2 + clamp(state.laptopLid) * (Math.PI / 2 + 0.08);
      if (laptop.visible) paintCode(state.codeProgress);
      const assemble = clamp(state.automationAssemble); const drag = clamp(state.automationDrag);
      const press = clamp(state.automationPress); const complete = clamp((state.automationProgress - 0.85) / 0.15);
      workingPoints.forEach((point, i) => {
        point.copy(points[i]); point.x += (1 - assemble) * (i - 1) * 0.3;
        point.y -= (1 - assemble) * (i % 2 ? 0.27 : -0.12);
      });
      workingPoints[0].lerp(dragTarget, drag);
      nodes.forEach((node, i) => {
        node.position.copy(workingPoints[i]); node.rotation.z = (1 - assemble) * (i % 2 ? -0.7 : 0.7);
        node.scale.setScalar(1 - (i === 0 ? press * 0.07 : 0));
        nodeMaterials[i].color.copy(idleColor).lerp(readyColor, Math.max(complete, i === 0 ? press * 0.35 : 0));
      });
      wires.forEach((wire, i) => {
        const a = workingPoints[i]; const b = workingPoints[i + 1];
        const reveal = clamp(drag * 1.8 - i * 0.3);
        wire.position.copy(a).lerp(b, reveal / 2);
        wire.quaternion.setFromUnitVectors(wireAxis, wireDirection.subVectors(b, a).normalize());
        wire.scale.x = Math.max(0.001, a.distanceTo(b) * reveal); wire.visible = workflow.visible && reveal > 0.01;
      });
      const travel = clamp(state.automationProgress) * 2; const segment = Math.min(1, Math.floor(travel));
      packet.position.lerpVectors(workingPoints[segment], workingPoints[segment + 1], travel - segment);
      packet.position.z += 0.09; packet.visible = workflow.visible && state.automationProgress > 0.01 && state.automationProgress < 0.98;
      check.visible = workflow.visible && complete > 0.01; check.position.copy(workingPoints[2]); check.position.z += 0.075;
      checkMat.opacity = state.automation * complete;
    },
  };
}
