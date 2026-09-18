/**
 * Vector-traces the supplied 500px KIKI logo so it stays crisp at any size.
 *
 *   node scripts/vectorize-logo.mjs
 *
 * Writes public/brand/kiki-logo.svg and assets/source/15-kiki-logo-traced.png
 * (2400px wide, white on transparent), which scripts/brand-geometry.mjs consumes.
 */
import sharp from "sharp";
import potrace from "potrace";
import { writeFile, mkdir } from "node:fs/promises";

const SRC = "assets/source/15-kiki-logo-white-500.png";
const UPSCALE = 8;
await mkdir("public/brand", { recursive: true });

const meta = await sharp(SRC).metadata();
// Alpha channel, upscaled smoothly, inverted so the letters are black on white for the tracer.
const bitmap = await sharp(SRC)
  .ensureAlpha()
  .extractChannel(3)
  .resize({ width: meta.width * UPSCALE, kernel: "cubic" })
  .blur(1.2)
  .negate()
  .png()
  .toBuffer();

const svg = await new Promise((resolve, reject) =>
  potrace.trace(bitmap, { threshold: 128, turdSize: 40, optTolerance: 0.3, color: "#ffffff", background: "transparent" }, (err, out) =>
    err ? reject(err) : resolve(out),
  ),
);
await writeFile("public/brand/kiki-logo.svg", svg);
await sharp(Buffer.from(svg), { density: 72 }).resize({ width: 2400 }).png({ compressionLevel: 9 }).toFile("assets/source/15-kiki-logo-traced.png");
console.log("wrote public/brand/kiki-logo.svg", (svg.length / 1024).toFixed(1) + "KB", "and assets/source/15-kiki-logo-traced.png");
