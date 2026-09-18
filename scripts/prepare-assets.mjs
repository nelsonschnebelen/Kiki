/**
 * Interim photography: crops the supplied mockups into the images the site
 * expects, so the homepage renders with real KIKI imagery before the Higgsfield
 * assets land. Re-run any time; outputs are overwritten.
 *
 *   node scripts/prepare-assets.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const HERO = "assets/mockups/mock-hero.png"; // 957 x 1643
const FULL = "assets/mockups/mock-full-page.png"; // 941 x 1672

async function crop(input, region, file, { width } = {}) {
  await mkdir(path.dirname(file), { recursive: true });
  let img = sharp(input).extract(region);
  if (width) img = img.resize({ width, kernel: "lanczos3" });
  await img.jpeg({ quality: 84, mozjpeg: true }).toFile(file);
  console.log("wrote", file);
}

// Hero: the band beneath the mock's baked-in wordmark and button (no text).
// The mock also bakes in a scroll chevron over the sky; it is covered with a
// feathered patch of the neighbouring sky before the crop is saved.
{
  const region = { left: 0, top: 418, width: 957, height: 487 };
  const band = await sharp(HERO).extract(region).toBuffer();
  const patchW = 120;
  const patchH = 150;
  const feather = Buffer.from(
    `<svg width="${patchW}" height="${patchH}"><defs><radialGradient id="g" cx="50%" cy="50%" r="50%">` +
      `<stop offset="55%" stop-color="#fff"/><stop offset="100%" stop-color="#fff" stop-opacity="0"/>` +
      `</radialGradient></defs><rect width="${patchW}" height="${patchH}" fill="url(#g)"/></svg>`,
  );
  const patch = await sharp(band)
    .extract({ left: 330, top: 330, width: patchW, height: patchH })
    .blur(4)
    .ensureAlpha()
    .composite([{ input: feather, blend: "dest-in" }])
    .png()
    .toBuffer();
  await mkdir("public/images", { recursive: true });
  await sharp(band)
    .composite([{ input: patch, left: 420, top: 320 }])
    .resize({ width: 1920, kernel: "lanczos3" })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile("public/images/hero.jpg");
  console.log("wrote public/images/hero.jpg");
}

// Letter posters: chef pour, lunch, champagne, dancing.
await crop(HERO, { left: 10, top: 930, width: 320, height: 455 }, "public/images/letters/k1.jpg", { width: 720 });
await crop(HERO, { left: 322, top: 930, width: 190, height: 455 }, "public/images/letters/i1.jpg", { width: 480 });
await crop(HERO, { left: 490, top: 930, width: 300, height: 455 }, "public/images/letters/k2.jpg", { width: 720 });
await crop(HERO, { left: 775, top: 930, width: 182, height: 455 }, "public/images/letters/i2.jpg", { width: 480 });

// Wheel centre (left half day, right half night).
await crop(FULL, { left: 320, top: 840, width: 300, height: 300 }, "public/images/wheel-center.jpg", { width: 900 });

// Collage.
await crop(FULL, { left: 0, top: 1125, width: 290, height: 290 }, "public/images/heart.jpg", { width: 900 });
await crop(FULL, { left: 255, top: 1165, width: 500, height: 285 }, "public/images/long-table.jpg", { width: 1400 });
await crop(FULL, { left: 700, top: 1230, width: 241, height: 230 }, "public/images/champagne.jpg", { width: 800 });
await crop(FULL, { left: 855, top: 935, width: 86, height: 225 }, "public/images/vase.jpg", { width: 400 });

// Footer.
await crop(FULL, { left: 0, top: 1440, width: 941, height: 232 }, "public/images/nightlife.jpg", { width: 1920 });

console.log("done");
