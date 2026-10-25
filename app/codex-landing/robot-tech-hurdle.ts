import {
  BoxGeometry, Group, Mesh, MeshStandardMaterial,
  type BufferGeometry, type Material,
} from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { ACTION_CYCLE_SECONDS, type RobotActionPose } from "./robot-run-cycle";

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const settle = (value: number) => {
  const u = clamp(value);
  return u * u * u * (u * (u * 6 - 15) + 10);
};
const between = (time: number, start: number, end: number) => settle((time - start) / (end - start));

/** Model units, with the stationary lane aligned to the robot's jump heading. */
export const ROBOT_HURDLE = {
  yaw: -0.55,
  laneX: -0.20,
  laneZ: 0.27,
  width: 1.74,
  height: 0.425,
  depth: 0.38,
} as const;

/** A moving ground obstacle, never parented to the jumping character. */
export function getRobotHurdleState(time: number) {
  const t = ((time % ACTION_CYCLE_SECONDS) + ACTION_CYCLE_SECONDS) % ACTION_CYCLE_SECONDS;
  const opacity = between(t, 2.65, 3.08) * (1 - between(t, 4.72, 5.12));
  // The board crosses the lane at 4.0s, underneath the tucked feet at the flight apex.
  // Minimum-jerk travel keeps approach, passage and exit a single continuous movement.
  const travel = 2.15 - 4.3 * between(t, 2.9, 5.1);
  return {
    x: ROBOT_HURDLE.laneX + Math.sin(ROBOT_HURDLE.yaw) * travel,
    y: -0.035 * (1 - opacity),
    z: ROBOT_HURDLE.laneZ + Math.cos(ROBOT_HURDLE.yaw) * travel,
    yaw: ROBOT_HURDLE.yaw,
    opacity,
    travel,
  };
}

/** A physical circuit-board hurdle: six merged materials, no texture uploads or geometry changes. */
export function createRobotTechHurdle() {
  const root = new Group();
  root.name = "Robot_Technology_Hurdle";
  const material = (color: string, metalness = 0.12) => new MeshStandardMaterial({
    color, roughness: 0.82, metalness, transparent: true,
  });
  const cobalt = material("#244bc8");
  const edge = material("#173288");
  const gold = material("#c8af73", 0.35);
  const graphite = material("#303c4c");
  const ceramic = material("#baa995");
  const pale = material("#eee2cb");
  const materials = [cobalt, edge, gold, graphite, ceramic, pale];

  function box(width: number, height: number, depth: number, x: number, y: number, z: number) {
    return new BoxGeometry(width, height, depth).translate(x, y, z);
  }
  function merge(pieces: BufferGeometry[], surface: Material, name: string) {
    const geometry = mergeGeometries(pieces);
    pieces.forEach((piece) => piece.dispose());
    const mesh = new Mesh(geometry, surface);
    mesh.name = name;
    root.add(mesh);
  }

  // The tall PCB makes a legible bar; short brackets make it a ground obstacle.
  merge([box(1.6, 0.18, 0.14, 0, 0.335, 0)], cobalt, "Cobalt_Circuit_Board");
  merge([
    box(1.6, 0.025, 0.15, 0, 0.255, 0),
    box(0.07, 0.025, 0.15, -0.765, 0.4125, 0),
    box(0.07, 0.025, 0.15, 0.765, 0.4125, 0),
  ], edge, "Laminated_PCB_Edges");
  merge([
    box(0.23, 0.075, 0.38, -0.745, 0.0125, 0),
    box(0.23, 0.075, 0.38, 0.745, 0.0125, 0),
    box(0.09, 0.27, 0.15, -0.745, 0.1725, 0),
    box(0.09, 0.27, 0.15, 0.745, 0.1725, 0),
  ], ceramic, "Ceramic_Support_Brackets");
  merge([
    box(0.34, 0.12, 0.06, 0, 0.335, 0.101),
    box(0.16, 0.075, 0.04, -0.49, 0.335, 0.096),
    box(0.16, 0.075, 0.04, 0.49, 0.335, 0.096),
  ], graphite, "Processor_And_Driver_Chips");

  const traces: BufferGeometry[] = [];
  // Exposed edge contacts and paired traces run into the central processor.
  for (const sign of [-1, 1]) {
    for (let row = 0; row < 3; row++) {
      const y = 0.287 + row * 0.048;
      const outer = sign * (0.63 - row * 0.045);
      const inner = sign * 0.22;
      traces.push(box(Math.abs(outer - inner), 0.01, 0.012, (outer + inner) / 2, y, 0.076));
      traces.push(box(0.01, 0.018 + row * 0.015, 0.012, inner, y + sign * 0.01, 0.076));
    }
    for (let pin = 0; pin < 5; pin++) {
      traces.push(box(0.035, 0.011, 0.022, sign * 0.185, 0.287 + pin * 0.024, 0.094));
    }
    for (let contact = 0; contact < 4; contact++) {
      traces.push(box(0.025, 0.035, 0.014, sign * (0.605 + contact * 0.047), 0.258, 0.077));
    }
  }
  merge(traces, gold, "Gold_Traces_And_Processor_Pins");
  merge([
    box(0.11, 0.025, 0.014, 0, 0.335, 0.139),
    box(0.025, 0.065, 0.014, 0, 0.335, 0.139),
    box(0.035, 0.021, 0.012, -0.65, 0.385, 0.081),
    box(0.035, 0.021, 0.012, 0.65, 0.385, 0.081),
  ], pale, "Processor_Mark_And_Status_Diodes");

  return {
    root,
    update(time: number, _pose: RobotActionPose) {
      void _pose; // Kept compatible with the shared environment update(time, pose) contract.
      const state = getRobotHurdleState(time);
      root.visible = state.opacity > 0.001;
      root.position.set(state.x, state.y, state.z);
      root.rotation.y = state.yaw;
      for (const surface of materials) {
        surface.opacity = state.opacity;
        surface.depthWrite = state.opacity > 0.99;
      }
    },
  };
}
