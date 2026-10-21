"use client";

import {
  ACESFilmicToneMapping, Box3, CanvasTexture, DirectionalLight, Group, HemisphereLight, Material,
  Mesh, MeshBasicMaterial, Object3D, OrthographicCamera, PlaneGeometry, PMREMGenerator,
  Scene, Sphere, SRGBColorSpace, Texture, Vector3, WebGLRenderer,
  type BufferGeometry, type WebGLRenderTarget,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { getRobotActionPose, ACTION_CYCLE_SECONDS, type RunJoint } from "./robot-run-cycle";
import { createRobotTaskProps } from "./robot-task-props";

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

/** A looping run / jump / work story with a fixed camera and explicit playback. */
export function createRobotKingScene(host: HTMLDivElement, options: SceneOptions): RobotKingController {
  const renderer = new WebGLRenderer({ alpha: true, antialias: true });
  const scene = new Scene();
  const camera = new OrthographicCamera(-3, 3, 3, -3, 0.1, 100);
  const framing = new Group();
  const actionRoot = new Group();
  const tasks = createRobotTaskProps();
  actionRoot.add(tasks.root);
  framing.add(actionRoot);
  const abort = new AbortController();
  let environment: WebGLRenderTarget | undefined;
  let resizeObserver: ResizeObserver | undefined;
  let disposed = false;
  let loaded = false;
  let revealed = false;
  let playing = options.playing;
  let visible = options.visible;
  let frame: number | null = null;
  let lastTick = 0;
  const parameters = new URLSearchParams(window.location.search);
  const diagnostics = parameters.has("robot-debug");
  const requestedStart = Number(parameters.get("robot-start"));
  let elapsed = diagnostics && Number.isFinite(requestedStart) ? Math.max(0, requestedStart) % ACTION_CYCLE_SECONDS : 0;
  let radius = 2;
  let modelHeight = 4;
  let centerY = 0;
  let centerX = 0;
  let centerZ = 0;
  let shadow: Mesh<PlaneGeometry, MeshBasicMaterial> | undefined;
  let pixelRatio = Math.min(window.devicePixelRatio || 1, 1.25);
  let sampledFrames = 0;
  let sampledTime = 0;
  let renderTime = 0;
  let slowFrames = 0;
  let stableWindows = 0;
  let action = "";
  const movingParts: MovingPart[] = [];
  const poseEnvelope = new Box3();
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
    const pose = getRobotActionPose(time);
    const { phase, bodyLift, joints, root, squash, trail } = pose;
    const scale = modelHeight / 4.4;
    framing.position.y = -centerY;
    actionRoot.position.set(root.x * scale, root.y * scale, root.z * scale);
    actionRoot.rotation.y = root.yaw;
    // Only the body squashes; the workstation stays rigid while the robot works.
    tasks.update(pose.props);
    if (shadow) {
      shadow.position.set(-centerX + root.x * scale, -centerY - 0.025, -centerZ + root.z * scale);
      const distance = Math.min(1, root.y / 0.8);
      shadow.scale.setScalar(1 + distance * 0.25);
      shadow.material.opacity = 1 - distance * 0.62;
    }
    if (pose.action !== action) { action = pose.action; host.dataset.action = action; }
    movingParts.forEach(({ object, position, rotation, index }) => {
      if (object.name.startsWith("Data_Tile_")) {
        const offset = index * 0.8;
        object.position.y = position.y + Math.sin(phase + offset) * (0.025 + trail.speed * 0.045) * scale;
        object.position.z = position.z + Math.cos(phase + offset) * (0.03 + trail.speed * 0.09) * scale;
        object.rotation.z = rotation.z + Math.sin(phase + offset) * 0.07;
      } else {
        const joint = joints[object.name as RunJoint];
        if (!joint) return;
        object.rotation.set(rotation.x + joint.x, rotation.y + joint.y, rotation.z + joint.z);
        object.position.y = position.y + (object.name === "Body_Pivot" ? bodyLift * scale : 0);
        if (object.name === "Body_Pivot") object.scale.set(1 / Math.sqrt(squash), squash, 1 / Math.sqrt(squash));
      }
    });
  }

  function tick(now: number) {
    frame = null;
    if (!canRender() || !playing) return;
    frame = requestAnimationFrame(tick);
    const delta = now - lastTick;
    elapsed += Math.min(delta / 1000, 0.1);
    lastTick = now;
    const started = performance.now();
    animateParts(elapsed);
    renderFrame();
    // Native display cadence; resolution changes only after sustained pressure.
    sampledFrames++;
    sampledTime += delta;
    renderTime += performance.now() - started;
    if (delta > 24) slowFrames++;
    if (sampledFrames >= 120) {
      const cost = renderTime / sampledFrames;
      const strained = cost > 9 || slowFrames / sampledFrames > 0.2;
      stableWindows = !strained && cost < 5 ? stableWindows + 1 : 0;
      const ceiling = Math.min(window.devicePixelRatio || 1, 1.25);
      const floor = Math.min(ceiling, 0.85);
      const nextRatio = strained ? Math.max(floor, pixelRatio - 0.2) : stableWindows >= 5 ? ceiling : pixelRatio;
      if (nextRatio !== pixelRatio) {
        pixelRatio = nextRatio;
        resize();
        stableWindows = 0;
      }
      if (diagnostics) {
        host.dataset.fps = (sampledFrames / sampledTime * 1000).toFixed(1);
        host.dataset.renderMs = cost.toFixed(2);
        host.dataset.drawCalls = String(renderer.info.render.calls);
        host.dataset.triangles = String(renderer.info.render.triangles);
        host.dataset.pixelRatio = pixelRatio.toFixed(2);
        host.dataset.cycleTime = (elapsed % ACTION_CYCLE_SECONDS).toFixed(2);
      }
      sampledFrames = sampledTime = renderTime = slowFrames = 0;
    }
  }

  function updateLoop() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    if (!canRender()) return;
    renderFrame();
    if (playing && !disposed) {
      lastTick = performance.now();
      sampledFrames = sampledTime = renderTime = slowFrames = 0;
      frame = requestAnimationFrame(tick);
    }
  }

  function resize() {
    if (disposed) return;
    const bounds = host.getBoundingClientRect();
    const width = Math.max(1, Math.round(bounds.width));
    const height = Math.max(1, Math.round(bounds.height));
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    const distance = radius * 4;
    camera.position.copy(viewDirection).multiplyScalar(distance);
    camera.near = Math.max(0.01, distance - radius * 3);
    camera.far = distance + radius * 5;
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    const projected = poseEnvelope.clone();
    if (projected.isEmpty()) projected.setFromCenterAndSize(new Vector3(), new Vector3(4, 4, 4));
    const size = projected.getSize(new Vector3());
    const center = projected.getCenter(new Vector3());
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

  function measureRunEnvelope() {
    camera.position.copy(viewDirection).multiplyScalar(radius * 4);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    poseEnvelope.makeEmpty();
    for (let sample = 0; sample < 144; sample++) {
      animateParts((sample / 144) * ACTION_CYCLE_SECONDS);
      framing.updateMatrixWorld(true);
      framing.traverseVisible((object) => {
        if (!(object instanceof Mesh)) return;
        if (!object.geometry.boundingBox) object.geometry.computeBoundingBox();
        const bounds = object.geometry.boundingBox;
        if (!bounds) return;
        for (const x of [bounds.min.x, bounds.max.x]) {
          for (const y of [bounds.min.y, bounds.max.y]) {
            for (const z of [bounds.min.z, bounds.max.z]) {
              poseEnvelope.expandByPoint(new Vector3(x, y, z).applyMatrix4(object.matrixWorld).applyMatrix4(camera.matrixWorldInverse));
            }
          }
        }
      });
    }
    animateParts(elapsed);
  }

  try {
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.94;
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.tabIndex = -1;
    host.appendChild(renderer.domElement);
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);

    const room = new RoomEnvironment();
    const pmrem = new PMREMGenerator(renderer);
    try { environment = pmrem.fromScene(room, 0.04); }
    finally { room.dispose(); pmrem.dispose(); }
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.38;
    scene.add(new HemisphereLight(0xfff8e8, 0x697695, 0.65));
    const key = new DirectionalLight(0xfff1da, 2.3);
    key.position.set(4, 7, 6);
    scene.add(key);
    const fill = new DirectionalLight(0xdde7ff, 0.85);
    fill.position.set(-4, 3, 4); scene.add(fill);
    const rim = new DirectionalLight(0xffdfa5, 0.95);
    rim.position.set(2, 5, -4); scene.add(rim);
    scene.add(framing);
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    document.addEventListener("visibilitychange", updateLoop);
    resize();

    void (async () => {
      const response = await fetch("/models/kohelet-robot-king.glb?v=actions", { signal: abort.signal });
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
      centerX = center.x;
      centerZ = center.z;
      framing.position.copy(center).negate();
      actionRoot.add(gltf.scene);
      gltf.scene.traverse((object) => {
        if (/^(Body_Pivot|Head_Pivot|Arm_[RL]_Pivot|Leg_[RL]_Pivot|Knee_[RL]_Pivot|Boot_[RL]_Pivot|Cape_Pivot|Data_Tile_\d+)$/.test(object.name)) {
          movingParts.push({ object, position: object.position.clone(), rotation: object.rotation.clone(), index: movingParts.length });
        }
      });
      measureRunEnvelope();
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
        shadow = new Mesh(
          new PlaneGeometry(modelHeight * 0.62, modelHeight * 0.3),
          new MeshBasicMaterial({ map: new CanvasTexture(shadowCanvas), transparent: true, depthWrite: false }),
        );
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.set(-center.x, -modelHeight / 2 - 0.025, -center.z);
        scene.add(shadow);
      }
      tasks.update({ laptop: 1, automation: 1, codeProgress: 0, automationProgress: 0 });
      await renderer.compileAsync(scene, camera);
      if (disposed) return;
      animateParts(elapsed);
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
