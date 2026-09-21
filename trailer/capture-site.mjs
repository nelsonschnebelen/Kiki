/**
 * Records the live site for the trailer with a scripted browser.
 *
 *   node trailer/capture-site.mjs [baseUrl]
 *
 * Uses the DevTools screencast (high-quality JPEG frames with real timestamps)
 * rather than Playwright's low-bitrate recorder, then conforms each take to
 * 30fps H.264. Scrolling is eased in-page so it reads as a camera move.
 * Writes trailer/work/site-*.mp4.
 */
import { chromium } from "playwright";
import ffmpeg from "ffmpeg-static";
import { execFileSync } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";

const base = process.argv[2] ?? "https://kiki-on-the-river.vercel.app";
const OUT = "trailer/work";
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });

async function take(name, { viewport, mobile = false, scale = 1 }, actions) {
  const ctx = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: scale });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // Hide the Next.js dev badge if present; add a soft cursor we can steer.
  await page.addStyleTag({ content: "nextjs-portal{display:none!important} #tc{position:fixed;z-index:99999;left:0;top:0;width:22px;height:22px;border-radius:50%;background:rgba(255,255,255,.92);box-shadow:0 0 0 2px rgba(18,56,184,.9),0 6px 18px rgba(14,44,147,.35);transform:translate(-100px,-100px);transition:transform .9s cubic-bezier(.65,0,.15,1),scale .2s;pointer-events:none}" });
  await page.evaluate(() => { const c = document.createElement("div"); c.id = "tc"; document.body.appendChild(c); });
  await page.waitForTimeout(1500);

  const dir = `${OUT}/frames-${name}`;
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  const cdp = await ctx.newCDPSession(page);
  const frames = [];
  let writing = Promise.resolve();
  cdp.on("Page.screencastFrame", (f) => {
    const file = `${dir}/${String(frames.length).padStart(5, "0")}.jpg`;
    frames.push({ file, t: f.metadata.timestamp });
    writing = writing.then(() => writeFile(file, Buffer.from(f.data, "base64")));
    cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {});
  });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 93, everyNthFrame: 1 });

  const helpers = {
    page,
    wait: (ms) => page.waitForTimeout(ms),
    pinDistance: () => page.evaluate(() => document.querySelector(".pin-spacer").offsetHeight - document.querySelector(".kiki-stage").offsetHeight),
    scrollTo: (to, ms) =>
      page.evaluate(
        ({ to, ms }) =>
          new Promise((res) => {
            const from = scrollY, t0 = performance.now();
            const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
            (function f(now) {
              const k = Math.min(1, (now - t0) / ms);
              window.scrollTo(0, from + (to - from) * ease(k));
              k < 1 ? requestAnimationFrame(f) : res();
            })(t0);
          }),
        { to, ms },
      ),
    cursorTo: async (selector) => {
      const box = await page.locator(selector).first().boundingBox();
      if (!box) return;
      await page.evaluate(({ x, y }) => { document.getElementById("tc").style.transform = `translate(${x - 11}px, ${y - 11}px)`; }, { x: box.x + box.width / 2, y: box.y + box.height / 2 });
      await page.waitForTimeout(1000);
    },
  };
  await actions(helpers);

  await cdp.send("Page.stopScreencast");
  await writing;
  await ctx.close();

  // Conform real-time frames to constant 30fps.
  const list = frames.map((f, i) => `file '${f.file.replace(`${OUT}/`, "")}'\nduration ${Math.max(0.001, (frames[i + 1]?.t ?? f.t + 0.04) - f.t).toFixed(4)}`).join("\n");
  await writeFile(`${OUT}/list-${name}.txt`, list + `\nfile '${frames[frames.length - 1].file.replace(`${OUT}/`, "")}'\n`);
  const secs = frames[frames.length - 1].t - frames[0].t;
  execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", `list-${name}.txt`, "-vf", "fps=30,format=yuv420p", "-c:v", "libx264", "-preset", "medium", "-crf", "15", `site-${name}.mp4`], { cwd: OUT, stdio: "inherit" });
  await rm(dir, { recursive: true, force: true });
  console.log(`${name}: ${frames.length} frames in ${secs.toFixed(1)}s = ${(frames.length / secs).toFixed(1)} fps captured`);
}

const desktop = { viewport: { width: 1920, height: 1080 } };

/* 1. Hero holds, then the full scroll sequence into the landed letters. */
await take("sequence", desktop, async ({ wait, scrollTo, pinDistance }) => {
  await wait(5500);
  const d = await pinDistance();
  await scrollTo(Math.round(d * 0.8), 12000);
  await wait(2500);
});

/* 2. The wheel arriving and turning from day to night. */
await take("wheel", desktop, async ({ page, wait, scrollTo, pinDistance }) => {
  const d = await pinDistance();
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(d * 0.97));
  await wait(2000);
  await scrollTo(Math.round(d + 1080 * 1.05), 9000);
  await wait(1500);
});

/* 3. Booking bar to reservation drawer, with a steered cursor. */
await take("booking", desktop, async ({ page, wait, pinDistance, cursorTo }) => {
  const d = await pinDistance();
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(d * 0.83));
  await wait(2200);
  const form = 'form[aria-label="Reserve a table"]';
  const day = new Date(Date.now() + 9 * 864e5);
  const iso = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
  await cursorTo(`${form} input[type=date]`);
  await page.fill(`${form} input[type=date]`, iso);
  await wait(600);
  await cursorTo(`${form} select >> nth=0`);
  await page.selectOption(`${form} select >> nth=0`, "6");
  await wait(600);
  await cursorTo(`${form} select >> nth=1`);
  await page.selectOption(`${form} select >> nth=1`, "20:30");
  await wait(700);
  await cursorTo(`${form} button[type=submit]`);
  await page.click(`${form} button[type=submit]`);
  await wait(9000);
});

/* 4. The four-panel footer film. */
await take("footer", desktop, async ({ page, wait, scrollTo }) => {
  const h = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  await page.evaluate((y) => window.scrollTo(0, y), h - 900);
  await wait(800);
  await scrollTo(h, 3500);
  await wait(5500);
});

/* 5. The same site on a phone. */
await take("mobile", { viewport: { width: 390, height: 844 }, mobile: true, scale: 2 }, async ({ page, wait, scrollTo }) => {
  await wait(3500);
  const d = await page.evaluate(() => document.querySelector(".pin-spacer").offsetHeight - document.querySelector(".kiki-stage").offsetHeight);
  await scrollTo(Math.round(d * 0.76), 8000);
  await wait(1500);
  await scrollTo(Math.round(d + 844 * 1.4), 7000);
  await wait(1200);
});

await browser.close();
console.log("site capture done");
