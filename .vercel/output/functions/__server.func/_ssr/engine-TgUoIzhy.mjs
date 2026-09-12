import { n as useSolar, r as BODIES } from "./routes-f_yDpZwX.mjs";
import { A as Sprite, C as Points, D as SRGBColorSpace, E as RingGeometry, M as Timer, N as Vector2, O as Scene, P as Vector3, S as PointLight, T as Raycaster, _ as Mesh, a as AmbientLight, b as Object3D, c as CanvasTexture, d as HemisphereLight, f as IcosahedronGeometry, g as LineLoop, h as LineBasicMaterial, i as WebGLRenderer, j as SpriteMaterial, k as SphereGeometry, l as Color, m as Line, n as CSS2DRenderer, o as BufferAttribute, p as InstancedMesh, r as OrbitControls, s as BufferGeometry, t as CSS2DObject, u as Group, v as MeshBasicMaterial, w as PointsMaterial, x as PerspectiveCamera, y as MeshStandardMaterial } from "../_libs/three.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/engine-TgUoIzhy.js
function hash(ix, iy) {
	const n = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453;
	return n - Math.floor(n);
}
function noise(x, y) {
	const ix = Math.floor(x);
	const iy = Math.floor(y);
	const fx = x - ix;
	const fy = y - iy;
	const ux = fx * fx * (3 - 2 * fx);
	const uy = fy * fy * (3 - 2 * fy);
	return (1 - uy) * ((1 - ux) * hash(ix, iy) + ux * hash(ix + 1, iy)) + uy * ((1 - ux) * hash(ix, iy + 1) + ux * hash(ix + 1, iy + 1));
}
function fbm(x, y, octaves = 5) {
	let value = 0;
	let amp = .5;
	for (let i = 0; i < octaves; i++) {
		value += amp * noise(x, y);
		x *= 2;
		y *= 2;
		amp *= .5;
	}
	return value;
}
function lerp(a, b, t) {
	return a + (b - a) * t;
}
function mixRgb(a, b, t) {
	return [
		lerp(a[0], b[0], t),
		lerp(a[1], b[1], t),
		lerp(a[2], b[2], t)
	];
}
function makeCanvasTexture(width, paint, height = width) {
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d", { alpha: true });
	if (!ctx) throw new Error("Canvas 2D unavailable");
	paint(ctx, width, height);
	const texture = new CanvasTexture(canvas);
	texture.colorSpace = SRGBColorSpace;
	texture.anisotropy = 8;
	texture.needsUpdate = true;
	return texture;
}
function fillNoisePlanet(ctx, w, h, dark, light, scale, craters) {
	const img = ctx.createImageData(w, h);
	const data = img.data;
	for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
		const c = mixRgb(dark, light, fbm(x * scale, y * scale, 4));
		const i = (y * w + x) * 4;
		data[i] = c[0];
		data[i + 1] = c[1];
		data[i + 2] = c[2];
		data[i + 3] = 255;
	}
	ctx.putImageData(img, 0, 0);
	if (!craters) return;
	for (let i = 0; i < 40; i++) {
		const x = Math.random() * w;
		const y = Math.random() * h;
		const r = 2 + Math.random() * (w * .05);
		ctx.fillStyle = `rgba(0,0,0,${.12 + Math.random() * .22})`;
		ctx.beginPath();
		ctx.ellipse(x, y, r, r * .72, 0, 0, Math.PI * 2);
		ctx.fill();
	}
}
function paintEarth(ctx, w, h) {
	const img = ctx.createImageData(w, h);
	const data = img.data;
	const ocean = [
		18,
		62,
		122
	];
	const ocean2 = [
		42,
		110,
		168
	];
	const land = [
		62,
		112,
		64
	];
	const desert = [
		168,
		142,
		86
	];
	const ice = [
		232,
		238,
		244
	];
	for (let y = 0; y < h; y++) {
		const lat = y / h;
		for (let x = 0; x < w; x++) {
			const n = fbm(x * .018, y * .032, 5);
			const n2 = fbm(x * .04 + 40, y * .04, 3);
			const isLand = n > .52;
			let c;
			if (lat < .08 || lat > .92 || lat < .14 && n2 > .55 || lat > .86 && n2 > .55) c = ice;
			else if (isLand) c = n2 > .62 ? desert : land;
			else c = mixRgb(ocean, ocean2, n);
			const i = (y * w + x) * 4;
			data[i] = c[0];
			data[i + 1] = c[1];
			data[i + 2] = c[2];
			data[i + 3] = 255;
		}
	}
	ctx.putImageData(img, 0, 0);
}
function paintGasGiant(ctx, w, h, bands, spot) {
	const img = ctx.createImageData(w, h);
	const data = img.data;
	for (let y = 0; y < h; y++) {
		const ny = y / h;
		const wave = Math.sin(ny * Math.PI * 14) * .5 + .5;
		const swirl = fbm(10, ny * 18, 3);
		const t = (wave * .72 + swirl * .28) * (bands.length - 1.001);
		const i0 = Math.floor(t);
		const i1 = Math.min(i0 + 1, bands.length - 1);
		const c = mixRgb(bands[i0], bands[i1], t - i0);
		for (let x = 0; x < w; x++) {
			const jitter = (fbm(x * .02, y * .08, 2) - .5) * 18;
			const i = (y * w + x) * 4;
			data[i] = Math.max(0, Math.min(255, c[0] + jitter));
			data[i + 1] = Math.max(0, Math.min(255, c[1] + jitter * .7));
			data[i + 2] = Math.max(0, Math.min(255, c[2] + jitter * .4));
			data[i + 3] = 255;
		}
	}
	ctx.putImageData(img, 0, 0);
	if (!spot) return;
	const grd = ctx.createRadialGradient(spot.x * w, spot.y * h, 2, spot.x * w, spot.y * h, spot.rx * w);
	grd.addColorStop(0, `rgba(${spot.color[0]},${spot.color[1]},${spot.color[2]},0.95)`);
	grd.addColorStop(1, "rgba(0,0,0,0)");
	ctx.fillStyle = grd;
	ctx.beginPath();
	ctx.ellipse(spot.x * w, spot.y * h, spot.rx * w, spot.ry * h, -.3, 0, Math.PI * 2);
	ctx.fill();
}
function paintSun(ctx, w, h) {
	const img = ctx.createImageData(w, h);
	const data = img.data;
	const core = [
		255,
		244,
		196
	];
	const limb = [
		255,
		164,
		64
	];
	for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
		const c = mixRgb(limb, core, .35 + fbm(x * .045, y * .045, 4) * .65);
		const i = (y * w + x) * 4;
		data[i] = c[0];
		data[i + 1] = c[1];
		data[i + 2] = c[2];
		data[i + 3] = 255;
	}
	ctx.putImageData(img, 0, 0);
}
function createBodyTexture(body) {
	const size = body.kind === "star" || body.radius > 1.4 || body.id === "earth" ? 512 : 256;
	switch (body.id) {
		case "sun": return makeCanvasTexture(size, paintSun);
		case "earth": return makeCanvasTexture(size, paintEarth);
		case "jupiter": return makeCanvasTexture(size, (ctx, w, h) => paintGasGiant(ctx, w, h, [
			[
				210,
				176,
				128
			],
			[
				186,
				142,
				96
			],
			[
				232,
				210,
				170
			],
			[
				168,
				118,
				78
			],
			[
				220,
				188,
				142
			],
			[
				150,
				102,
				70
			]
		], {
			x: .32,
			y: .6,
			rx: .08,
			ry: .05,
			color: [
				176,
				72,
				48
			]
		}));
		case "saturn": return makeCanvasTexture(size, (ctx, w, h) => paintGasGiant(ctx, w, h, [
			[
				230,
				210,
				164
			],
			[
				210,
				186,
				136
			],
			[
				236,
				220,
				182
			],
			[
				196,
				168,
				120
			],
			[
				224,
				204,
				160
			]
		]));
		case "uranus": return makeCanvasTexture(size, (ctx, w, h) => paintGasGiant(ctx, w, h, [
			[
				154,
				206,
				210
			],
			[
				122,
				186,
				194
			],
			[
				176,
				220,
				222
			],
			[
				108,
				168,
				180
			]
		]));
		case "neptune": return makeCanvasTexture(size, (ctx, w, h) => paintGasGiant(ctx, w, h, [
			[
				52,
				86,
				168
			],
			[
				70,
				110,
				196
			],
			[
				40,
				72,
				150
			],
			[
				88,
				130,
				210
			]
		]));
		case "mars": return makeCanvasTexture(size, (ctx, w, h) => {
			fillNoisePlanet(ctx, w, h, [
				110,
				48,
				28
			], [
				196,
				118,
				78
			], .03, true);
			ctx.fillStyle = "rgba(236,240,246,0.85)";
			ctx.fillRect(0, 0, w, h * .07);
			ctx.fillRect(0, h * .93, w, h * .07);
		});
		case "venus": return makeCanvasTexture(size, (ctx, w, h) => fillNoisePlanet(ctx, w, h, [
			196,
			164,
			110
		], [
			236,
			220,
			186
		], .025, false));
		case "mercury":
		case "moon": return makeCanvasTexture(size, (ctx, w, h) => fillNoisePlanet(ctx, w, h, [
			72,
			68,
			64
		], [
			168,
			160,
			150
		], .05, true));
		default: return makeCanvasTexture(size, (ctx, w, h) => fillNoisePlanet(ctx, w, h, [
			80,
			80,
			86
		], [
			180,
			180,
			188
		], .04, true));
	}
}
function createCloudTexture() {
	return makeCanvasTexture(512, (ctx, w, h) => {
		const img = ctx.createImageData(w, h);
		const data = img.data;
		for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
			const n = fbm(x * .03, y * .05, 4);
			const a = n > .58 ? Math.min(220, (n - .58) * 900) : 0;
			const i = (y * w + x) * 4;
			data[i] = 245;
			data[i + 1] = 248;
			data[i + 2] = 252;
			data[i + 3] = a;
		}
		ctx.putImageData(img, 0, 0);
	});
}
function createRingTexture(tint) {
	const color = new Color(tint);
	return makeCanvasTexture(1024, (ctx, w, h) => {
		const img = ctx.createImageData(w, h);
		const data = img.data;
		for (let y = 0; y < h; y++) {
			const v = y / h;
			const cassini = Math.abs(v - .62) < .035;
			const band = .35 + .65 * (.5 + .5 * Math.sin(v * 42));
			const n = fbm(v * 40, 2, 3);
			const alpha = cassini ? 12 : Math.floor((.25 + band * .55 + n * .2) * 255);
			for (let x = 0; x < w; x++) {
				const i = (y * w + x) * 4;
				const spoke = .85 + .15 * noise(x * .08, v * 12);
				data[i] = Math.floor(color.r * 255 * spoke);
				data[i + 1] = Math.floor(color.g * 255 * spoke);
				data[i + 2] = Math.floor(color.b * 255 * spoke);
				data[i + 3] = alpha;
			}
		}
		ctx.putImageData(img, 0, 0);
	}, 128);
}
function createGlowTexture() {
	return makeCanvasTexture(256, (ctx, w) => {
		const g = ctx.createRadialGradient(w / 2, w / 2, 8, w / 2, w / 2, w / 2);
		g.addColorStop(0, "rgba(255,244,200,0.95)");
		g.addColorStop(.18, "rgba(255,186,80,0.55)");
		g.addColorStop(.42, "rgba(255,140,40,0.16)");
		g.addColorStop(1, "rgba(255,120,20,0)");
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, w, w);
	});
}
var TAU = Math.PI * 2;
var OVERVIEW = new Vector3(20, 30, 74);
var ORIGIN = new Vector3();
var _world = new Vector3();
var _delta = new Vector3();
var _desired = new Vector3();
var _ndc = new Vector2();
var TRAIL_LEN = 160;
var UNIT_SPHERE = new SphereGeometry(1, 48, 32);
var SMALL_SPHERE = new SphereGeometry(1, 32, 24);
var PICK_SPHERE = new SphereGeometry(1, 12, 10);
function createHeliosEngine(canvas, host) {
	const renderer = new WebGLRenderer({
		canvas,
		antialias: true,
		alpha: false,
		powerPreference: "high-performance"
	});
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
	renderer.setClearColor(329226, 1);
	renderer.outputColorSpace = SRGBColorSpace;
	renderer.toneMapping = 4;
	renderer.toneMappingExposure = 1.05;
	const scene = new Scene();
	const camera = new PerspectiveCamera(42, 1, .12, 520);
	camera.position.copy(OVERVIEW);
	const controls = new OrbitControls(camera, canvas);
	controls.enableDamping = true;
	controls.dampingFactor = .07;
	controls.enablePan = false;
	controls.minDistance = 14;
	controls.maxDistance = 190;
	controls.rotateSpeed = .58;
	controls.zoomSpeed = .9;
	controls.autoRotateSpeed = .22;
	controls.target.set(0, 0, 0);
	const labelRenderer = new CSS2DRenderer();
	labelRenderer.domElement.className = "solar-labels";
	host.appendChild(labelRenderer.domElement);
	const disposables = [
		renderer,
		UNIT_SPHERE,
		SMALL_SPHERE,
		PICK_SPHERE
	];
	const runtimes = /* @__PURE__ */ new Map();
	const pickables = [];
	scene.add(new AmbientLight(12109012, .045));
	scene.add(new HemisphereLight(1844275, 328965, .16));
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
		if (parentId) runtimes.get(parentId)?.holder.add(runtime.orbitRoot);
		else scene.add(runtime.orbitRoot);
		scene.add(runtime.trail.line);
	}
	const raycaster = new Raycaster();
	raycaster.params.Line = { threshold: .2 };
	const pointer = {
		x: 0,
		y: 0,
		downX: 0,
		downY: 0,
		dragging: false,
		active: false
	};
	let hoverId = null;
	let simElapsed = 0;
	let timeAcc = 0;
	let approaching = false;
	let approachUntil = 0;
	const timer = new Timer();
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
	function pointerNdc(event) {
		const rect = canvas.getBoundingClientRect();
		_ndc.x = (event.clientX - rect.left) / rect.width * 2 - 1;
		_ndc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
	}
	function hitBody(event) {
		pointerNdc(event);
		raycaster.setFromCamera(_ndc, camera);
		const id = raycaster.intersectObjects(pickables, false)[0]?.object.userData.bodyId;
		return typeof id === "string" ? id : null;
	}
	function onPointerDown(event) {
		if (event.button !== 0) return;
		pointer.active = true;
		pointer.dragging = false;
		pointer.downX = event.clientX;
		pointer.downY = event.clientY;
		canvas.setPointerCapture(event.pointerId);
	}
	function onPointerMove(event) {
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
	function onPointerUp(event) {
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
	function updateOrbits(elapsed, spinDt) {
		for (const runtime of runtimes.values()) {
			const { def } = runtime;
			if (def.orbitRadius > 0) runtime.orbitSpin.rotation.y = def.phase + elapsed / def.period * TAU;
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
	function updateCamera(dt) {
		const { focusedId } = useSolar.getState();
		const k = 1 - Math.exp(-3.5 * dt);
		const now = performance.now();
		const runtime = focusedId ? runtimes.get(focusedId) : void 0;
		if (runtime) {
			runtime.mesh.getWorldPosition(_world);
			const dist = runtime.def.radius * (runtime.def.kind === "star" ? 5.4 : 7.1) + (runtime.def.kind === "star" ? 9 : 3.2);
			controls.minDistance = Math.max(runtime.def.radius * 2.3, 1.2);
			controls.maxDistance = 190;
			if (approaching && now < approachUntil) {
				controls.target.lerp(_world, k);
				_desired.copy(camera.position).sub(controls.target);
				if (_desired.lengthSq() < 1e-5) _desired.set(.42, .3, 1);
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
			} else approaching = false;
		}
	}
	function updateLabels() {
		const { showLabels, focusedId, selectedId, showOrbits, showTrails } = useSolar.getState();
		const camDist = camera.position.length();
		const compact = host.clientWidth < 720;
		for (const runtime of runtimes.values()) {
			const { def } = runtime;
			const isMoon = def.kind === "moon";
			const related = focusedId === def.id || selectedId === def.id || focusedId === def.parentId || selectedId === def.parentId;
			const far = camDist > 95 && def.kind !== "star";
			runtime.label.visible = showLabels && (!isMoon || related) && (!far || related) && (!compact || related);
			runtime.label.element.classList.toggle("is-active", selectedId === def.id);
			runtime.trail.line.visible = showTrails && def.kind !== "star";
		}
		scene.traverse((obj) => {
			if (obj.userData.isOrbit) obj.visible = showOrbits;
		});
	}
	function tick() {
		timer.update();
		const dt = Math.min(timer.getDelta(), .1);
		const ui = useSolar.getState();
		if (!ui.paused) {
			const step = dt * ui.speed;
			simElapsed += step;
			timeAcc += dt;
			if (timeAcc > .2) {
				timeAcc = 0;
				useSolar.setState({ elapsed: simElapsed });
			}
			updateOrbits(simElapsed, step);
			asteroidBelt.rotation.y = simElapsed * .012;
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
	return { dispose() {
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
	} };
}
function buildBody(def, glowMap, disposables, pickables) {
	const incline = new Group();
	incline.rotation.z = def.inclination;
	const orbitSpin = new Group();
	incline.add(orbitSpin);
	const holder = new Group();
	holder.position.x = def.orbitRadius;
	orbitSpin.add(holder);
	const tilt = new Group();
	tilt.rotation.z = def.tilt;
	holder.add(tilt);
	const map = createBodyTexture(def);
	disposables.push(map);
	const geo = def.radius < .55 ? SMALL_SPHERE : UNIT_SPHERE;
	let mesh;
	if (def.kind === "star") {
		const mat = new MeshBasicMaterial({
			map,
			color: 16774096
		});
		disposables.push(mat);
		mesh = new Mesh(geo, mat);
		mesh.scale.setScalar(def.radius);
		const corona = new Mesh(geo, new MeshBasicMaterial({
			color: 16757066,
			transparent: true,
			opacity: .28,
			depthWrite: false
		}));
		corona.scale.setScalar(def.radius * 1.045);
		tilt.add(corona);
		disposables.push(corona.material);
		const spriteMat = new SpriteMaterial({
			map: glowMap,
			blending: 2,
			depthWrite: false,
			transparent: true,
			opacity: .92
		});
		const sprite = new Sprite(spriteMat);
		sprite.scale.setScalar(def.radius * 8.4);
		holder.add(sprite);
		disposables.push(spriteMat);
		const light = new PointLight(16773572, 520, 0, 1.35);
		holder.add(light);
	} else {
		const mat = new MeshStandardMaterial({
			map,
			color: 16777215,
			roughness: def.roughness,
			metalness: def.metalness,
			bumpMap: map,
			bumpScale: def.kind === "terrestrial" || def.kind === "moon" ? .035 : .012
		});
		disposables.push(mat);
		mesh = new Mesh(geo, mat);
		mesh.scale.setScalar(def.radius);
	}
	mesh.userData.bodyId = def.id;
	tilt.add(mesh);
	const pickMat = new MeshBasicMaterial({ visible: false });
	disposables.push(pickMat);
	const pick = new Mesh(PICK_SPHERE, pickMat);
	pick.scale.setScalar(Math.max(def.radius * 1.7, .72));
	pick.userData.bodyId = def.id;
	holder.add(pick);
	pickables.push(mesh, pick);
	let clouds;
	if (def.clouds) {
		const cloudMap = createCloudTexture();
		const cloudMat = new MeshStandardMaterial({
			map: cloudMap,
			transparent: true,
			depthWrite: false,
			roughness: 1,
			metalness: 0
		});
		disposables.push(cloudMap, cloudMat);
		clouds = new Mesh(geo, cloudMat);
		clouds.scale.setScalar(def.radius * 1.025);
		tilt.add(clouds);
	}
	if (def.rings) {
		const ringMap = createRingTexture(def.rings.color);
		const ringGeo = new RingGeometry(def.rings.inner * def.radius, def.rings.outer * def.radius, 96, 4);
		const ringMat = new MeshBasicMaterial({
			map: ringMap,
			side: 2,
			transparent: true,
			depthWrite: false,
			opacity: .92
		});
		disposables.push(ringMap, ringGeo, ringMat);
		const ring = new Mesh(ringGeo, ringMat);
		ring.rotation.x = Math.PI / 2;
		tilt.add(ring);
	}
	if (def.orbitRadius > 0 && !def.parentId) {
		const orbit = makeOrbitLine(def.orbitRadius, def.trailColor);
		incline.add(orbit);
		disposables.push(orbit.geometry, orbit.material);
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
	label.position.set(0, def.radius + .55, 0);
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
		pick: [mesh, pick]
	};
}
function makeTrail(color, disposables) {
	const max = TRAIL_LEN;
	const positions = /* @__PURE__ */ new Float32Array(480);
	const geometry = new BufferGeometry();
	geometry.setAttribute("position", new BufferAttribute(positions, 3));
	geometry.setDrawRange(0, 0);
	const material = new LineBasicMaterial({
		color,
		transparent: true,
		opacity: .55,
		depthWrite: false
	});
	const line = new Line(geometry, material);
	line.frustumCulled = false;
	line.visible = true;
	disposables.push(geometry, material);
	return {
		line,
		positions,
		filled: 0,
		max
	};
}
function pushTrail(trail, x, y, z) {
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
function makeOrbitLine(radius, color) {
	const segs = 160;
	const pts = [];
	for (let i = 0; i < segs; i++) {
		const a = i / segs * TAU;
		pts.push(new Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
	}
	const geometry = new BufferGeometry().setFromPoints(pts);
	const material = new LineBasicMaterial({
		color,
		transparent: true,
		opacity: .22,
		depthWrite: false
	});
	const line = new LineLoop(geometry, material);
	line.userData.isOrbit = true;
	line.frustumCulled = false;
	return line;
}
function makeStarfield(count, disposables) {
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
		colors[i * 3] = .82 + tint * .18;
		colors[i * 3 + 1] = .86 + tint * .12;
		colors[i * 3 + 2] = .94 + Math.random() * .06;
	}
	const geometry = new BufferGeometry();
	geometry.setAttribute("position", new BufferAttribute(positions, 3));
	geometry.setAttribute("color", new BufferAttribute(colors, 3));
	const material = new PointsMaterial({
		size: .52,
		vertexColors: true,
		sizeAttenuation: true,
		transparent: true,
		opacity: .92,
		depthWrite: false
	});
	disposables.push(geometry, material);
	const points = new Points(geometry, material);
	points.frustumCulled = false;
	return points;
}
function makeAsteroidBelt(disposables) {
	const count = 420;
	const geo = new IcosahedronGeometry(1, 0);
	const mat = new MeshStandardMaterial({
		color: 7038304,
		roughness: 1,
		metalness: .08
	});
	disposables.push(geo, mat);
	const mesh = new InstancedMesh(geo, mat, count);
	const dummy = new Object3D();
	for (let i = 0; i < count; i++) {
		const a = Math.random() * TAU;
		const r = 30.2 + Math.random() * 5.8;
		dummy.position.set(Math.cos(a) * r, (Math.random() - .5) * .55, Math.sin(a) * r);
		dummy.rotation.set(Math.random() * TAU, Math.random() * TAU, Math.random() * TAU);
		dummy.scale.setScalar(.035 + Math.random() * .07);
		dummy.updateMatrix();
		mesh.setMatrixAt(i, dummy.matrix);
	}
	mesh.instanceMatrix.needsUpdate = true;
	mesh.frustumCulled = false;
	return mesh;
}
//#endregion
export { createHeliosEngine };
