/**
 * Converts the supplied photography in assets/source into the images the site
 * loads. Re-run after replacing any source file.
 *
 *   node scripts/import-assets.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "assets/source";
const jpeg = { quality: 84, mozjpeg: true };
await mkdir("public/images/letters", { recursive: true });

async function out(input, file, opts = {}) {
  let img = sharp(`${SRC}/${input}`);
  const meta = await img.metadata();
  if (opts.crop) {
    const c = opts.crop(meta.width, meta.height);
    img = img.extract({ left: Math.round(c.left), top: Math.round(c.top), width: Math.round(c.width), height: Math.round(c.height) });
  }
  if (opts.width) img = img.resize({ width: opts.width, withoutEnlargement: true, kernel: "lanczos3" });
  if (opts.height) img = img.resize({ height: opts.height, withoutEnlargement: true, kernel: "lanczos3" });
  await img.jpeg(jpeg).toFile(file);
  console.log("wrote", file);
}

await out("01-kiki-hero-restaurant.png", "public/images/hero.jpg", { width: 2560 });

await out("02-letter-k-chef-rose.png", "public/images/letters/k1.jpg", { height: 1200 });
await out("03-letter-i-daytime-dining.png", "public/images/letters/i1.jpg", { height: 1200 });
await out("04-letter-k-champagne.png", "public/images/letters/k2.jpg", { height: 1200 });
await out("05-letter-i-nightlife.png", "public/images/letters/i2.jpg", { height: 1200 });

await out("06-private-events-table.png", "public/images/long-table.jpg", { width: 1800 });
await out("09-meet-me-at-kiki-heart.png", "public/images/heart.jpg", { width: 1200 });
await out("12-nightlife-wide-banner.png", "public/images/nightlife.jpg", { width: 2560 });

// Champagne: the right side of the sunset table, roughly 3:4.
await out("10-private-events-sunset-table.png", "public/images/champagne.jpg", {
  crop: (w, h) => ({ left: w * 0.6, top: h * 0.16, width: w * 0.4, height: h * 0.84 }),
  width: 1000,
});

// Waterfront view for the right of the wheel section (full frame; cropped by CSS).
await out("11-miami-river-waterfront.png", "public/images/marina.jpg", { width: 1600 });

// Wheel centre: full day and full night images; the wheel crossfades between them as it turns.
for (const [src, out] of [["07-wheel-day-dining.png", "wheel-day.jpg"], ["08-wheel-night-party.png", "wheel-night.jpg"]]) {
  await sharp(`${SRC}/${src}`).resize({ width: 1100, height: 1100, fit: "cover", position: "centre" }).jpeg(jpeg).toFile(`public/images/${out}`);
  console.log("wrote public/images/" + out);
}

// Legacy split composite (kept for the reduced-motion fallback): day on the left, night on the right.
const half = (f) => sharp(`${SRC}/${f}`).resize({ width: 600, height: 1200, fit: "cover", position: "centre" }).toBuffer();
const [day, night] = await Promise.all([half("07-wheel-day-dining.png"), half("08-wheel-night-party.png")]);
await sharp({ create: { width: 1200, height: 1200, channels: 3, background: "#ffffff" } })
  .composite([{ input: day, left: 0, top: 0 }, { input: night, left: 600, top: 0 }])
  .jpeg(jpeg)
  .toFile("public/images/wheel-center.jpg");
console.log("wrote public/images/wheel-center.jpg");

// Pre-blurred hero for the scroll transition (opacity crossfade only, no per-frame blur).
await sharp(`${SRC}/01-kiki-hero-restaurant.png`)
  .resize({ width: 960, kernel: "lanczos3" })
  .blur(22)
  .modulate({ brightness: 1.06, saturation: 0.92 })
  .jpeg({ quality: 78, mozjpeg: true })
  .toFile("public/images/hero-blur.jpg");
console.log("wrote public/images/hero-blur.jpg");
