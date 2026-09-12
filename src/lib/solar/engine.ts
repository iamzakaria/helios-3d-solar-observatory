import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS2DObject, CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
import { BODIES, type BodyDef } from "./bodies";
import { useSolar } from "./store";
import {
  createBodyTexture,
  createCloudTexture,
  createGlowTexture,
  createRingTexture,
} from "./textures";

export type EngineHandle = {
  dispose: () => void;
};

type TrailState = {
  line: THREE.Line;
  positions: Float32Array;
  filled: number;
  max: number;
};

type RuntimeBody = {
  def: BodyDef;
  mesh: THREE.Mesh;
  tilt: THREE.Group;
  holder: THREE.Group;
  clouds?: THREE.Mesh;
  orbitRoot: THREE.Group;
  orbitSpin: THREE.Group;
  label: CSS2DObject;
  trail: TrailState;
  pick: THREE.Object3D[];
};

const TAU = Math.PI * 2;
const OVERVIEW = new THREE.Vector3(20, 30, 74);
const ORIGIN = new THREE.Vector3();
const _world = new THREE.Vector3();
const _delta = new THREE.Vector3();
const _desired = new THREE.Vector3();
const _ndc = new THREE.Vector2();
const TRAIL_LEN = 160;
const UNIT_SPHERE = new THREE.SphereGeometry(1, 48, 32);
const SMALL_SPHERE = new THREE.SphereGeometry(1, 32, 24);
const PICK_SPHERE = new THREE.SphereGeometry(1, 12, 10);

export function createHeliosEngine(
  canvas: HTMLCanvasElement,
  host: HTMLElement,
): EngineHandle {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0x05060a, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.12, 520);
  camera.position.copy(OVERVIEW);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.enablePan = false;
  controls.minDistance = 14;
  controls.maxDistance = 190;
  controls.rotateSpeed = 0.58;
  controls.zoomSpeed = 0.9;
  controls.autoRotateSpeed = 0.22;
  controls.target.set(0, 0, 0);

  const labelRenderer = new CSS2DRenderer();
  labelRenderer.domElement.className = "solar-labels";
  host.appendChild(labelRenderer.domElement);

  const disposables: Array<{ dispose: () => void }> = [
    renderer,
    UNIT_SPHERE,
    SMALL_SPHERE,
    PICK_SPHERE,
  ];
  const runtimes = new Map<string, RuntimeBody>();
  const pickables: THREE.Object3D[] = [];

  scene.add(new THREE.AmbientLight(0xb8c4d4, 0.045));
  scene.add(new THREE.HemisphereLight(0x1c2433, 0x050505, 0.16));

  const starCount = host.clientWidth < 500 ? 2800 : 6200;
  scene.add(makeStarfield(starCount, disposables));
  const asteroidBelt = makeAsteroidBelt(disposables);
  scene.add(asteroidBelt);

  const glowMap = createGlowTexture();
  disposables.push(glowMap);

  for (const def of BODIES) {
    const runtime = buildBody(def, glowMap, disposables, pickables);
    runtimes.set(def.id, runtime);
  }

  for (const runtime of runtimes.values()) {
    const parentId = runtime.def.parentId;
    if (parentId) {
      const parent = runtimes.get(parentId);
      parent?.holder.add(runtime.orbitRoot);
    } else {
      scene.add(runtime.orbitRoot);
    }
    scene.add(runtime.trail.line);
  }

  const raycaster = new THREE.Raycaster();
  raycaster.params.Line = { threshold: 0.2 };
  const pointer = { x: 0, y: 0, downX: 0, downY: 0, dragging: false, active: false };
  let hoverId: string | null = null;
  let simElapsed = 0;
  let timeAcc = 0;
  let approaching = false;
  let approachUntil = 0;

  const timer = new THREE.Timer();
  timer.connect(document);

  const unsub = useSolar.subscribe((state, prev) => {
    if (state.focusedId !== prev.focusedId) {
      approaching = true;
      approachUntil = performance.now() + 1400;
    }
  });

  function resize() {
    const width = Math.max(1, host.clientWidth);
    const height = Math.max(1, host.clientHeight);
    renderer.setSize(width, height, false);
    labelRenderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  function pointerNdc(event: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    _ndc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    _ndc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function hitBody(event: PointerEvent): string | null {
    pointerNdc(event);
    raycaster.setFromCamera(_ndc, camera);
    const hits = raycaster.intersectObjects(pickables, false);
    const id = hits[0]?.object.userData.bodyId;
    return typeof id === "string" ? id : null;
  }

  function onPointerDown(event: PointerEvent) {
    if (event.button !== 0) return;
    pointer.active = true;
    pointer.dragging = false;
    pointer.downX = event.clientX;
    pointer.downY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent) {
    if (pointer.active) {
      const dx = event.clientX - pointer.downX;
      const dy = event.clientY - pointer.downY;
      if (dx * dx + dy * dy > 25) pointer.dragging = true;
    }
    const id = hitBody(event);
    if (id !== hoverId) {
      hoverId = id;
      canvas.style.cursor = id ? "pointer" : pointer.active ? "grabbing" : "grab";
    }
  }

  function onPointerUp(event: PointerEvent) {
    if (event.button !== 0) return;
    const dragged = pointer.dragging;
    pointer.active = false;
    pointer.dragging = false;
    canvas.style.cursor = hoverId ? "pointer" : "grab";
    if (dragged) return;
    const id = hitBody(event);
    if (id) useSolar.getState().focus(id);
  }

  function onPointerLeave() {
    hoverId = null;
    canvas.style.cursor = "grab";
  }

  canvas.style.cursor = "grab";
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointerleave", onPointerLeave);

  function updateOrbits(elapsed: number, spinDt: number) {
    for (const runtime of runtimes.values()) {
      const { def } = runtime;
      if (def.orbitRadius > 0) {
        runtime.orbitSpin.rotation.y = def.phase + (elapsed / def.period) * TAU;
      }
      runtime.tilt.rotation.y += def.spin * spinDt;
      if (runtime.clouds) runtime.clouds.rotation.y += def.spin * 1.35 * spinDt;
    }
  }

  function updateTrails() {
    for (const runtime of runtimes.values()) {
      runtime.mesh.getWorldPosition(_world);
      pushTrail(runtime.trail, _world.x, _world.y, _world.z);
    }
  }

  function updateCamera(dt: number) {
    const { focusedId } = useSolar.getState();
    const k = 1 - Math.exp(-3.5 * dt);
    const now = performance.now();
    const runtime = focusedId ? runtimes.get(focusedId) : undefined;

    if (runtime) {
      runtime.mesh.getWorldPosition(_world);
      const dist =
        runtime.def.radius * (runtime.def.kind === "star" ? 5.4 : 7.1) +
        (runtime.def.kind === "star" ? 9 : 3.2);
      controls.minDistance = Math.max(runtime.def.radius * 2.3, 1.2);
      controls.maxDistance = 190;
      if (approaching && now < approachUntil) {
        controls.target.lerp(_world, k);
        _desired.copy(camera.position).sub(controls.target);
        if (_desired.lengthSq() < 1e-5) _desired.set(0.42, 0.3, 1);
        _desired.normalize().multiplyScalar(dist).add(_world);
        camera.position.lerp(_desired, k);
      } else {
        approaching = false;
        _delta.copy(_world).sub(controls.target);
        controls.target.copy(_world);
        camera.position.add(_delta);
      }
    } else {
      controls.minDistance = 14;
      controls.maxDistance = 190;
      if (approaching && now < approachUntil) {
        controls.target.lerp(ORIGIN, k);
        camera.position.lerp(OVERVIEW, k);
      } else {
        approaching = false;
      }
    }
  }

  function updateLabels() {
    const { showLabels, focusedId, selectedId, showOrbits, showTrails } = useSolar.getState();
    const camDist = camera.position.length();
    const compact = host.clientWidth < 720;
    for (const runtime of runtimes.values()) {
      const { def } = runtime;
      const isMoon = def.kind === "moon";
      const related =
        focusedId === def.id ||
        selectedId === def.id ||
        focusedId === def.parentId ||
        selectedId === def.parentId;
      const far = camDist > 95 && def.kind !== "star";
      runtime.label.visible =
        showLabels && (!isMoon || related) && (!far || related) && (!compact || related);
      runtime.label.element.classList.toggle("is-active", selectedId === def.id);
      runtime.trail.line.visible = showTrails && def.kind !== "star";
    }
    scene.traverse((obj) => {
      if (obj.userData.isOrbit) obj.visible = showOrbits;
    });
  }

  function tick() {
    timer.update();
    const dt = Math.min(timer.getDelta(), 0.1);
    const ui = useSolar.getState();

    if (!ui.paused) {
      const step = dt * ui.speed;
      simElapsed += step;
      timeAcc += dt;
      if (timeAcc > 0.2) {
        timeAcc = 0;
        useSolar.setState({ elapsed: simElapsed });
      }
      updateOrbits(simElapsed, step);
      asteroidBelt.rotation.y = simElapsed * 0.012;
      if (ui.showTrails) updateTrails();
    }

    updateCamera(dt);
    updateLabels();
    controls.autoRotate = !ui.paused && !ui.focusedId && !pointer.active;
    controls.update();
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
  }

  renderer.setAnimationLoop(tick);

  return {
    dispose() {
      renderer.setAnimationLoop(null);
      unsub();
      timer.disconnect();
      timer.dispose();
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      controls.dispose();
      labelRenderer.domElement.remove();
      for (const item of disposables) item.dispose();
      renderer.dispose();
    },
  };
}

function buildBody(
  def: BodyDef,
  glowMap: THREE.CanvasTexture,
  disposables: Array<{ dispose: () => void }>,
  pickables: THREE.Object3D[],
): RuntimeBody {
  const incline = new THREE.Group();
  incline.rotation.z = def.inclination;
  const orbitSpin = new THREE.Group();
  incline.add(orbitSpin);

  const holder = new THREE.Group();
  holder.position.x = def.orbitRadius;
  orbitSpin.add(holder);

  const tilt = new THREE.Group();
  tilt.rotation.z = def.tilt;
  holder.add(tilt);

  const map = createBodyTexture(def);
  disposables.push(map);

  const geo = def.radius < 0.55 ? SMALL_SPHERE : UNIT_SPHERE;
  let mesh: THREE.Mesh;
  if (def.kind === "star") {
    const mat = new THREE.MeshBasicMaterial({ map, color: 0xfff3d0 });
    disposables.push(mat);
    mesh = new THREE.Mesh(geo, mat);
    mesh.scale.setScalar(def.radius);
    const corona = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({
        color: 0xffb14a,
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
      }),
    );
    corona.scale.setScalar(def.radius * 1.045);
    tilt.add(corona);
    disposables.push(corona.material as THREE.Material);

    const spriteMat = new THREE.SpriteMaterial({
      map: glowMap,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.92,
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.setScalar(def.radius * 8.4);
    holder.add(sprite);
    disposables.push(spriteMat);

    const light = new THREE.PointLight(0xfff1c4, 520, 0, 1.35);
    holder.add(light);
  } else {
    const mat = new THREE.MeshStandardMaterial({
      map,
      color: 0xffffff,
      roughness: def.roughness,
      metalness: def.metalness,
      bumpMap: map,
      bumpScale: def.kind === "terrestrial" || def.kind === "moon" ? 0.035 : 0.012,
    });
    disposables.push(mat);
    mesh = new THREE.Mesh(geo, mat);
    mesh.scale.setScalar(def.radius);
  }
  mesh.userData.bodyId = def.id;
  tilt.add(mesh);

  const pickMat = new THREE.MeshBasicMaterial({ visible: false });
  disposables.push(pickMat);
  const pick = new THREE.Mesh(PICK_SPHERE, pickMat);
  pick.scale.setScalar(Math.max(def.radius * 1.7, 0.72));
  pick.userData.bodyId = def.id;
  holder.add(pick);
  pickables.push(mesh, pick);

  let clouds: THREE.Mesh | undefined;
  if (def.clouds) {
    const cloudMap = createCloudTexture();
    const cloudMat = new THREE.MeshStandardMaterial({
      map: cloudMap,
      transparent: true,
      depthWrite: false,
      roughness: 1,
      metalness: 0,
    });
    disposables.push(cloudMap, cloudMat);
    clouds = new THREE.Mesh(geo, cloudMat);
    clouds.scale.setScalar(def.radius * 1.025);
    tilt.add(clouds);
  }

  if (def.rings) {
    const ringMap = createRingTexture(def.rings.color);
    const ringGeo = new THREE.RingGeometry(def.rings.inner * def.radius, def.rings.outer * def.radius, 96, 4);
    const ringMat = new THREE.MeshBasicMaterial({
      map: ringMap,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      opacity: 0.92,
    });
    disposables.push(ringMap, ringGeo, ringMat);
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    tilt.add(ring);
  }

  if (def.orbitRadius > 0 && !def.parentId) {
    const orbit = makeOrbitLine(def.orbitRadius, def.trailColor);
    incline.add(orbit);
    disposables.push(orbit.geometry, orbit.material as THREE.Material);
  }

  const labelEl = document.createElement("button");
  labelEl.type = "button";
  labelEl.className = "solar-label";
  labelEl.textContent = def.name;
  labelEl.addEventListener("click", (event) => {
    event.stopPropagation();
    useSolar.getState().focus(def.id);
  });
  const label = new CSS2DObject(labelEl);
  label.position.set(0, def.radius + 0.55, 0);
  holder.add(label);

  const trail = makeTrail(def.trailColor, disposables);

  return {
    def,
    mesh,
    tilt,
    holder,
    clouds,
    orbitRoot: incline,
    orbitSpin,
    label,
    trail,
    pick: [mesh, pick],
  };
}

function makeTrail(color: string, disposables: Array<{ dispose: () => void }>): TrailState {
  const max = TRAIL_LEN;
  const positions = new Float32Array(max * 3);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setDrawRange(0, 0);
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  });
  const line = new THREE.Line(geometry, material);
  line.frustumCulled = false;
  line.visible = true;
  disposables.push(geometry, material);
  return { line, positions, filled: 0, max };
}

function pushTrail(trail: TrailState, x: number, y: number, z: number) {
  const { positions, max } = trail;
  if (trail.filled < max) {
    const i = trail.filled * 3;
    positions[i] = x;
    positions[i + 1] = y;
    positions[i + 2] = z;
    trail.filled += 1;
    trail.line.geometry.setDrawRange(0, trail.filled);
  } else {
    positions.copyWithin(0, 3);
    const i = (max - 1) * 3;
    positions[i] = x;
    positions[i + 1] = y;
    positions[i + 2] = z;
  }
  const attr = trail.line.geometry.getAttribute("position");
  attr.needsUpdate = true;
}

function makeOrbitLine(radius: number, color: string) {
  const segs = 160;
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < segs; i++) {
    const a = (i / segs) * TAU;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(pts);
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
  });
  const line = new THREE.LineLoop(geometry, material);
  line.userData.isOrbit = true;
  line.frustumCulled = false;
  return line;
}

function makeStarfield(count: number, disposables: Array<{ dispose: () => void }>) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const radius = 170 + Math.random() * 140;
    const u = Math.random();
    const v = Math.random();
    const theta = TAU * u;
    const phi = Math.acos(2 * v - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
    const tint = Math.random();
    colors[i * 3] = 0.82 + tint * 0.18;
    colors[i * 3 + 1] = 0.86 + tint * 0.12;
    colors[i * 3 + 2] = 0.94 + Math.random() * 0.06;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: 0.52,
    vertexColors: true,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.92,
    depthWrite: false,
  });
  disposables.push(geometry, material);
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  return points;
}

function makeAsteroidBelt(disposables: Array<{ dispose: () => void }>) {
  const count = 420;
  const geo = new THREE.IcosahedronGeometry(1, 0);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x6b6560,
    roughness: 1,
    metalness: 0.08,
  });
  disposables.push(geo, mat);
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < count; i++) {
    const a = Math.random() * TAU;
    const r = 30.2 + Math.random() * 5.8;
    dummy.position.set(Math.cos(a) * r, (Math.random() - 0.5) * 0.55, Math.sin(a) * r);
    dummy.rotation.set(Math.random() * TAU, Math.random() * TAU, Math.random() * TAU);
    dummy.scale.setScalar(0.035 + Math.random() * 0.07);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
  mesh.frustumCulled = false;
  return mesh;
}
