import { Mesh, MeshPhysicalMaterial, MeshStandardMaterial, type Object3D } from "three";

type Finish = "mineral" | "antique-metal" | "cloth" | "display";

// These are the three authored GLB palettes, not guesses from a material's color.
const MINERAL = "Delivery · matte mineral palette";
const METAL = "Delivery · brushed antique metal palette";
const DISPLAY = "Delivery · warm display pixels";
const FINISH_KEY = "koheletMatteFinish";

const finishes = {
  mineral: { roughnessLow: 0.84, roughnessHigh: 0.99, metalness: 0, environment: 0.1, normal: 0.58, specular: 0.22 },
  "antique-metal": { roughnessLow: 0.72, roughnessHigh: 0.94, metalness: 0.32, environment: 0.18, normal: 0.5, specular: 0.4 },
  cloth: { roughnessLow: 0.9, roughnessHigh: 1, metalness: 0, environment: 0.035, normal: 0.68, specular: 0.12 },
  display: { roughnessLow: 0.92, roughnessHigh: 1, metalness: 0, environment: 0, normal: 0, specular: 0.15 },
} satisfies Record<Finish, { roughnessLow: number; roughnessHigh: number; metalness: number; environment: number; normal: number; specular: number }>;

function isCape(object: Object3D) {
  let ancestor: Object3D | null = object;
  while (ancestor) {
    if (ancestor.name === "Cape_Pivot") return true;
    ancestor = ancestor.parent;
  }
  return false;
}

function classify(material: MeshStandardMaterial, object: Object3D): Finish | null {
  if (material.name === MINERAL) return isCape(object) ? "cloth" : "mineral";
  if (material.name === METAL) return "antique-metal";
  if (material.name === DISPLAY) return "display";
  return null;
}

function applyFinish(material: MeshStandardMaterial, finish: Finish) {
  if (material.userData[FINISH_KEY] === finish) return;
  const values = finishes[finish];
  material.roughness = 1;
  material.metalness = values.metalness;
  material.envMapIntensity = values.environment;
  if (material.normalMap) material.normalScale.setScalar(values.normal);
  if (material instanceof MeshPhysicalMaterial) {
    material.clearcoat = 0;
    material.sheen = 0;
    material.transmission = 0;
    material.specularIntensity = values.specular;
  }
  if (finish === "display") material.emissiveIntensity = 1.25;

  // GLB roughness is already multiplied by its texture (mineral 0.74–0.84,
  // metal 0.56–0.66). Raising only the scalar cannot make those surfaces matte.
  // Remap the authored values into a softer range, retaining their fine detail
  // and all existing normal/roughness/color maps. This adds no texture or frame work.
  const previousCompile = material.onBeforeCompile;
  const previousCacheKey = material.customProgramCacheKey.bind(material);
  const inheritedCacheKey = previousCacheKey();
  material.onBeforeCompile = (shader, renderer) => {
    previousCompile.call(material, shader, renderer);
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <roughnessmap_fragment>",
      `#include <roughnessmap_fragment>\nroughnessFactor = mix(${values.roughnessLow.toFixed(2)}, ${values.roughnessHigh.toFixed(2)}, clamp(roughnessFactor, 0.0, 1.0));`,
    );
  };
  // Keep the cape's vertex warp in the program identity and compile callback.
  material.customProgramCacheKey = () => `${inheritedCacheKey}|kohelet-matte-v1:${finish}`;
  material.userData[FINISH_KEY] = finish;
  material.needsUpdate = true;
}

/**
 * Soft ceramic, worn gold and matte blue cloth without repainting the Robot King.
 * Call after prepareRobotCape so its material clones keep their cloth vertex shader.
 * Existing scene disposal owns these materials and their shared authored textures;
 * this helper creates no render-loop work or extra textures and needs no cleanup.
 */
export function applyRobotMatteMaterials(root: Object3D) {
  const bindings: { object: Mesh; materials: MeshStandardMaterial[]; array: boolean }[] = [];
  const variants = new Map<MeshStandardMaterial, Map<Finish, MeshStandardMaterial>>();
  root.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    if (!materials.every((material) => material instanceof MeshStandardMaterial)) return;
    bindings.push({ object, materials, array: Array.isArray(object.material) });
    materials.forEach((material) => {
      const finish = classify(material, object);
      if (!finish) return;
      let sourceVariants = variants.get(material);
      if (!sourceVariants) { sourceVariants = new Map(); variants.set(material, sourceVariants); }
      if (sourceVariants.has(finish)) return;
      // Usually prepareRobotCape has already isolated cloth. Keep direct calls safe
      // too, so a shared mineral material cannot make the shell inherit cloth.
      const variant = sourceVariants.size === 0 ? material : material.clone();
      if (variant !== material) {
        variant.onBeforeCompile = material.onBeforeCompile;
        variant.customProgramCacheKey = material.customProgramCacheKey;
      }
      sourceVariants.set(finish, variant);
    });
  });
  bindings.forEach(({ object, materials, array }) => {
    const updated = materials.map((material) => {
      const finish = classify(material, object);
      return finish ? variants.get(material)?.get(finish) ?? material : material;
    });
    object.material = array ? updated : updated[0];
  });
  variants.forEach((sourceVariants) => sourceVariants.forEach((material, finish) => applyFinish(material, finish)));
}
