import {
  BoxGeometry, BufferAttribute, BufferGeometry, CatmullRomCurve3, Color, DoubleSide,
  ExtrudeGeometry, Group, InstancedMesh, Mesh, MeshBasicMaterial, MeshStandardMaterial,
  Object3D, Shape, TorusGeometry, Vector3,
} from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { ACTION_CYCLE_SECONDS, type RobotActionPose } from "./robot-run-cycle";

const TAU = Math.PI * 2;
type Floater = {
  x: number; y: number; z: number; scale: number; phase: number;
  roll: number; pitch: number; yaw: number;
};

/** Merge authored pieces into one material draw, releasing construction geometry. */
function combine(parts: BufferGeometry[]) {
  const normalized = parts.map((part) => {
    const geometry = part.index ? part.toNonIndexed() : part;
    geometry.deleteAttribute("uv");
    return geometry;
  });
  const result = mergeGeometries(normalized, false);
  if (!result) throw new Error("Could not build Robot King atmosphere geometry");
  for (const part of new Set([...parts, ...normalized])) part.dispose();
  result.computeBoundingBox();
  result.computeBoundingSphere();
  return result;
}

function box(width: number, height: number, depth: number, x = 0, y = 0, z = 0) {
  return new BoxGeometry(width, height, depth).translate(x, y, z);
}

function makePaper() {
  const outline = new Shape();
  outline.moveTo(-0.4, -0.53);
  outline.lineTo(0.4, -0.53);
  outline.lineTo(0.4, 0.36);
  outline.lineTo(0.23, 0.53);
  outline.lineTo(-0.4, 0.53);
  outline.closePath();
  return combine([new ExtrudeGeometry(outline, {
    depth: 0.024, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.008,
    bevelSegments: 1, steps: 1, curveSegments: 1,
  })]);
}

function makeFold() {
  // A raised triangular fold: the inside corner stands proud of the paper.
  const fold = new BufferGeometry();
  fold.setAttribute("position", new BufferAttribute(new Float32Array([
    0.23, 0.53, 0.038, 0.23, 0.36, 0.165, 0.4, 0.36, 0.038,
    0.23, 0.53, 0.03, 0.4, 0.36, 0.03, 0.23, 0.36, 0.145,
    0.23, 0.53, 0.038, 0.23, 0.53, 0.03, 0.23, 0.36, 0.145,
    0.23, 0.53, 0.038, 0.23, 0.36, 0.145, 0.23, 0.36, 0.165,
    0.4, 0.36, 0.038, 0.23, 0.36, 0.165, 0.23, 0.36, 0.145,
    0.4, 0.36, 0.038, 0.23, 0.36, 0.145, 0.4, 0.36, 0.03,
  ]), 3));
  fold.computeVertexNormals();
  return fold;
}

function makeInk() {
  const parts = [
    box(0.36, 0.043, 0.009, -0.08, 0.37, 0.041),
    box(0.13, 0.13, 0.009, -0.23, 0.15, 0.041),
    box(0.32, 0.019, 0.009, 0.08, 0.19, 0.041),
    box(0.25, 0.019, 0.009, 0.045, 0.12, 0.041),
  ];
  for (let i = 0; i < 4; i++) {
    parts.push(box(i === 3 ? 0.32 : 0.59, 0.019, 0.009,
      i === 3 ? -0.135 : 0, -0.07 - i * 0.095, 0.041));
  }
  return combine(parts);
}

function makeChipPins() {
  const parts: BufferGeometry[] = [];
  for (let i = 0; i < 5; i++) {
    const along = (i - 2) * 0.115;
    parts.push(box(0.045, 0.17, 0.055, along, -0.38));
    parts.push(box(0.045, 0.17, 0.055, along, 0.38));
    parts.push(box(0.17, 0.045, 0.055, -0.38, along));
    parts.push(box(0.17, 0.045, 0.055, 0.38, along));
  }
  parts.push(box(0.075, 0.075, 0.012, -0.245, 0.245, 0.085));
  return combine(parts);
}

function makeChipEtching() {
  const parts = [
    box(0.27, 0.022, 0.01, 0, 0.125, 0.109),
    box(0.27, 0.022, 0.01, 0, -0.125, 0.109),
    box(0.022, 0.27, 0.01, -0.125, 0, 0.109),
    box(0.022, 0.27, 0.01, 0.125, 0, 0.109),
    box(0.065, 0.065, 0.01, 0, 0, 0.109),
  ];
  for (let i = 0; i < 3; i++) {
    const along = (i - 1) * 0.08;
    parts.push(box(0.018, 0.105, 0.01, along, 0.24, 0.084));
    parts.push(box(0.018, 0.105, 0.01, along, -0.24, 0.084));
    parts.push(box(0.105, 0.018, 0.01, -0.24, along, 0.084));
    parts.push(box(0.105, 0.018, 0.01, 0.24, along, 0.084));
  }
  return combine(parts);
}

function makeGear() {
  const outline = new Shape();
  const teeth = 10;
  for (let i = 0; i < teeth * 4; i++) {
    const angle = i / (teeth * 4) * TAU;
    const radius = i % 4 === 0 || i % 4 === 3 ? 0.27 : 0.36;
    const x = Math.cos(angle) * radius, y = Math.sin(angle) * radius;
    if (i === 0) outline.moveTo(x, y); else outline.lineTo(x, y);
  }
  outline.closePath();
  const hole = new Shape();
  hole.absarc(0, 0, 0.115, 0, TAU, true);
  outline.holes.push(hole);
  const body = new ExtrudeGeometry(outline, {
    depth: 0.085, bevelEnabled: true, bevelSize: 0.018, bevelThickness: 0.012,
    bevelSegments: 1, curveSegments: 14, steps: 1,
  }).translate(0, 0, -0.0425);
  return combine([body, new TorusGeometry(0.145, 0.022, 5, 16).translate(0, 0, 0.055)]);
}

function makeConnector() {
  return combine([
    box(0.32, 0.31, 0.17, 0, 0.05),
    box(0.075, 0.2, 0.075, -0.09, 0.29),
    box(0.075, 0.2, 0.075, 0.09, 0.29),
    box(0.15, 0.25, 0.13, 0, -0.21),
    box(0.23, 0.04, 0.185, 0, -0.075),
  ]);
}

function makeWind() {
  const paths = [
    [[-2.5, 0.8, -1.55], [-2.67, 1.8, -1.6], [-2.02, 3.05, -1.68], [-1.16, 3.57, -1.75]],
    [[0.85, 0.7, -1.75], [2.07, 1.35, -1.6], [2.57, 2.65, -1.6], [2.05, 4.1, -1.75]],
    [[-2.1, 3.77, -1.75], [-1.1, 4.33, -1.7], [0.35, 4.57, -1.72], [1.47, 4.35, -1.8]],
  ];
  const position: number[] = [], uv: number[] = [], indices: number[] = [];
  const tangent = new Vector3();
  for (let arc = 0; arc < paths.length; arc++) {
    const curve = new CatmullRomCurve3(paths[arc].map(([x, y, z]) => new Vector3(x, y, z)));
    const segments = 40, start = position.length / 3;
    for (let i = 0; i <= segments; i++) {
      const u = i / segments;
      const point = curve.getPoint(u);
      curve.getTangent(u, tangent);
      const width = (arc === 2 ? 0.042 : 0.063) * Math.sin(Math.PI * u) ** 0.55 + 0.001;
      const nx = -tangent.y, ny = tangent.x;
      position.push(point.x + nx * width, point.y + ny * width, point.z);
      position.push(point.x - nx * width, point.y - ny * width, point.z);
      uv.push(u + arc * 0.23, 0, u + arc * 0.23, 1);
      if (i < segments) {
        const a = start + i * 2;
        indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
      }
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(position), 3));
  geometry.setAttribute("uv", new BufferAttribute(new Float32Array(uv), 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

/**
 * Authored miniature scenery behind the mascot. Nine draws, no particles or texture uploads.
 * Add root to the fixed framing group, not the turning character/action root.
 */
export function createRobotSceneAtmosphere() {
  const root = new Group();
  root.name = "Robot_Flying_Studio";
  const paper = new MeshStandardMaterial({ color: "#e0d4bd", roughness: 0.88, metalness: 0 });
  const fold = new MeshStandardMaterial({ color: "#bcae92", roughness: 0.93, metalness: 0, side: DoubleSide });
  const ink = new MeshStandardMaterial({ color: "#536b9d", roughness: 0.82, metalness: 0.02 });
  const cobalt = new MeshStandardMaterial({ color: "#325d9b", roughness: 0.72, metalness: 0.12 });
  const gold = new MeshStandardMaterial({ color: "#b79559", roughness: 0.6, metalness: 0.42 });
  const etching = new MeshStandardMaterial({ color: "#bac7d0", roughness: 0.8, metalness: 0.08 });

  function instances(name: string, geometry: BufferGeometry, material: MeshStandardMaterial, count: number) {
    const mesh = new InstancedMesh(geometry, material, count);
    mesh.name = name;
    root.add(mesh);
    return mesh;
  }
  const pages = instances("Flying_Document_Paper", makePaper(), paper, 3);
  const folds = instances("Flying_Document_Folds", makeFold(), fold, 3);
  const inks = instances("Flying_Document_Ink", makeInk(), ink, 3);
  const chips = instances("Flying_Chip_Packages", combine([
    box(0.67, 0.67, 0.13), box(0.39, 0.39, 0.07, 0, 0, 0.062),
  ]), cobalt, 2);
  const pins = instances("Flying_Chip_Pin_Banks", makeChipPins(), gold, 2);
  const chipEtchings = instances("Flying_Chip_Circuits", makeChipEtching(), etching, 2);
  const gears = instances("Flying_Cog_Gears", makeGear(), gold, 2);
  const connectors = instances("Flying_Connector_Heads", makeConnector(), cobalt, 2);

  const windUniforms = { uWindPhase: { value: 0 } };
  const windMaterial = new MeshBasicMaterial({
    color: "#6a86b1", transparent: true, opacity: 0.32, depthWrite: false, side: DoubleSide,
  });
  windMaterial.forceSinglePass = true;
  windMaterial.customProgramCacheKey = () => "kohelet-wind-ribbon-v1";
  windMaterial.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, windUniforms);
    shader.vertexShader = `varying vec2 vWindUv;\n${shader.vertexShader}`;
    shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
vWindUv = uv;`);
    shader.fragmentShader = `uniform float uWindPhase;\nvarying vec2 vWindUv;\n${shader.fragmentShader}`;
    shader.fragmentShader = shader.fragmentShader.replace("#include <color_fragment>", `#include <color_fragment>
float windPulse = pow(0.5 + 0.5 * cos((vWindUv.x - uWindPhase) * 6.28318530718), 5.0);
float windEdge = pow(max(0.0, sin(vWindUv.y * 3.14159265359)), 0.4);
diffuseColor.a *= (0.2 + 0.8 * windPulse) * windEdge;`);
  };
  const wind = new Mesh(makeWind(), windMaterial);
  wind.name = "Sculptural_Wind_Ribbons";
  root.add(wind);

  const documents: Floater[] = [
    { x: -2.12, y: 2.86, z: -1.38, scale: 0.86, phase: 0.15, roll: -0.26, pitch: 0.1, yaw: 0.4 },
    { x: 1.81, y: 3.75, z: -1.42, scale: 0.66, phase: 2.3, roll: 0.24, pitch: -0.17, yaw: 0.33 },
    { x: -1.12, y: 4.21, z: -1.57, scale: 0.52, phase: 4.1, roll: -0.17, pitch: 0.22, yaw: 0.52 },
  ];
  const microchips: Floater[] = [
    { x: 2.03, y: 1.47, z: -1.4, scale: 0.76, phase: 1.7, roll: -0.37, pitch: 0.17, yaw: 0.35 },
    { x: -2.08, y: 1.25, z: -1.36, scale: 0.69, phase: 4.7, roll: 0.48, pitch: -0.22, yaw: 0.67 },
  ];
  const cogwheels: Floater[] = [
    { x: -2.17, y: 3.94, z: -1.45, scale: 0.83, phase: 2.8, roll: 0.2, pitch: 0.13, yaw: 0.48 },
    { x: 2.1, y: 2.66, z: -1.54, scale: 0.76, phase: 5.4, roll: -0.22, pitch: 0.22, yaw: 0.31 },
  ];
  const plugs: Floater[] = [
    { x: -1.55, y: 1.95, z: -1.65, scale: 0.68, phase: 3.5, roll: -0.65, pitch: 0.11, yaw: 0.6 },
    { x: 1.11, y: 4.31, z: -1.6, scale: 0.7, phase: 0.6, roll: 0.5, pitch: -0.23, yaw: 0.3 },
  ];
  const dummy = new Object3D();
  const color = new Color();
  pages.setColorAt(0, color.set("#f3ead8"));
  pages.setColorAt(1, color.set("#e5e2d8"));
  pages.setColorAt(2, color.set("#f1e2c6"));
  const instanceMeshes = [pages, folds, inks, chips, pins, chipEtchings, gears, connectors];

  function place(config: Floater, angle: number, speed: number, gear = false, paperFlutter = false) {
    const amplitude = 0.4 + 0.6 * speed;
    // A common wind direction carries every object through a small, continuous eddy.
    // Paper responds at higher harmonics; heavier components keep their inertia.
    const phase = angle * 4 + config.phase;
    dummy.position.set(
      config.x + Math.sin(phase) * 0.19 * amplitude,
      config.y + Math.cos(phase + 0.35) * 0.19 * amplitude,
      config.z + Math.sin(phase + 0.9) * 0.08 * amplitude,
    );
    dummy.rotation.set(
      config.pitch + Math.sin(phase * 2) * (paperFlutter ? 0.19 : 0.11) * amplitude,
      config.yaw + Math.cos(phase) * 0.2 * amplitude,
      config.roll + (gear ? angle * 6 : (
        Math.sin(phase) * 0.09 + Math.sin(phase * (paperFlutter ? 3 : 1)) * (paperFlutter ? 0.29 : 0.14)
      ) * amplitude),
    );
    dummy.scale.setScalar(config.scale * (0.93 + speed * 0.07));
    dummy.updateMatrix();
  }

  return {
    root,
    update(time: number, pose: RobotActionPose) {
      const angle = time / ACTION_CYCLE_SECONDS * TAU;
      const speed = pose.effects.speed;
      for (let i = 0; i < documents.length; i++) {
        place(documents[i], angle, speed, false, true);
        pages.setMatrixAt(i, dummy.matrix);
        folds.setMatrixAt(i, dummy.matrix);
        inks.setMatrixAt(i, dummy.matrix);
      }
      for (let i = 0; i < microchips.length; i++) {
        place(microchips[i], angle, speed);
        chips.setMatrixAt(i, dummy.matrix);
        pins.setMatrixAt(i, dummy.matrix);
        chipEtchings.setMatrixAt(i, dummy.matrix);
      }
      for (let i = 0; i < cogwheels.length; i++) {
        place(cogwheels[i], angle, speed, true);
        gears.setMatrixAt(i, dummy.matrix);
      }
      for (let i = 0; i < plugs.length; i++) {
        place(plugs[i], angle, speed);
        connectors.setMatrixAt(i, dummy.matrix);
      }
      for (const mesh of instanceMeshes) {
        mesh.instanceMatrix.needsUpdate = true;
        // These are read by the sampled camera envelope; bounds must follow the instances.
        mesh.computeBoundingBox();
        mesh.computeBoundingSphere();
      }
      windUniforms.uWindPhase.value = angle / TAU * 12;
      windMaterial.opacity = 0.18 + speed * 0.3;
    },
  };
}
