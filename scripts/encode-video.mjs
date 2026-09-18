/**
 * Encodes a generated clip into the desktop + mobile MP4s and the poster the
 * site expects. Uses the bundled ffmpeg-static binary, so nothing needs to be
 * installed system-wide.
 *
 *   node scripts/encode-video.mjs <input.mp4> <name>
 *
 *   name "hero"        -> public/video/hero.mp4, public/video/hero-mobile.mp4, public/images/hero.jpg
 *   name "letters/k1"  -> public/video/letters/k1.mp4, .../k1-mobile.mp4, public/images/letters/k1.jpg
 *
 * Desktop: long edge 1280px, CRF 25. Mobile: long edge 720px, CRF 28. Silent, faststart, yuv420p.
 */
import ffmpeg from "ffmpeg-static";
import { execFileSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const [input, name] = process.argv.slice(2);
if (!input || !name) {
  console.error("usage: node scripts/encode-video.mjs <input.mp4> <name>");
  process.exit(1);
}

const desktopOut = `public/video/${name}.mp4`;
const mobileOut = `public/video/${name}-mobile.mp4`;
const posterOut = `public/images/${name}.jpg`;
await mkdir(path.dirname(desktopOut), { recursive: true });
await mkdir(path.dirname(posterOut), { recursive: true });

const scale = (edge) => `scale='if(gt(iw,ih),${edge},-2)':'if(gt(iw,ih),-2,${edge})'`;
const common = ["-an", "-c:v", "libx264", "-preset", "slow", "-pix_fmt", "yuv420p", "-profile:v", "high", "-level", "4.1", "-movflags", "+faststart", "-y"];

const run = (args) => execFileSync(ffmpeg, args, { stdio: "inherit" });

run(["-i", input, "-vf", `${scale(1280)},fps=30`, "-crf", "25", ...common, desktopOut]);
run(["-i", input, "-vf", `${scale(720)},fps=30`, "-crf", "28", ...common, mobileOut]);
run(["-i", desktopOut, "-frames:v", "1", "-q:v", "2", "-y", posterOut]);

console.log("wrote", desktopOut, mobileOut, posterOut);
