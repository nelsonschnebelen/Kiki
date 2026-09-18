/**
 * Measures the supplied wordmark PNGs and derives everything the site needs
 * to use the real logo letterforms:
 *   - lib/brand-geometry.ts   letter box + per-letter slots (normalised 0..1)
 *   - public/brand/*.png      wordmark, floral wordmark, per-letter masks and dilated outline masks
 *
 *   node scripts/brand-geometry.mjs
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const PLAIN = "assets/source/13-kiki-wordmark-transparent.png";
const FLORAL = "assets/source/14-kiki-wordmark-flowers-transparent.png";
const OUTLINE_PAD = 14; // px of dilation room around each letter mask, at source scale
await mkdir("public/brand", { recursive: true });

/** Returns rows/cols projections of "white letter" pixels (opaque and bright). */
async function project(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const rows = new Uint32Array(H);
  const cols = new Uint32Array(W);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      if (data[i + 3] > 200 && data[i] > 225 && data[i + 1] > 225 && data[i + 2] > 225) {
        rows[y]++;
        cols[x]++;
      }
    }
  }
  return { W, H, rows, cols };
}

/** First contiguous band of rows whose white count exceeds `frac` of the width. */
function rowBand(rows, W, frac) {
  const th = W * frac;
  let y0 = -1;
  for (let y = 0; y < rows.length; y++) {
    if (rows[y] > th && y0 < 0) y0 = y;
    if (rows[y] <= th && y0 >= 0) return { y0, y1: y - 1 };
  }
  return { y0, y1: rows.length - 1 };
}

/** Column runs (within the letter rows) whose white count exceeds `frac` of the band height. */
async function letterSlots(file, band, frac, minWidth) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W } = info;
  const cols = new Uint32Array(W);
  for (let y = band.y0; y <= band.y1; y++)
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      if (data[i + 3] > 200 && data[i] > 225 && data[i + 1] > 225 && data[i + 2] > 225) cols[x]++;
    }
  const th = (band.y1 - band.y0 + 1) * frac;
  const runs = [];
  let x0 = -1;
  for (let x = 0; x <= W; x++) {
    const on = x < W && cols[x] > th;
    if (on && x0 < 0) x0 = x;
    if (!on && x0 >= 0) {
      if (x - x0 >= minWidth) runs.push({ x0, x1: x - 1 });
      x0 = -1;
    }
  }
  // Merge runs separated by tiny gaps (serifs of one letter).
  const merged = [];
  for (const r of runs) {
    const last = merged[merged.length - 1];
    if (last && r.x0 - last.x1 < 18) last.x1 = r.x1;
    else merged.push({ ...r });
  }
  return merged;
}

const plain = await project(PLAIN);
const plainBand = rowBand(plain.rows, plain.W, 0.02);
let slots = await letterSlots(PLAIN, plainBand, 0.02, 20);
console.log("plain", plain.W, "x", plain.H, "letters rows", plainBand, "slots", slots);
if (slots.length !== 4) throw new Error(`expected 4 letter slots, found ${slots.length}: ${JSON.stringify(slots)}`);
// Trim the band to the actual ink rows of the letters (serif tips).
const lx = slots[0].x0;
const lx1 = slots[3].x1;
const ly = plainBand.y0;
const ly1 = plainBand.y1;
const lw = lx1 - lx + 1;
const lh = ly1 - ly + 1;

// Subtitle extent below the letters (fraction of letter height), for placing the hero tagline.
let lastInk = ly1;
for (let y = plain.H - 1; y > ly1; y--) if (plain.rows[y] > 0) { lastInk = y; break; }
const subtitleBottom = (lastInk - ly1) / lh;

// Floral letter box: align on the vertical stems, detected the same way in both images
// (flowers hide some serifs, so full ink extents are unreliable in the floral image).
const floral = await project(FLORAL);
const floralBand = rowBand(floral.rows, floral.W, 0.02);
const plainStems = await letterSlots(PLAIN, plainBand, 0.35, 20);
const floralStems = await letterSlots(FLORAL, floralBand, 0.35, 20);
console.log("floral", floral.W, "x", floral.H, "letters rows", floralBand);
console.log("plain stems", plainStems, "\nfloral stems", floralStems);
const pStemL = plainStems[0].x0, pStemR = plainStems[plainStems.length - 1].x1;
const fStemL = floralStems[0].x0, fStemR = floralStems[floralStems.length - 1].x1;
const fScale = (fStemR - fStemL) / (pStemR - pStemL);
const rowScale = (floralBand.y1 - floralBand.y0) / (ly1 - ly);
console.log("floral scale from stems", fScale.toFixed(4), "from rows", rowScale.toFixed(4));
const fLetter = { x: fStemL - (pStemL - lx) * fScale, y: floralBand.y0, w: lw * fScale, h: lh * fScale };
console.log("floral letter box", fLetter);

/* Per-letter masks (exact) and outline masks (dilated, with padding). */
const ids = ["k1", "i1", "k2", "i2"];
const slotMeta = [];
for (let i = 0; i < 4; i++) {
  const s = slots[i];
  const w = s.x1 - s.x0 + 1;
  await sharp(PLAIN).extract({ left: s.x0, top: ly, width: w, height: lh }).png().toFile(`public/brand/mask-${ids[i]}.png`);
  const P = OUTLINE_PAD;
  const alpha = await sharp(PLAIN)
    .extract({ left: s.x0, top: ly, width: w, height: lh })
    .extend({ top: P, bottom: P, left: P, right: P, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
    .extractChannel(3)
    .blur(5)
    .threshold(12)
    .toBuffer();
  await sharp({ create: { width: w + 2 * P, height: lh + 2 * P, channels: 3, background: "#ffffff" } })
    .joinChannel(alpha)
    .png()
    .toFile(`public/brand/outline-${ids[i]}.png`);
  slotMeta.push({ id: ids[i], x: (s.x0 - lx) / lw, w: w / lw });
}

await sharp(PLAIN).png({ compressionLevel: 9 }).toFile("public/brand/kiki-wordmark.png");
await sharp(FLORAL).png({ compressionLevel: 9 }).toFile("public/brand/kiki-wordmark-flowers.png");

const ts = `/**
 * GENERATED by scripts/brand-geometry.mjs from the supplied wordmark PNGs. Do not edit by hand.
 * All values are fractions of the KIKI letter box (the four letters' ink bounds in the plain wordmark).
 */
export const BRAND_GEOMETRY = {
  /** Letter box aspect: height / width. */
  letterAspect: ${(lh / lw).toFixed(5)},
  /** Per-letter slots inside the letter box. */
  slots: ${JSON.stringify(slotMeta)},
  /** Dilation padding of the outline masks, as a fraction of the letter box width/height. */
  outlinePad: { x: ${(OUTLINE_PAD / lw).toFixed(5)}, y: ${(OUTLINE_PAD / lh).toFixed(5)} },
  /** Plain wordmark (with "On the Miami River"): where the letter box sits inside the full image. */
  wordmark: { src: "/brand/kiki-wordmark.png", width: ${plain.W}, height: ${plain.H}, letter: { x: ${(lx / plain.W).toFixed(5)}, y: ${(ly / plain.H).toFixed(5)}, w: ${(lw / plain.W).toFixed(5)}, h: ${(lh / plain.H).toFixed(5)} }, subtitleBottom: ${subtitleBottom.toFixed(4)} },
  /** Floral wordmark and its flowers-only derivative: where the letter box sits inside the full image. */
  floral: { src: "/brand/kiki-wordmark-flowers.png", flowersSrc: "/brand/kiki-flowers-only.png", width: ${floral.W}, height: ${floral.H}, letter: { x: ${(fLetter.x / floral.W).toFixed(5)}, y: ${(fLetter.y / floral.H).toFixed(5)}, w: ${(fLetter.w / floral.W).toFixed(5)}, h: ${(fLetter.h / floral.H).toFixed(5)} } },
} as const;
`;
await writeFile("lib/brand-geometry.ts", ts);
console.log(ts);

/* ---------------------------------------------------------------------------
 * Flowers-only layer: the floral wordmark with the white letters and subtitle
 * removed, so the bougainvillea can stay pinned around the video letters.
 * ------------------------------------------------------------------------- */
{
  const { data, info } = await sharp(FLORAL).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: FW, height: FH } = info;
  const N = FW * FH;
  const isWhite = new Uint8Array(N);
  for (let i = 0; i < N; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2], a = data[i * 4 + 3];
    if (a > 40 && r > 215 && g > 215 && b > 215) isWhite[i] = 1;
  }
  // Connected white components; anything larger than a flower centre is type.
  const seen = new Uint8Array(N);
  const remove = new Uint8Array(N);
  const stack = new Int32Array(N);
  for (let s = 0; s < N; s++) {
    if (!isWhite[s] || seen[s]) continue;
    let sp = 0;
    stack[sp++] = s;
    seen[s] = 1;
    const comp = [];
    let y0 = FH, y1 = 0;
    while (sp) {
      const i = stack[--sp];
      comp.push(i);
      const x = i % FW, y = (i / FW) | 0;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= FW || ny >= FH) continue;
        const j = ny * FW + nx;
        if (!seen[j] && isWhite[j]) { seen[j] = 1; stack[sp++] = j; }
      }
    }
    if (comp.length > 400 || y1 - y0 > 22) for (const i of comp) remove[i] = 1;
  }
  // Dilate the removal by 3px to take the anti-aliased halo with it.
  const out = Buffer.from(data);
  for (let y = 0; y < FH; y++) for (let x = 0; x < FW; x++) {
    const i = y * FW + x;
    let hit = 0;
    for (let dy = -3; dy <= 3 && !hit; dy++) for (let dx = -3; dx <= 3; dx++) {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < FW && ny < FH && remove[ny * FW + nx]) { hit = 1; break; }
    }
    if (hit) out[i * 4 + 3] = 0;
  }
  await sharp(out, { raw: { width: FW, height: FH, channels: 4 } }).png({ compressionLevel: 9 }).toFile("public/brand/kiki-flowers-only.png");
  console.log("wrote public/brand/kiki-flowers-only.png");
}
