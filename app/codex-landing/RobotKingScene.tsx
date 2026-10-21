"use client";

import {
  ACESFilmicToneMapping, Box3, CanvasTexture, DirectionalLight, Group, HemisphereLight, Material,
  Mesh, MeshBasicMaterial, Object3D, OrthographicCamera, PlaneGeometry, PMREMGenerator,
  Scene, Sphere, SRGBColorSpace, Texture, Vector3, WebGLRenderer,
  type BufferGeometry, type WebGLRenderTarget,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

type SceneOptions = { playing: boolean; visible: boolean; onReady: () => void; onError: () => void };
export type RobotKingController = { setPlaying: (playing: boolean) => void; setVisible: (visible: boolean) => void; dispose: () => void };
type MovingPart = { object: Object3D; position: Vector3; rotation: Object3D["rotation"]; index: number };

function disposeObject(root: Object3D) {
  const geometries = new Set<BufferGeometry>();
  const materials = new Set<Material>();
  const textures = new Set<Texture>();
  root.traverse((object) => {
    if (object instanceof DirectionalLight) object.shadow.dispose();
    if (!(object instanceof Mesh)) return;
    geometries.add(object.geometry);
    const meshMaterials = Array.isArray(object.material) ? object.material : [object.material];
    meshMaterials.forEach((material: Material) => {
      materials.add(material);
      Object.values(material).forEach((value: unknown) => { if (value instanceof Texture) textures.add(value); });
    });
  });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
  textures.forEach((texture) => {
    texture.dispose();
    const image = texture.source.data;
    if (typeof ImageBitmap !== "undefined" && image instanceof ImageBitmap) image.close();
  });
}

/** A rare marketing illustration: gentle character motion explains the floating data motif. */
export function createRobotKingScene(host: HTMLDivElement, options: SceneOptions): RobotKingController {
  const renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  const scene = new Scene();
  const camera = new OrthographicCamera(-3, 3, 3, -3, 0.1, 100);
  const framing = new Group();
  const abort = new AbortController();
  let environment: WebGLRenderTarget | undefined;
  let resizeObserver: ResizeObserver | undefined;
  let disposed = false;
  let loaded = false;
  let revealed = false;
  let playing = options.playing;
  let visible = options.visible;
  let frame: number | null = null;
  let lastFrame = 0;
  let lastTick = 0;
  let elapsed = 0;
  let radius = 2;
  let modelHeight = 4;
  let centerY = 0;
  const movingParts: MovingPart[] = [];
  const viewDirection = new Vector3(5.22, 3.08, 9.5).normalize();

  function dispose() {
    if (disposed) return;
    disposed = true;
    abort.abort();
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    resizeObserver?.disconnect();
    document.removeEventListener("visibilitychange", updateLoop);
    renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
    disposeObject(scene);
    environment?.dispose();
    scene.environment = null;
    scene.clear();
    framing.clear();
    movingParts.length = 0;
    renderer.renderLists.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
  }

  function fail() {
    if (disposed) return;
    dispose();
    options.onError();
  }

  function onContextLost(event: Event) {
    event.preventDefault();
    fail();
  }

  function canRender() { return !disposed && loaded && visible && !document.hidden; }

  function renderFrame() {
    if (!canRender()) return;
    try {
      renderer.render(scene, camera);
      if (!revealed) { revealed = true; options.onReady(); }
    } catch { fail(); }
  }

  function animateParts(time: number) {
    framing.position.y = -centerY + Math.sin(time * 0.8) * modelHeight * 0.006;
    movingParts.forEach(({ object, position, rotation, index }) => {
      if (object.name.startsWith("Data_Tile_")) {
        object.position.y = position.y + (Math.sin(time * 0.75 + index * 0.85) - Math.sin(index * 0.85)) * modelHeight * 0.018;
        object.rotation.z = rotation.z + (Math.sin(time * 0.5 + index * 0.6) - Math.sin(index * 0.6)) * 0.035;
      } else if (object.name === "Head_Pivot") {
        object.rotation.y = rotation.y + Math.sin(time * 0.6) * 0.045;
        object.rotation.z = rotation.z + Math.sin(time * 0.8) * 0.02;
      } else if (object.name === "Body_Pivot") {
        object.rotation.z = rotation.z + Math.sin(time * 0.65) * 0.012;
      } else {
        object.rotation.z = rotation.z + (Math.sin(time * 0.7 + index) - Math.sin(index)) * 0.025;
      }
    });
  }

  function tick(now: number) {
    frame = null;
    if (!canRender() || !playing) return;
    frame = requestAnimationFrame(tick);
    const interval = 1000 / 30;
    if (now - lastFrame < interval) return;
    elapsed += Math.min((now - lastTick) / 1000, 0.1);
    lastTick = now;
    lastFrame = now - ((now - lastFrame) % interval);
    animateParts(elapsed);
    renderFrame();
  }

  function updateLoop() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    if (!canRender()) return;
    renderFrame();
    if (playing && !disposed) {
      lastTick = performance.now();
      lastFrame = lastTick;
      frame = requestAnimationFrame(tick);
    }
  }

  function resize() {
    if (disposed) return;
    const bounds = host.getBoundingClientRect();
    const width = Math.max(1, Math.round(bounds.width));
    const height = Math.max(1, Math.round(bounds.height));
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height, false);
    const distance = radius * 4;
    camera.position.copy(viewDirection).multiplyScalar(distance);
    camera.near = Math.max(0.01, distance - radius * 3);
    camera.far = distance + radius * 5;
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    framing.updateMatrixWorld(true);
    const projected = new Box3();
    framing.traverse((object) => {
      if (!(object instanceof Mesh)) return;
      object.geometry.computeBoundingBox();
      const bounds = object.geometry.boundingBox;
      if (!bounds) return;
      for (const x of [bounds.min.x, bounds.max.x]) {
        for (const y of [bounds.min.y, bounds.max.y]) {
          for (const z of [bounds.min.z, bounds.max.z]) {
            projected.expandByPoint(new Vector3(x, y, z).applyMatrix4(object.matrixWorld).applyMatrix4(camera.matrixWorldInverse));
          }
        }
      }
    });
    const size = projected.isEmpty() ? new Vector3(4, 4, 4) : projected.getSize(new Vector3());
    const center = projected.isEmpty() ? new Vector3() : projected.getCenter(new Vector3());
    const aspect = width / height;
    const frameHeight = Math.max(size.y, size.x / aspect) * 1.12;
    const frameWidth = frameHeight * aspect;
    camera.left = center.x - frameWidth / 2;
    camera.right = center.x + frameWidth / 2;
    camera.top = center.y + frameHeight / 2;
    camera.bottom = center.y - frameHeight / 2;
    camera.updateProjectionMatrix();
    renderFrame();
  }

  try {
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.tabIndex = -1;
    host.appendChild(renderer.domElement);
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);

    const room = new RoomEnvironment();
    const pmrem = new PMREMGenerator(renderer);
    try { environment = pmrem.fromScene(room, 0.04); }
    finally { room.dispose(); pmrem.dispose(); }
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.65;
    scene.add(new HemisphereLight(0xfff8e8, 0x697695, 0.8));
    const key = new DirectionalLight(0xfff1da, 3.2);
    key.position.set(4, 7, 6);
    scene.add(key);
    const fill = new DirectionalLight(0xdde7ff, 1.2);
    fill.position.set(-4, 3, 4); scene.add(fill);
    const rim = new DirectionalLight(0xffdfa5, 1.4);
    rim.position.set(2, 5, -4); scene.add(rim);
    scene.add(framing);
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    document.addEventListener("visibilitychange", updateLoop);
    resize();

    void (async () => {
      const response = await fetch("/models/kohelet-robot-king.glb", { signal: abort.signal });
      if (!response.ok) throw new Error("Robot model unavailable");
      const buffer = await response.arrayBuffer();
      if (disposed) return;
      const gltf = await new GLTFLoader().parseAsync(buffer, "/models/");
      if (disposed) { disposeObject(gltf.scene); return; }
      const bounds = new Box3().setFromObject(gltf.scene);
      if (bounds.isEmpty()) { disposeObject(gltf.scene); throw new Error("Robot model has no geometry"); }
      const center = bounds.getCenter(new Vector3());
      modelHeight = bounds.getSize(new Vector3()).y;
      radius = bounds.getBoundingSphere(new Sphere()).radius;
      centerY = center.y;
      framing.position.copy(center).negate();
      framing.add(gltf.scene);
      gltf.scene.traverse((object) => {
        if (/^(Body_Pivot|Head_Pivot|Arm_[RL]_Pivot|Data_Tile_\d+)$/.test(object.name)) {
          movingParts.push({ object, position: object.position.clone(), rotation: object.rotation.clone(), index: movingParts.length });
        }
      });
      const shadowCanvas = document.createElement("canvas");
      shadowCanvas.width = 128; shadowCanvas.height = 128;
      const shadowContext = shadowCanvas.getContext("2d");
      if (shadowContext) {
        const gradient = shadowContext.createRadialGradient(64, 64, 0, 64, 64, 64);
        gradient.addColorStop(0, "rgba(32, 33, 30, 0.16)");
        gradient.addColorStop(0.45, "rgba(32, 33, 30, 0.08)");
        gradient.addColorStop(1, "rgba(32, 33, 30, 0)");
        shadowContext.fillStyle = gradient;
        shadowContext.fillRect(0, 0, 128, 128);
        const shadow = new Mesh(
          new PlaneGeometry(modelHeight * 0.62, modelHeight * 0.3),
          new MeshBasicMaterial({ map: new CanvasTexture(shadowCanvas), transparent: true, depthWrite: false }),
        );
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.set(-center.x, -modelHeight / 2 - 0.025, -center.z);
        scene.add(shadow);
      }
      loaded = true;
      resize();
      updateLoop();
    })().catch(() => { if (!disposed) fail(); });
  } catch { fail(); }

  return {
    setPlaying(value) { if (!disposed && value !== playing) { playing = value; updateLoop(); } },
    setVisible(value) { if (!disposed && value !== visible) { visible = value; updateLoop(); } },
    dispose,
  };
}
