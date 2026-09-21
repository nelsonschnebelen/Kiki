/**
 * Renders the trailer's typography frame by frame (deterministic, 30fps) from
 * trailer/titles.html into PNG sequences with alpha, then packs each into a
 * ProRes 4444 .mov so ffmpeg can overlay it on footage.
 *
 *   node trailer/render-titles.mjs
 */
import { chromium } from "playwright";
import ffmpeg from "ffmpeg-static";
import { execFileSync } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const OUT = "trailer/work/titles";
const FPS = 30;
await mkdir(OUT, { recursive: true });

const JOBS = [
  ["presents", "presents"],
  ["beat", "bt-best", { text: "Deserves the best" }],
  ["evolve", "evolve"],
  ["renowned", "renowned"],
  ["label", "lb-scroll", { title: "Cinematic scroll", sub: "The logo becomes the film" }],
  ["label", "lb-brand", { title: "Every detail, on brand", sub: "KIKI’s own logo · florals · footage" }],
  ["label", "lb-wheel", { title: "Day turns into night", sub: "A wheel that turns with the guest" }],
  ["label", "lb-book", { title: "Reservations, built in", sub: "Powered by SevenRooms · never leaves the page" }],
  ["label", "lb-mobile", { title: "Flawless on every screen", sub: "Designed for the phone first" }],
  ["label", "lb-world", { title: "Built from your world", sub: "Not a template", top: true }],
  ["d1", "d1"],
  ["d2", "d2"],
  ["d3", "d3"],
  ["pillar", "d4", { split: true, kicker: "Automate & engage", title: "Retargeting that follows intent.", chips: ["Meta Ads", "Instagram", "Google Ads", "HubSpot", "Retargeting ads"], foot: "Audiences sync the moment they are built." }],
  ["pillar", "d5", { kicker: "Automate & engage", title: "Marketing that runs itself.", chips: ["Custom offers & coupons", "Email journeys", "Review prompts", "Loyalty sign-up triggers", "Event ticketing", "Dishio AI Engine"], foot: "Behaviour-based. Always on.", dur: 6.2 }],
  ["pillar", "d6", { split: true, kicker: "Grow & optimize", title: "Every dollar, attributed.", chips: ["Campaign Performance", "Google Ads Performance", "Meta Ad Performance", "Creative Analytics", "Toast · Square · Clover · Oracle"], foot: "Trusted by 2,500+ leading restaurant brands.", dur: 7.6 }],
  ["close", "close"],
];

const only = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(pathToFileURL(path.resolve("trailer/titles.html")).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

for (const [scene, name, args] of JOBS) {
  if (only.length && !only.includes(name)) continue;
  const dir = `${OUT}/${name}`;
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  const dur = await page.evaluate(([s, a]) => window.mount(s, a), [scene, args]);
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))));
  await page.evaluate(() => document.fonts.ready);
  const frames = Math.round(dur * FPS);
  for (let f = 0; f < frames; f++) {
    await page.evaluate(([s, t]) => window.draw(s, t), [scene, f / FPS]);
    await page.screenshot({ path: `${dir}/${String(f).padStart(4, "0")}.png`, omitBackground: true });
  }
  execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", "-framerate", String(FPS), "-i", `${dir}/%04d.png`, "-c:v", "prores_ks", "-profile:v", "4444", "-pix_fmt", "yuva444p10le", `${OUT}/${name}.mov`], { stdio: "inherit" });
  await rm(dir, { recursive: true, force: true });
  console.log(`${name}: ${frames} frames (${dur}s)`);
}
await browser.close();
