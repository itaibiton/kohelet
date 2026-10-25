import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { Mesh, MeshStandardMaterial, Texture, type WebGLRenderer } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const { applyRobotMatteMaterials } = await import(
  new URL("../app/codex-landing/robot-materials.ts", import.meta.url).href
) as typeof import("../app/codex-landing/robot-materials");

const glb = await readFile(new URL("../public/models/kohelet-robot-king.glb", import.meta.url));
const jsonLength = glb.readUInt32LE(12);
const document = JSON.parse(glb.subarray(20, 20 + jsonLength).toString("utf8"));
assert.deepEqual(document.materials.map((material: { name: string }) => material.name), [
  "Delivery · matte mineral palette", "Delivery · brushed antique metal palette", "Delivery · warm display pixels",
], "A re-export with different palettes needs an explicit material review, not a silent no-op");
assert.equal(document.images.length, 4, "Keep the authored micrograin and brushed texture maps");
const authoredMaterials = structuredClone(document.materials);

// Load the real graph, vertex colors and UVs in Node without browser PNG decoding.
// The actual texture slots are restored with identity tokens below; the helper
// must retain them rather than replace the embedded assets or repaint colors.
document.materials.forEach((material: { normalTexture?: unknown; pbrMetallicRoughness?: { metallicRoughnessTexture?: unknown } }) => {
  delete material.normalTexture;
  if (material.pbrMetallicRoughness) delete material.pbrMetallicRoughness.metallicRoughnessTexture;
});
document.images = []; document.textures = [];
const json = Buffer.from(JSON.stringify(document));
const chunk = Buffer.alloc(8 + json.length + (4 - json.length % 4) % 4, 0x20);
chunk.writeUInt32LE(chunk.length - 8, 0); chunk.writeUInt32LE(0x4e4f534a, 4); json.copy(chunk, 8);
const binary = glb.subarray(20 + jsonLength), header = Buffer.from(glb.subarray(0, 12));
header.writeUInt32LE(12 + chunk.length + binary.length, 8);
const gltf = await new GLTFLoader().parseAsync(Uint8Array.from(Buffer.concat([header, chunk, binary])).buffer, "");
const textures = [new Texture(), new Texture(), new Texture(), new Texture()];
const sources = new Map<Mesh, {
  colors: unknown; uv: unknown; color: number; normal: Texture | null;
  roughness: Texture | null; metalness: Texture | null;
}>();
let capeCompiles = 0;
const cape = gltf.scene.getObjectByName("Cape_Pivot"); assert(cape);
cape.traverse((object) => {
  if (!(object instanceof Mesh) || !(object.material instanceof MeshStandardMaterial)) return;
  object.material = object.material.clone();
  object.material.customProgramCacheKey = () => "test-cape-warp";
  object.material.onBeforeCompile = (shader: Parameters<MeshStandardMaterial["onBeforeCompile"]>[0]) => {
    capeCompiles++; shader.vertexShader += "\n// capeWarp retained";
  };
});
gltf.scene.traverse((object) => {
  if (!(object instanceof Mesh) || !(object.material instanceof MeshStandardMaterial)) return;
  const material = object.material;
  const authored = authoredMaterials.find((entry: { name: string }) => entry.name === material.name);
  if (authored.normalTexture) material.normalMap = textures[authored.normalTexture.index];
  if (authored.pbrMetallicRoughness?.metallicRoughnessTexture) {
    material.roughnessMap = material.metalnessMap = textures[authored.pbrMetallicRoughness.metallicRoughnessTexture.index];
  }
  sources.set(object, { colors: object.geometry.getAttribute("color"), uv: object.geometry.getAttribute("uv"),
    color: material.color.getHex(), normal: material.normalMap, roughness: material.roughnessMap, metalness: material.metalnessMap });
});
assert(sources.size > 40, "Exercise the complete exported character, including face, cloth and crown");
applyRobotMatteMaterials(gltf.scene);

const profileCounts = new Map<string, number>();
const identities = new Map<Mesh, MeshStandardMaterial>();
for (const [object, source] of sources) {
  const material = object.material; assert(material instanceof MeshStandardMaterial);
  identities.set(object, material);
  assert.equal(object.geometry.getAttribute("color"), source.colors);
  assert.equal(object.geometry.getAttribute("uv"), source.uv);
  assert.equal(material.color.getHex(), source.color);
  assert.equal(material.normalMap, source.normal);
  assert.equal(material.roughnessMap, source.roughness);
  assert.equal(material.metalnessMap, source.metalness);
  assert.equal(material.roughness, 1);
  assert(material.envMapIntensity <= 0.18, "Room reflections must not wash the character white");
  assert(material.metalness <= 0.32, "Keep the gold soft, with no chrome-like reflection");
  const profile = material.userData.koheletMatteFinish;
  profileCounts.set(profile, (profileCounts.get(profile) ?? 0) + 1);
  const shader = { uniforms: {}, vertexShader: "#include <begin_vertex>", fragmentShader: "#include <roughnessmap_fragment>" };
  material.onBeforeCompile(shader as Parameters<typeof material.onBeforeCompile>[0], {} as WebGLRenderer);
  assert(shader.fragmentShader.includes("roughnessFactor = mix("));
  if (material.customProgramCacheKey().includes("test-cape-warp")) {
    assert(shader.vertexShader.includes("capeWarp retained"), "The matte finish must compose with the cloth shader");
  }
  if (profile === "mineral") assert(shader.fragmentShader.includes("mix(0.84, 0.99"));
  if (profile === "antique-metal") assert(shader.fragmentShader.includes("mix(0.72, 0.94"));
  if (profile === "cloth") assert(shader.fragmentShader.includes("mix(0.90, 1.00"));
  if (profile === "display") assert.equal(material.emissiveIntensity, 1.25);
}
assert.deepEqual([...profileCounts.keys()].sort(), ["antique-metal", "cloth", "display", "mineral"]);
assert(capeCompiles > 0, "The real cape materials retain their inherited vertex hook");
applyRobotMatteMaterials(gltf.scene);
identities.forEach((material, object) => assert.equal(object.material, material, "Reapplying must not clone or accumulate shaders"));
console.log(JSON.stringify({ meshes: sources.size, authoredTexturesRetained: textures.length,
  profiles: Object.fromEntries(profileCounts), capeCompiles, result: "pass" }, null, 2));
