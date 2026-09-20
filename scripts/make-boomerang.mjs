/**
 * Turns a short clip into a seamless boomerang (forward, then reversed) and
 * writes the desktop + mobile MP4s and a poster.
 *
 *   node scripts/make-boomerang.mjs <input.mp4> <name>
 *
 *   name "footer" -> public/video/footer.mp4, public/video/footer-mobile.mp4, public/images/footer-poster.jpg
 *
 * The last frame of the forward pass and the first of the reverse are dropped
 * so the turn-around does not stutter. Silent, faststart, yuv420p.
 */
import ffmpeg from "ffmpeg-static";
import { execFileSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const [input, name] = process.argv.slice(2);
if (!input || !name) {
  console.error("usage: node scripts/make-boomerang.mjs <input.mp4> <name>");
  process.exit(1);
}

const desktopOut = `public/video/${name}.mp4`;
const mobileOut = `public/video/${name}-mobile.mp4`;
const posterOut = `public/images/${name}-poster.jpg`;
await mkdir(path.dirname(desktopOut), { recursive: true });
await mkdir(path.dirname(posterOut), { recursive: true });

const run = (args) => execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
const common = ["-an", "-c:v", "libx264", "-preset", "slow", "-pix_fmt", "yuv420p", "-profile:v", "high", "-level", "4.1", "-movflags", "+faststart"];

const boomerang = (width) =>
  `[0:v]fps=30,scale=${width}:-2,split[f][r];` +
  `[r]reverse,trim=start_frame=1,setpts=PTS-STARTPTS[rv];` +
  `[f]trim=end_frame=100000,setpts=PTS-STARTPTS[fw];` +
  `[fw][rv]concat=n=2:v=1:a=0[v]`;

run(["-i", input, "-filter_complex", boomerang(1920), "-map", "[v]", "-crf", "27", ...common, desktopOut]);
run(["-i", input, "-filter_complex", boomerang(960), "-map", "[v]", "-crf", "29", ...common, mobileOut]);
run(["-i", desktopOut, "-frames:v", "1", "-q:v", "2", posterOut]);

console.log("wrote", desktopOut, mobileOut, posterOut);
