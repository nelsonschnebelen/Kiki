/**
 * Cuts KIKI's three vertical reels into the footer film: four vertical panels
 * side by side (4 x 9:16 = 2.25:1, which fits the wide footer band), one for
 * every letter of KIKI. Titles, graphics, flash transitions and logo end cards
 * are skipped. Slowed to 0.75x with blended frames.
 *
 *   node scripts/cut-footer.mjs
 *
 * Writes public/video/footer.mp4, public/video/footer-mobile.mp4 and
 * public/images/footer-poster.jpg.
 */
import ffmpeg from "ffmpeg-static";
import { execFileSync } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";

const SRC = {
  venue: "assets/source/17-kiki-footer-reel-1.mp4", // night fly-through of the restaurant
  party: "assets/source/18-kiki-footer-reel-2.mp4", // bachelorette night
  yacht: "assets/source/19-kiki-footer-reel-3.mp4", // girls' day on the yacht
};

const SPEED = 0.75;
const FPS = 30;
const TMP = "verify-out/footer-cut";
await mkdir(TMP, { recursive: true });
await mkdir("public/video", { recursive: true });

/* One panel per letter. Each entry is [source, start, end] in seconds, a few frames inside each cut. */
const PANELS = [
  // K — the room at night
  [["venue", 0.3, 3.28], ["venue", 4.52, 6.98], ["venue", 7.36, 8.68]],
  // I — the party, part one
  [["party", 9.7, 12.18], ["party", 13.96, 14.92], ["party", 16.3, 16.96], ["party", 8.76, 9.2], ["party", 17.08, 17.72], ["party", 12.32, 12.86]],
  // K — the yacht by day
  [["yacht", 8.22, 11.4], ["yacht", 3.0, 4.5], ["yacht", 4.64, 5.8], ["yacht", 7.02, 8.06]],
  // I — the party, part two
  [
    ["party", 20.7, 21.36], ["party", 23.78, 24.2], ["party", 24.32, 24.94], ["party", 25.04, 25.68],
    ["party", 26.04, 26.88], ["party", 27.0, 27.78], ["party", 27.9, 28.34], ["party", 21.5, 22.04], ["party", 28.46, 28.92],
  ],
];

const run = (args) => execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });

function cutPanel(segments, out) {
  const sources = [...new Set(segments.map((s) => s[0]))];
  const inputs = sources.flatMap((k) => ["-i", SRC[k]]);
  const parts = segments.map(
    ([k, a, b], i) => `[${sources.indexOf(k)}:v]trim=start=${a}:end=${b},setpts=PTS-STARTPTS,scale=720:1280,setsar=1[s${i}]`,
  );
  const graph =
    parts.join(";") +
    `;${segments.map((_, i) => `[s${i}]`).join("")}concat=n=${segments.length}:v=1:a=0,` +
    `setpts=PTS/${SPEED},minterpolate=fps=${FPS}:mi_mode=blend,format=yuv420p[v]`;
  run([...inputs, "-filter_complex", graph, "-map", "[v]", "-an", "-c:v", "libx264", "-preset", "fast", "-crf", "16", out]);
  const length = segments.reduce((t, s) => t + (s[2] - s[1]), 0) / SPEED;
  console.log(out, length.toFixed(2) + "s");
  return length;
}

const files = PANELS.map((_, i) => `${TMP}/panel${i + 1}.mp4`);
const lengths = PANELS.map((segments, i) => cutPanel(segments, files[i]));
const T = (Math.floor(Math.min(...lengths) * 10) / 10 - 0.1).toFixed(1);

const common = ["-an", "-c:v", "libx264", "-preset", "slow", "-pix_fmt", "yuv420p", "-profile:v", "high", "-level", "4.1", "-movflags", "+faststart"];
const inputs = files.flatMap((f) => ["-i", f]);
const dividers = [718, 1438, 2158].map((x) => `drawbox=x=${x}:y=0:w=4:h=ih:color=0xF5F0E8:t=fill`).join(",");

/* Desktop: 2880x1280 stacked, hairline stone dividers, scaled to 1920 wide. */
run([
  ...inputs,
  "-filter_complex", `[0:v][1:v][2:v][3:v]hstack=inputs=4,${dividers},scale=1920:-2[v]`,
  "-map", "[v]", "-t", T, "-crf", "29", ...common, "public/video/footer.mp4",
]);

/* Mobile: the four panels back to back, 540x960. */
run([
  ...inputs,
  "-filter_complex", `[0:v][1:v][2:v][3:v]concat=n=4:v=1:a=0,scale=540:-2[v]`,
  "-map", "[v]", "-crf", "30", ...common, "public/video/footer-mobile.mp4",
]);

run(["-ss", "2.0", "-i", "public/video/footer.mp4", "-frames:v", "1", "-q:v", "3", "public/images/footer-poster.jpg"]);

for (const f of files) await rm(f, { force: true });
console.log(`done: loop length ${T}s`);
