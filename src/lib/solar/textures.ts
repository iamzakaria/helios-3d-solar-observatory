import * as THREE from "three";
import type { BodyDef } from "./bodies";

function hash(ix: number, iy: number) {
  const n = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function noise(x: number, y: number) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  return (
    (1 - uy) * ((1 - ux) * hash(ix, iy) + ux * hash(ix + 1, iy)) +
    uy * ((1 - ux) * hash(ix, iy + 1) + ux * hash(ix + 1, iy + 1))
  );
}

function fbm(x: number, y: number, octaves = 5) {
  let value = 0;
  let amp = 0.5;
  for (let i = 0; i < octaves; i++) {
    value += amp * noise(x, y);
    x *= 2;
    y *= 2;
    amp *= 0.5;
  }
  return value;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function mixRgb(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

export function makeCanvasTexture(
  width: number,
  paint: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  height = width,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) throw new Error("Canvas 2D unavailable");
  paint(ctx, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function fillNoisePlanet(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  dark: [number, number, number],
  light: [number, number, number],
  scale: number,
  craters: boolean,
) {
  const img = ctx.createImageData(w, h);
  const data = img.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const n = fbm(x * scale, y * scale, 4);
      const c = mixRgb(dark, light, n);
      const i = (y * w + x) * 4;
      data[i] = c[0];
      data[i + 1] = c[1];
      data[i + 2] = c[2];
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  if (!craters) return;
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = 2 + Math.random() * (w * 0.05);
    ctx.fillStyle = `rgba(0,0,0,${0.12 + Math.random() * 0.22})`;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.72, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function paintEarth(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const img = ctx.createImageData(w, h);
  const data = img.data;
  const ocean: [number, number, number] = [18, 62, 122];
  const ocean2: [number, number, number] = [42, 110, 168];
  const land: [number, number, number] = [62, 112, 64];
  const desert: [number, number, number] = [168, 142, 86];
  const ice: [number, number, number] = [232, 238, 244];
  for (let y = 0; y < h; y++) {
    const lat = y / h;
    for (let x = 0; x < w; x++) {
      const n = fbm(x * 0.018, y * 0.032, 5);
      const n2 = fbm(x * 0.04 + 40, y * 0.04, 3);
      const isLand = n > 0.52;
      let c: [number, number, number];
      if (lat < 0.08 || lat > 0.92 || (lat < 0.14 && n2 > 0.55) || (lat > 0.86 && n2 > 0.55)) {
        c = ice;
      } else if (isLand) {
        c = n2 > 0.62 ? desert : land;
      } else {
        c = mixRgb(ocean, ocean2, n);
      }
      const i = (y * w + x) * 4;
      data[i] = c[0];
      data[i + 1] = c[1];
      data[i + 2] = c[2];
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

function paintGasGiant(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  bands: [number, number, number][],
  spot?: { x: number; y: number; rx: number; ry: number; color: [number, number, number] },
) {
  const img = ctx.createImageData(w, h);
  const data = img.data;
  for (let y = 0; y < h; y++) {
    const ny = y / h;
    const wave = Math.sin(ny * Math.PI * 14) * 0.5 + 0.5;
    const swirl = fbm(10, ny * 18, 3);
    const t = (wave * 0.72 + swirl * 0.28) * (bands.length - 1.001);
    const i0 = Math.floor(t);
    const i1 = Math.min(i0 + 1, bands.length - 1);
    const c = mixRgb(bands[i0]!, bands[i1]!, t - i0);
    for (let x = 0; x < w; x++) {
      const jitter = (fbm(x * 0.02, y * 0.08, 2) - 0.5) * 18;
      const i = (y * w + x) * 4;
      data[i] = Math.max(0, Math.min(255, c[0] + jitter));
      data[i + 1] = Math.max(0, Math.min(255, c[1] + jitter * 0.7));
      data[i + 2] = Math.max(0, Math.min(255, c[2] + jitter * 0.4));
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
  ctx.ellipse(spot.x * w, spot.y * h, spot.rx * w, spot.ry * h, -0.3, 0, Math.PI * 2);
  ctx.fill();
}

function paintSun(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const img = ctx.createImageData(w, h);
  const data = img.data;
  const core: [number, number, number] = [255, 244, 196];
  const limb: [number, number, number] = [255, 164, 64];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const n = fbm(x * 0.045, y * 0.045, 4);
      const c = mixRgb(limb, core, 0.35 + n * 0.65);
      const i = (y * w + x) * 4;
      data[i] = c[0];
      data[i + 1] = c[1];
      data[i + 2] = c[2];
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

export function createBodyTexture(body: BodyDef): THREE.CanvasTexture {
  const size = body.kind === "star" || body.radius > 1.4 || body.id === "earth" ? 512 : 256;
  switch (body.id) {
    case "sun":
      return makeCanvasTexture(size, paintSun);
    case "earth":
      return makeCanvasTexture(size, paintEarth);
    case "jupiter":
      return makeCanvasTexture(size, (ctx, w, h) =>
        paintGasGiant(
          ctx,
          w,
          h,
          [
            [210, 176, 128],
            [186, 142, 96],
            [232, 210, 170],
            [168, 118, 78],
            [220, 188, 142],
            [150, 102, 70],
          ],
          { x: 0.32, y: 0.6, rx: 0.08, ry: 0.05, color: [176, 72, 48] },
        ),
      );
    case "saturn":
      return makeCanvasTexture(size, (ctx, w, h) =>
        paintGasGiant(ctx, w, h, [
          [230, 210, 164],
          [210, 186, 136],
          [236, 220, 182],
          [196, 168, 120],
          [224, 204, 160],
        ]),
      );
    case "uranus":
      return makeCanvasTexture(size, (ctx, w, h) =>
        paintGasGiant(ctx, w, h, [
          [154, 206, 210],
          [122, 186, 194],
          [176, 220, 222],
          [108, 168, 180],
        ]),
      );
    case "neptune":
      return makeCanvasTexture(size, (ctx, w, h) =>
        paintGasGiant(ctx, w, h, [
          [52, 86, 168],
          [70, 110, 196],
          [40, 72, 150],
          [88, 130, 210],
        ]),
      );
    case "mars":
      return makeCanvasTexture(size, (ctx, w, h) => {
        fillNoisePlanet(ctx, w, h, [110, 48, 28], [196, 118, 78], 0.03, true);
        ctx.fillStyle = "rgba(236,240,246,0.85)";
        ctx.fillRect(0, 0, w, h * 0.07);
        ctx.fillRect(0, h * 0.93, w, h * 0.07);
      });
    case "venus":
      return makeCanvasTexture(size, (ctx, w, h) =>
        fillNoisePlanet(ctx, w, h, [196, 164, 110], [236, 220, 186], 0.025, false),
      );
    case "mercury":
    case "moon":
      return makeCanvasTexture(size, (ctx, w, h) =>
        fillNoisePlanet(ctx, w, h, [72, 68, 64], [168, 160, 150], 0.05, true),
      );
    default:
      return makeCanvasTexture(size, (ctx, w, h) =>
        fillNoisePlanet(ctx, w, h, [80, 80, 86], [180, 180, 188], 0.04, true),
      );
  }
}

export function createCloudTexture(): THREE.CanvasTexture {
  return makeCanvasTexture(512, (ctx, w, h) => {
    const img = ctx.createImageData(w, h);
    const data = img.data;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const n = fbm(x * 0.03, y * 0.05, 4);
        const a = n > 0.58 ? Math.min(220, (n - 0.58) * 900) : 0;
        const i = (y * w + x) * 4;
        data[i] = 245;
        data[i + 1] = 248;
        data[i + 2] = 252;
        data[i + 3] = a;
      }
    }
    ctx.putImageData(img, 0, 0);
  });
}

export function createRingTexture(tint: string): THREE.CanvasTexture {
  const color = new THREE.Color(tint);
  return makeCanvasTexture(
    1024,
    (ctx, w, h) => {
      const img = ctx.createImageData(w, h);
      const data = img.data;
      for (let y = 0; y < h; y++) {
        const v = y / h;
        const cassini = Math.abs(v - 0.62) < 0.035;
        const band = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(v * 42));
        const n = fbm(v * 40, 2, 3);
        const alpha = cassini ? 12 : Math.floor((0.25 + band * 0.55 + n * 0.2) * 255);
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          const spoke = 0.85 + 0.15 * noise(x * 0.08, v * 12);
          data[i] = Math.floor(color.r * 255 * spoke);
          data[i + 1] = Math.floor(color.g * 255 * spoke);
          data[i + 2] = Math.floor(color.b * 255 * spoke);
          data[i + 3] = alpha;
        }
      }
      ctx.putImageData(img, 0, 0);
    },
    128,
  );
}

export function createGlowTexture(): THREE.CanvasTexture {
  return makeCanvasTexture(256, (ctx, w) => {
    const g = ctx.createRadialGradient(w / 2, w / 2, 8, w / 2, w / 2, w / 2);
    g.addColorStop(0, "rgba(255,244,200,0.95)");
    g.addColorStop(0.18, "rgba(255,186,80,0.55)");
    g.addColorStop(0.42, "rgba(255,140,40,0.16)");
    g.addColorStop(1, "rgba(255,120,20,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, w);
  });
}
