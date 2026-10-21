import {
  BoxGeometry, CanvasTexture, Color, Group, Mesh, MeshBasicMaterial,
  MeshStandardMaterial, PlaneGeometry, SRGBColorSpace, Vector3,
  type BufferGeometry, type Material,
} from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

type TaskState = { laptop: number; automation: number; codeProgress: number; automationProgress: number };

/** Small, real 3D workstations. Geometry and screen artwork are built once. */
export function createRobotTaskProps() {
  const root = new Group();
  root.name = "Robot_Workstations";
  const laptop = new Group();
  const workflow = new Group();
  laptop.position.z = -0.07;
  workflow.position.z = -0.23;
  root.add(laptop, workflow);

  function material(color: string) {
    return new MeshStandardMaterial({ color, roughness: 0.82, metalness: 0.08, transparent: true });
  }
  const graphite = material("#303b4a");
  const blue = material("#2549d6");
  const sand = material("#c5b18a");
  const cyan = new MeshBasicMaterial({ color: "#8fcbd5", transparent: true });
  const laptopMaterials: Material[] = [graphite, blue, sand];
  const workflowMaterials: Material[] = [];

  function box(w: number, h: number, d: number, x: number, y: number, z: number) {
    return new BoxGeometry(w, h, d).translate(x, y, z);
  }
  function merged(parent: Group, pieces: BufferGeometry[], mat: Material) {
    const geometry = mergeGeometries(pieces);
    pieces.forEach((piece) => piece.dispose());
    const mesh = new Mesh(geometry, mat);
    parent.add(mesh);
    return mesh;
  }

  // A compact floating laptop; twin displays keep the code legible at this angle.
  merged(laptop, [box(1.88, 0.075, 0.86, 0, 1.29, 0.99), box(1.84, 0.88, 0.065, 0, 1.74, 1.37)], graphite);
  const keys: BufferGeometry[] = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 9; col++) keys.push(box(0.13, 0.018, 0.105, (col - 4) * 0.178, 1.34, 0.75 + row * 0.14));
  }
  keys.push(box(0.53, 0.018, 0.085, 0, 1.34, 1.16));
  merged(laptop, keys, sand);
  merged(laptop, [box(1.88, 0.022, 0.035, 0, 1.34, 1.39)], blue);

  const screenCanvas = document.createElement("canvas");
  screenCanvas.width = 512;
  screenCanvas.height = 256;
  const ctx = screenCanvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#101e35";
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = "#71809a";
    ctx.font = "14px monospace";
    ctx.fillText("KOHELET / WORKSPACE", 24, 29);
    const lines = ["const idea = discover();", "const plan = connect(idea);", "await build(plan);", "// make it useful."];
    lines.forEach((line, i) => {
      ctx.fillStyle = i === 3 ? "#8292a6" : i % 2 ? "#c5b18a" : "#9ed2dc";
      ctx.font = "19px monospace";
      ctx.fillText(line, 27 + (i === 1 ? 14 : 0), 76 + i * 43);
    });
  }
  const screenMap = new CanvasTexture(screenCanvas);
  screenMap.colorSpace = SRGBColorSpace;
  const screenMat = new MeshBasicMaterial({ map: screenMap, transparent: true });
  laptopMaterials.push(screenMat, cyan);
  for (const facing of [1, -1]) {
    const display = new Mesh(new PlaneGeometry(1.71, 0.77), screenMat);
    display.position.set(0, 1.74, 1.37 + facing * 0.034);
    display.rotation.y = facing < 0 ? Math.PI : 0;
    laptop.add(display);
  }
  const cursor = new Mesh(new BoxGeometry(0.025, 0.045, 0.005), cyan);
  cursor.position.set(0.26, 1.44, 1.408);
  laptop.add(cursor);

  // A three-node automation chain with a single packet passing between nodes.
  const points = [new Vector3(-0.77, 1.47, 1.04), new Vector3(0, 1.82, 1.04), new Vector3(0.77, 1.47, 1.04)];
  const nodeMaterials = points.map(() => material("#2549d6"));
  workflowMaterials.push(...nodeMaterials);
  points.forEach((position, i) => {
    const node = new Mesh(new BoxGeometry(0.39, 0.39, 0.11), nodeMaterials[i]);
    node.position.copy(position);
    node.rotation.z = Math.PI / 4;
    workflow.add(node);
  });
  const wireMat = material("#6a7c9a");
  const wires: BufferGeometry[] = [];
  for (let i = 0; i < 2; i++) {
    const a = points[i];
    const b = points[i + 1];
    const geometry = new BoxGeometry(a.distanceTo(b), 0.025, 0.025);
    geometry.rotateZ(Math.atan2(b.y - a.y, b.x - a.x));
    geometry.translate((a.x + b.x) / 2, (a.y + b.y) / 2, 1.04);
    wires.push(geometry);
  }
  merged(workflow, wires, wireMat);
  const packetMat = new MeshBasicMaterial({ color: "#d7bf86", transparent: true });
  const packet = new Mesh(new BoxGeometry(0.105, 0.105, 0.105), packetMat);
  workflow.add(packet);
  workflowMaterials.push(wireMat, packetMat);
  const inactive = new Color("#2549d6");
  const active = new Color("#73a9bc");

  function show(group: Group, materials: Material[], opacity: number) {
    group.visible = opacity > 0.002;
    materials.forEach((mat) => { mat.opacity = opacity; mat.depthWrite = opacity > 0.99; });
    group.position.y = (group === laptop ? 0.2 : 0) + (1 - opacity) * -0.08;
  }

  return {
    root,
    update(state: TaskState) {
      show(laptop, laptopMaterials, state.laptop);
      show(workflow, workflowMaterials, state.automation);
      // No flashing: the cursor travels gently along the final line.
      cursor.position.x = 0.26 + 0.11 * Math.sin(state.codeProgress * Math.PI * 12);
      const travel = Math.min(1, Math.max(0, state.automationProgress)) * 2;
      const index = Math.min(1, Math.floor(travel));
      packet.position.lerpVectors(points[index], points[index + 1], travel - index);
      packet.position.z += 0.09;
      nodeMaterials.forEach((mat, i) => mat.color.copy(inactive).lerp(active, Math.max(0, 1 - Math.abs(travel - i))));
    },
  };
}
