/**
 * Cuts individual bougainvillea bracts and leaves out of the floral wordmark
 * PNG so the falling petals are the brand's own flowers.
 *
 *   node scripts/extract-petals.mjs
 *
 * Writes public/petals/*.png and lib/petal-sprites.ts.
 */
import sharp from "sharp";
import { mkdir, writeFile, rm } from "node:fs/promises";

const SRC = "assets/source/14-kiki-wordmark-flowers-transparent.png";
const OUT = "public/petals";
await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const N = W * H;
const px = (i) => [data[i * 4], data[i * 4 + 1], data[i * 4 + 2], data[i * 4 + 3]];

/* Pixel classes. */
const CLS = new Uint8Array(N); // 0 none, 1 bract (red/magenta), 2 leaf (green), 3 white
for (let i = 0; i < N; i++) {
  const [r, g, b, a] = px(i);
  if (a < 120) continue;
  if (r > 225 && g > 225 && b > 225) CLS[i] = 3;
  else if (r > 120 && r > g * 1.7 && r > b * 1.15) CLS[i] = 1;
  else if (g > 70 && g > r * 1.15 && g > b * 1.15) CLS[i] = 2;
}

/* Connected components (8-way) of a class. */
function components(cls) {
  const seen = new Uint8Array(N);
  const out = [];
  const stack = new Int32Array(N);
  for (let s = 0; s < N; s++) {
    if (CLS[s] !== cls || seen[s]) continue;
    let sp = 0;
    stack[sp++] = s;
    seen[s] = 1;
    const pixels = [];
    let x0 = W, x1 = 0, y0 = H, y1 = 0;
    while (sp) {
      const i = stack[--sp];
      pixels.push(i);
      const x = i % W, y = (i / W) | 0;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const j = ny * W + nx;
        if (!seen[j] && CLS[j] === cls) { seen[j] = 1; stack[sp++] = j; }
      }
    }
    out.push({ pixels, x0, x1, y0, y1, area: pixels.length });
  }
  return out;
}

/* Big white components are the letters and subtitle; small ones are flower centres. */
const whiteBig = new Uint8Array(N);
for (const c of components(3)) if (c.area > 1500) for (const i of c.pixels) whiteBig[i] = 1;

async function writeSprite(comp, name, pad = 3) {
  const x0 = Math.max(0, comp.x0 - pad), y0 = Math.max(0, comp.y0 - pad);
  const x1 = Math.min(W - 1, comp.x1 + pad), y1 = Math.min(H - 1, comp.y1 + pad);
  const w = x1 - x0 + 1, h = y1 - y0 + 1;
  // Membership: the component dilated by 2px, plus any small-white (flower centre) pixel inside the box.
  const member = new Uint8Array(w * h);
  for (const i of comp.pixels) {
    const x = i % W, y = (i / W) | 0;
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
      const nx = x + dx - x0, ny = y + dy - y0;
      if (nx >= 0 && ny >= 0 && nx < w && ny < h) member[ny * w + nx] = 1;
    }
  }
  const buf = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const si = (y + y0) * W + (x + x0);
    const [r, g, b, a] = px(si);
    const isSmallWhite = CLS[si] === 3 && !whiteBig[si];
    const keep = (member[y * w + x] && !whiteBig[si]) || isSmallWhite;
    const o = (y * w + x) * 4;
    buf[o] = r; buf[o + 1] = g; buf[o + 2] = b; buf[o + 3] = keep ? a : 0;
  }
  // Feather the alpha slightly so the cut edge is anti-aliased.
  const rgb = await sharp(buf, { raw: { width: w, height: h, channels: 4 } }).removeAlpha().raw().toBuffer();
  const alpha = await sharp(buf, { raw: { width: w, height: h, channels: 4 } }).extractChannel(3).blur(0.7).raw().toBuffer();
  await sharp(rgb, { raw: { width: w, height: h, channels: 3 } })
    .joinChannel(alpha, { raw: { width: w, height: h, channels: 1 } })
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}/${name}.png`);
  return { src: `/petals/${name}.png`, w, h };
}

/* Cuts that were sliced by a letter edge and read as fragments. Indices are 1-based, by area rank. */
const SKIP_BRACTS = new Set([11, 12, 13, 15]);
const SKIP_LEAVES = new Set([4, 8]);

const bracts = components(1)
  .filter((c) => c.area >= 500 && c.area <= 14000 && (c.x1 - c.x0) < 260 && (c.y1 - c.y0) < 260)
  .sort((a, b) => b.area - a.area)
  .slice(0, 16);
const leaves = components(2)
  .filter((c) => c.area >= 350 && c.area <= 6000)
  .sort((a, b) => b.area - a.area)
  .slice(0, 8);

const sprites = [];
let n = 0;
for (const c of bracts) {
  n++;
  if (SKIP_BRACTS.has(n)) continue;
  sprites.push({ kind: "bract", ...(await writeSprite(c, `bract-${String(n).padStart(2, "0")}`)) });
}
n = 0;
for (const c of leaves) {
  n++;
  if (SKIP_LEAVES.has(n)) continue;
  sprites.push({ kind: "leaf", ...(await writeSprite(c, `leaf-${String(n).padStart(2, "0")}`)) });
}

/* ---------------------------------------------------------------------------
 * Single bracts: carved out of the clusters with a smooth ovate mask, so the
 * falling petals are individual flowers with clean edges (no letter cuts).
 * Coordinates are in the cluster sprite's own pixels: base of the bract, its
 * tip, and its half-width.
 * ------------------------------------------------------------------------- */
const SINGLES = [
  { from: "bract-01", base: [98, 80], tip: [175, 76], hw: 33 },
  { from: "bract-02", base: [72, 68], tip: [2, 55], hw: 31 },
  { from: "bract-02", base: [88, 66], tip: [80, 4], hw: 23 },
  { from: "bract-02", base: [96, 76], tip: [104, 129], hw: 23 },
  { from: "bract-02", base: [126, 56], tip: [179, 21], hw: 21 },
  { from: "bract-04", base: [56, 82], tip: [40, 136], hw: 26 },
];

function ovatePath([bx, by], [tx, ty], hw) {
  const L = Math.hypot(tx - bx, ty - by);
  const dx = (tx - bx) / L;
  const dy = (ty - by) / L;
  const px = -dy;
  const py = dx;
  const pt = (along, across) =>
    `${(bx + dx * along + px * across).toFixed(1)} ${(by + dy * along + py * across).toFixed(1)}`;
  // Rounded base, widest part-way up, tapering to a point.
  return (
    `M ${pt(0, 0)} C ${pt(-0.04 * L, hw * 1.25)} ${pt(0.5 * L, hw * 1.2)} ${pt(L, 0)} ` +
    `C ${pt(0.5 * L, -hw * 1.2)} ${pt(-0.04 * L, -hw * 1.25)} ${pt(0, 0)} Z`
  );
}

const singles = [];
let si = 0;
for (const spec of SINGLES) {
  si++;
  const file = `${OUT}/${spec.from}.png`;
  const meta = await sharp(file).metadata();
  const svg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${meta.width}" height="${meta.height}">` +
      `<path d="${ovatePath(spec.base, spec.tip, spec.hw)}" fill="#fff"/></svg>`,
  );
  const name = `petal-${String(si).padStart(2, "0")}`;
  const cut = await sharp(file).composite([{ input: svg, blend: "dest-in" }]).png().toBuffer();
  const trimmed = await sharp(cut).trim({ threshold: 1 }).png({ compressionLevel: 9 }).toBuffer({ resolveWithObject: true });
  await sharp(trimmed.data).toFile(`${OUT}/${name}.png`);
  singles.push({ kind: "bract", src: `/petals/${name}.png`, w: trimmed.info.width, h: trimmed.info.height });
}

/* What actually falls: single bracts, the two clean buds and the one uncut leaf. Clusters stay on disk only. */
const keep = (name) => sprites.find((s) => s.src.endsWith(`/${name}.png`));
const falling = [
  ...singles,
  ...["bract-14", "bract-16"].map(keep).filter(Boolean).map((s) => ({ ...s, kind: "bud" })),
  ...["leaf-05"].map(keep).filter(Boolean),
];
/* Tint to KIKI's watercolour palette: soft pink bracts, pale olive leaf (matches their corner florals). */
const tinted = [];
for (const s of falling) {
  const input = `public${s.src}`;
  const name = s.src.replace("/petals/", "").replace(".png", "");
  const out = `${OUT}/${name}-soft.png`;
  const mod = s.kind === "leaf" ? { brightness: 1.45, saturation: 0.55, hue: -8 } : { brightness: 1.45, saturation: 0.72, hue: -20 };
  const { data: px, info: pi } = await sharp(input).ensureAlpha().modulate(mod).raw().toBuffer({ resolveWithObject: true });
  // Lift the shadows toward white so it reads as watercolour rather than photo.
  for (let i = 0; i < px.length; i += 4) for (let c = 0; c < 3; c++) px[i + c] = Math.round(px[i + c] * 0.78 + 255 * 0.22);
  await sharp(px, { raw: { width: pi.width, height: pi.height, channels: 4 } }).png({ compressionLevel: 9 }).toFile(out);
  tinted.push({ ...s, src: `/petals/${name}-soft.png` });
}
sprites.length = 0;
sprites.push(...tinted);

const ts = `/** GENERATED by scripts/extract-petals.mjs from the floral wordmark. Do not edit by hand. */
export type SpriteKind = "bract" | "bud" | "leaf";
export interface PetalSprite { kind: SpriteKind; src: string; w: number; h: number }
export const PETAL_SPRITES: readonly PetalSprite[] = ${JSON.stringify(sprites, null, 2)};
`;
await writeFile("lib/petal-sprites.ts", ts);
console.log(`wrote ${sprites.length} falling sprites`);
console.table(sprites.map((s) => ({ kind: s.kind, src: s.src, w: s.w, h: s.h })));
