/**
 * Headless verification of the scroll sequence.
 *
 *   node scripts/verify-scroll.mjs [baseUrl] [outDir]
 *
 * Captures the pinned sequence at several progress points on desktop and
 * mobile, plus the reduced-motion fallback, and reports console errors,
 * hydration warnings and frame timing. Requires `npx playwright install chromium`.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const base = process.argv[2] ?? "http://localhost:3001";
const out = process.argv[3] ?? "verify-out";
await mkdir(out, { recursive: true });

const browser = await chromium.launch();
const problems = [];

async function capture(name, { viewport, reducedMotion = "no-preference", mobile = false }) {
  const context = await browser.newContext({
    viewport,
    reducedMotion,
    isMobile: mobile,
    hasTouch: mobile,
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  page.on("console", (msg) => {
    const text = msg.text();
    if (msg.type() === "error" || /hydrat|Warning:/i.test(text)) {
      if (!/favicon|404|Failed to load resource/.test(text)) problems.push(`[${name}] console.${msg.type()}: ${text.slice(0, 300)}`);
    }
  });
  page.on("pageerror", (err) => problems.push(`[${name}] pageerror: ${err.message}`));

  await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);

  /* The hero film must actually be running (ScrollTrigger's pin re-parents it, which pauses media). */
  if (reducedMotion !== "reduce") {
    const film = await page.evaluate(async () => {
      const v = document.querySelector(".kiki-stage video");
      if (!v) return null;
      await new Promise((r) => setTimeout(r, 1500));
      const a = v.currentTime;
      await new Promise((r) => setTimeout(r, 1200));
      return { paused: v.paused, advanced: v.currentTime > a };
    });
    console.log(`[${name}] hero film: ${JSON.stringify(film)}`);
    if (!film || film.paused || !film.advanced) problems.push(`[${name}] hero film is not playing`);
  }

  const vh = viewport.height;
  const mult = mobile ? 2.0 : 2.8;
  const stops = reducedMotion === "reduce" ? [0, 1, 2, 3] : [0, 0.2, 0.4, 0.55, 0.7, 0.85, 1, 1.35, 2.2, 3.2];

  for (const p of stops) {
    const y = Math.round(vh * mult * p);
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(900);
    const file = path.join(out, `${name}-${String(p).replace(".", "_")}.png`);
    await page.screenshot({ path: file });
    console.log("captured", file, "scrollY", y);
  }

  const headerAtEnd = await page.evaluate(() => getComputedStyle(document.querySelector("header")).visibility);
  console.log(`[${name}] header after the sequence: ${headerAtEnd}`);
  if (headerAtEnd !== "visible") problems.push(`[${name}] header did not appear after the sequence`);

  if (reducedMotion !== "reduce") {
    await page.evaluate(() => window.scrollTo(0, Math.round(innerHeight * 2.8 * 0.6)));
    await page.waitForTimeout(500);
    const timing = await page.evaluate(
      () =>
        new Promise((res) => {
          const d = [];
          let last = performance.now();
          const start = last;
          const f = (t) => {
            d.push(t - last);
            last = t;
            if (t - start < 1500) requestAnimationFrame(f);
            else res({ avg: +(d.reduce((a, b) => a + b, 0) / d.length).toFixed(1), max: +Math.max(...d).toFixed(1) });
          };
          requestAnimationFrame(f);
        }),
    );
    console.log(`[${name}] frame time at 60% (idle, software GPU): avg ${timing.avg}ms max ${timing.max}ms`);
  }

  const state = await page.evaluate(() => ({
    pinned: !!document.querySelector(".pin-spacer"),
    petals: document.querySelectorAll(".petal-outer").length,
    videos: document.querySelectorAll(".kiki-wm video").length,
    headerVisible: getComputedStyle(document.querySelector("header")).visibility,
  }));
  console.log(`[${name}]`, JSON.stringify(state));

  await context.close();
}

await capture("desktop", { viewport: { width: 1440, height: 900 } });
await capture("mobile", { viewport: { width: 390, height: 844 }, mobile: true });
await capture("reduced", { viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });

await browser.close();

if (problems.length) {
  console.log("\nPROBLEMS:");
  problems.forEach((p) => console.log(" -", p));
  process.exitCode = 1;
} else {
  console.log("\nNo console errors, page errors or hydration warnings.");
}
