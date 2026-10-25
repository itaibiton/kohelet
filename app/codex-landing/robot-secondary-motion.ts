import {
  BoxGeometry, Color, Group, InstancedMesh, Mesh, MeshBasicMaterial,
  MeshStandardMaterial, Object3D, RingGeometry,
} from "three";
import type { RobotActionPose } from "./robot-run-cycle";
import { ACTION_CYCLE_SECONDS } from "./robot-run-cycle";

/** Bounded cloth displacement in the vertex shader: no simulation or per-frame mesh upload. */
export function prepareRobotCape(root: Object3D) {
  const uniforms = { uCapeTime: { value: 0 }, uCapeSpeed: { value: 0 }, uCapeImpact: { value: 0 } };
  const cape = root.getObjectByName("Cape_Pivot");
  const materials = new Map<MeshStandardMaterial, MeshStandardMaterial>();
  cape?.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    const source = Array.isArray(object.material) ? object.material : [object.material];
    const updated = source.map((material) => {
      if (!(material instanceof MeshStandardMaterial)) return material;
      const existing = materials.get(material);
      if (existing) return existing;
      const cloth = material.clone();
      cloth.customProgramCacheKey = () => "kohelet-soft-cape-v1";
      cloth.onBeforeCompile = (shader) => {
        Object.assign(shader.uniforms, uniforms);
        shader.vertexShader = `uniform float uCapeTime;
uniform float uCapeSpeed;
uniform float uCapeImpact;
${shader.vertexShader}`;
        // All cape rigid meshes are expressed at the clasp pivot; negative Y is the hem.
        shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
transformed += capeWarp;`);
        shader.vertexShader = shader.vertexShader.replace("#include <beginnormal_vertex>", `#include <beginnormal_vertex>
float cd = clamp(-position.y / 1.65, 0.0, 1.0);
float cl = cd * cd;
float cdy = (cd > 0.0 && cd < 1.0) ? -1.0 / 1.65 : 0.0;
float cly = 2.0 * cd * cdy;
float ca = position.x * 5.1 - uCapeTime * 72.0 - cd * 3.1;
float cb = position.x * 8.4 + uCapeTime * 47.0 + cd * 2.0;
float csa = sin(ca); float csb = sin(cb);
float cca = cos(ca); float ccb = cos(cb);
float cw = 0.008 + 0.055 * uCapeSpeed;
float cx = 0.008 + 0.018 * uCapeSpeed;
float cf = (csa + 0.35 * csb) * cw - 0.045 * (uCapeSpeed + uCapeImpact);
vec3 capeWarp = vec3(cl * csb * cx, 0.0, cl * cf);
float cfx = cl * cw * (5.1 * cca + 2.94 * ccb);
float cfy = cly * cf + cl * cw * (-3.1 * cdy * cca + 0.7 * cdy * ccb);
float cgx = cl * cx * 8.4 * ccb;
float cgy = cly * csb * cx + cl * cx * 2.0 * cdy * ccb;
float cnx = (objectNormal.x - cfx * objectNormal.z) / (1.0 + cgx);
objectNormal = normalize(vec3(cnx, objectNormal.y - cgy * cnx - cfy * objectNormal.z, objectNormal.z));`);
      };
      materials.set(material, cloth);
      return cloth;
    });
    object.material = Array.isArray(object.material) ? updated : updated[0];
    object.geometry.computeBoundingBox();
    // Maximum shader displacement is <0.18 units; include it in culling and camera fitting.
    object.geometry.boundingBox?.expandByScalar(0.18);
    object.geometry.computeBoundingSphere();
    if (object.geometry.boundingSphere) object.geometry.boundingSphere.radius += 0.18;
  });
  return {
    update(time: number, pose: RobotActionPose) {
      uniforms.uCapeTime.value = time / ACTION_CYCLE_SECONDS * Math.PI * 2;
      uniforms.uCapeSpeed.value = pose.effects.speed;
      uniforms.uCapeImpact.value = pose.effects.impact;
    },
  };
}

/** Restrained speed and contact cues. All streaks share one draw call. */
export function createRobotGroundEffects() {
  const root = new Group();
  root.name = "Robot_Ground_Cues";
  const streakMat = new MeshBasicMaterial({ color: "#999782", transparent: true, opacity: 0, depthWrite: false });
  const streaks = new InstancedMesh(new BoxGeometry(0.018, 0.008, 0.42), streakMat, 5);
  streaks.frustumCulled = false;
  root.add(streaks);
  const contactMat = new MeshBasicMaterial({ color: "#b6a583", transparent: true, opacity: 0, depthWrite: false });
  const ring = new Mesh(new RingGeometry(0.48, 0.5, 48), contactMat);
  ring.rotation.x = -Math.PI / 2;
  root.add(ring);
  const dustMat = new MeshBasicMaterial({ color: "#c6b999", transparent: true, opacity: 0, depthWrite: false });
  const dust = new InstancedMesh(new BoxGeometry(0.055, 0.055, 0.055), dustMat, 7);
  dust.frustumCulled = false;
  root.add(dust);
  const dummy = new Object3D();
  const color = new Color();
  for (let i = 0; i < 7; i++) dust.setColorAt(i, color.set(i % 3 ? "#c6b999" : "#7b8eb5"));
  return {
    root,
    update(time: number, pose: RobotActionPose, scale: number) {
      const speed = pose.effects.speed;
      const impact = pose.effects.impact;
      root.position.set(pose.root.x * scale, -0.017, pose.root.z * scale);
      root.rotation.y = pose.root.yaw;
      root.scale.setScalar(scale);
      const cycle = time / ACTION_CYCLE_SECONDS;
      streaks.visible = speed > 0.05;
      streakMat.opacity = speed * 0.22;
      for (let i = 0; i < 5; i++) {
        const progress = ((cycle * 40 + i / 5) % 1 + 1) % 1;
        dummy.position.set((i % 2 ? -1 : 1) * (0.49 + i * 0.075), 0, 0.8 - progress * 2.05);
        dummy.rotation.set(0, 0, 0);
        const taper = Math.sin(progress * Math.PI) ** 2;
        dummy.scale.set(taper, 1, 0.4 + speed * 0.9);
        dummy.updateMatrix();
        streaks.setMatrixAt(i, dummy.matrix);
      }
      streaks.instanceMatrix.needsUpdate = true;
      ring.visible = dust.visible = impact > 0.02;
      contactMat.opacity = impact * 0.22;
      ring.scale.setScalar(1 + (1 - impact) * 1.25);
      ring.position.y = 0.003;
      dustMat.opacity = impact * 0.5;
      for (let i = 0; i < 7; i++) {
        const angle = i / 7 * Math.PI * 2;
        const radius = 0.45 + (1 - impact) * 0.55;
        dummy.position.set(Math.cos(angle) * radius, 0.035 + (1 - impact) * 0.11, Math.sin(angle) * radius);
        dummy.rotation.set(angle * 2, angle, angle);
        dummy.scale.setScalar(0.7 + impact * 0.3);
        dummy.updateMatrix();
        dust.setMatrixAt(i, dummy.matrix);
      }
      dust.instanceMatrix.needsUpdate = true;
    },
  };
}
