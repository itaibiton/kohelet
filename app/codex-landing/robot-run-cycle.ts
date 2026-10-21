export const RUN_CYCLE_SECONDS = 0.82;

export type RunJoint =
  | "Body_Pivot" | "Head_Pivot" | "Arm_R_Pivot" | "Arm_L_Pivot"
  | "Leg_R_Pivot" | "Leg_L_Pivot" | "Knee_R_Pivot" | "Knee_L_Pivot"
  | "Boot_R_Pivot" | "Boot_L_Pivot" | "Cape_Pivot";

type Rotation = { x: number; y: number; z: number };

/** One seamless stride; every value is an offset from the authored neutral rig. */
export function getRobotRunPose(time: number) {
  const phase = ((time % RUN_CYCLE_SECONDS) / RUN_CYCLE_SECONDS) * Math.PI * 2 + Math.PI / 2;
  const stride = Math.sin(phase);
  const hipR = -0.72 * stride;
  const hipL = 0.72 * stride;
  const kneeR = 0.16 + 1.05 * Math.max(0, -stride) ** 2;
  const kneeL = 0.16 + 1.05 * Math.max(0, stride) ** 2;
  const joints: Record<RunJoint, Rotation> = {
    Body_Pivot: { x: 0.16, y: 0.045 * stride, z: 0.025 * stride },
    Head_Pivot: { x: -0.09 + 0.035 * Math.cos(phase * 2), y: -0.035 * stride, z: -0.018 * stride },
    Arm_R_Pivot: { x: 0.64 * stride, y: 0, z: -0.035 * Math.cos(phase) },
    Arm_L_Pivot: { x: -0.64 * stride, y: 0, z: 0.035 * Math.cos(phase) },
    Leg_R_Pivot: { x: hipR, y: 0, z: 0 },
    Leg_L_Pivot: { x: hipL, y: 0, z: 0 },
    Knee_R_Pivot: { x: kneeR, y: 0, z: 0 },
    Knee_L_Pivot: { x: kneeL, y: 0, z: 0 },
    Boot_R_Pivot: { x: -0.16 - 0.72 * hipR - 0.38 * kneeR, y: 0, z: 0 },
    Boot_L_Pivot: { x: -0.16 - 0.72 * hipL - 0.38 * kneeL, y: 0, z: 0 },
    Cape_Pivot: { x: 0.16 + 0.08 * Math.sin(phase * 2 - 0.7), y: 0.06 * stride, z: 0.055 * Math.sin(phase - 0.4) },
  };
  return { phase, bodyLift: 0.033 + 0.09 * Math.cos(phase * 2), joints };
}
