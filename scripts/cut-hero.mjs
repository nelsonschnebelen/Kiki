/**
 * Cuts the vertical KIKI nightlife reel into the hero film.
 *
 *   node scripts/cut-hero.mjs "<path to the 720x1280 reel>"
 *
 * - Drops the "Ladies Night" title (0-2.9s), the white flash transitions and the logo end card.
 * - Desktop: three vertical panels side by side (3 x 9:16 = 27:16, almost exactly 16:9),
 *   each panel its own sequence of shots so the cuts never land together. Slowed to 0.75x.
 * - Mobile: one vertical edit of the same shots.
 *
 * Writes public/video/hero.mp4, public/video/hero-mobile.mp4,
 * public/images/hero-night.jpg and public/images/hero-night-blur.jpg.
 */
import ffmpeg from "ffmpeg-static";
import sharp from "sharp";
import { execFileSync } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";

const input = process.argv[2];
if (!input) {
  console.error('usage: node scripts/cut-hero.mjs "<reel.mp4>"');
  process.exit(1);
}

const SPEED = 0.75;
const FPS = 30;
const TMP = "verify-out/hero-cut";
await mkdir(TMP, { recursive: true });
await mkdir("public/video", { recursive: true });

/* Clean shots, [start, end] in seconds, trimmed a few frames inside each cut. */
const SHOTS = {
  whiteDress: [2.92, 3.88],
  floralDress: [4.08, 5.36],
  champagneDuo: [6.12, 7.26],
  whiteSet: [7.42, 8.12],
  redHat: [8.5, 9.76],
  blackDress: [9.92, 10.72],
  kikiTray: [10.88, 11.6],
  toast: [11.76, 13.6],
  lace: [13.76, 14.34],
  greenDress: [14.5, 15.3],
  sambaHeart: [15.46, 16.6],
  terrace: [16.76, 17.62],
  neonToFeathers: [18.72, 21.34],
  drummerFlare: [21.62, 22.86],
  crowd: [23.22, 24.14],
  drumAndSamba: [24.3, 26.54],
  pour: [26.7, 26.96],
  neonHeart: [27.06, 27.54],
  smoke: [28.46, 29.14],
  sambaClose: [29.3, 30.92],
  friends: [31.08, 31.64],
};

const COLUMNS = [
  ["whiteDress", "kikiTray", "sambaHeart", "pour", "drummerFlare", "neonHeart", "sambaClose", "whiteSet"],
  ["toast", "redHat", "drumAndSamba", "floralDress", "terrace", "friends"],
  ["champagneDuo", "neonToFeathers", "blackDress", "crowd", "greenDress", "lace", "smoke"],
];

const run = (args) => execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });

function cutColumn(names, out) {
  const parts = names.map((n, i) => `[0:v]trim=start=${SHOTS[n][0]}:end=${SHOTS[n][1]},setpts=PTS-STARTPTS[s${i}]`);
  const graph =
    parts.join(";") +
    `;${names.map((_, i) => `[s${i}]`).join("")}concat=n=${names.length}:v=1:a=0,` +
    `setpts=PTS/${SPEED},minterpolate=fps=${FPS}:mi_mode=blend,format=yuv420p[v]`;
  run(["-i", input, "-filter_complex", graph, "-map", "[v]", "-an", "-c:v", "libx264", "-preset", "fast", "-crf", "16", out]);
  const length = names.reduce((t, n) => t + (SHOTS[n][1] - SHOTS[n][0]), 0) / SPEED;
  console.log(out, length.toFixed(2) + "s");
  return length;
}

const files = COLUMNS.map((_, i) => `${TMP}/col${i + 1}.mp4`);
const lengths = COLUMNS.map((names, i) => cutColumn(names, files[i]));
const T = (Math.floor(Math.min(...lengths) * 10) / 10 - 0.1).toFixed(1);

const common = ["-an", "-c:v", "libx264", "-preset", "slow", "-pix_fmt", "yuv420p", "-profile:v", "high", "-level", "4.1", "-movflags", "+faststart"];

/* Desktop triptych: 2160x1280 stacked, hairline stone dividers, scaled to 1920 wide. */
run([
  "-i", files[0], "-i", files[1], "-i", files[2],
  "-filter_complex",
  `[0:v][1:v][2:v]hstack=inputs=3,drawbox=x=718:y=0:w=4:h=ih:color=0xF5F0E8:t=fill,drawbox=x=1438:y=0:w=4:h=ih:color=0xF5F0E8:t=fill,scale=1920:-2[v]`,
  "-map", "[v]", "-t", T, "-crf", "29", ...common, "public/video/hero.mp4",
]);

/* Mobile: the three columns back to back, 540x960. */
run([
  "-i", files[0], "-i", files[1], "-i", files[2],
  "-filter_complex", `[0:v][1:v][2:v]concat=n=3:v=1:a=0,scale=540:-2[v]`,
  "-map", "[v]", "-crf", "30", ...common, "public/video/hero-mobile.mp4",
]);

/* Poster + pre-blurred poster for the scroll transition. */
run(["-ss", "1.2", "-i", "public/video/hero.mp4", "-frames:v", "1", "-q:v", "2", `${TMP}/poster.jpg`]);
await sharp(`${TMP}/poster.jpg`).jpeg({ quality: 84, mozjpeg: true }).toFile("public/images/hero-night.jpg");
await sharp(`${TMP}/poster.jpg`)
  .resize({ width: 960 })
  .blur(22)
  .modulate({ brightness: 1.25, saturation: 0.85 })
  .jpeg({ quality: 78, mozjpeg: true })
  .toFile("public/images/hero-night-blur.jpg");

for (const f of files) await rm(f, { force: true });
console.log(`done: loop length ${T}s`);
