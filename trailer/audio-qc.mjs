import ffmpeg from "ffmpeg-static";
import { spawnSync } from "node:child_process";
const pcm = (file, extra = []) => { const r = spawnSync(ffmpeg, ["-v", "error", "-i", file, ...extra, "-ac", "1", "-ar", "48000", "-f", "f32le", "-"], { maxBuffer: 1 << 30 }); return new Float32Array(r.stdout.buffer, r.stdout.byteOffset, r.stdout.byteLength / 4); };
const db = (v) => (20 * Math.log10(v + 1e-9)).toFixed(1);
const rms = (x, a, b) => { let e = 0; for (let i = a; i < b; i++) e += x[i] ** 2; return Math.sqrt(e / (b - a)); };

const vo = pcm("trailer/out/kiki-trailer-vo-stem.wav"), mix = pcm("trailer/out/kiki-trailer.mp4", ["-vn"]);
// 1. Clicks: biggest sample-to-sample jump in the narration stem (a click is a jump with no ramp).
let maxStep = 0, at = 0; for (let i = 1; i < vo.length; i++) { const d = Math.abs(vo[i] - vo[i - 1]); if (d > maxStep) { maxStep = d; at = i; } }
console.log(`narration: largest sample step ${maxStep.toFixed(3)} at ${(at / 48000).toFixed(2)}s (speech itself reaches ~0.1-0.2; a hard edge would be an isolated jump)`);
// line boundaries: find speech on/off transitions and report the first sample level after silence
const win = 480; let speaking = false, edges = [];
for (let i = 0; i + win < vo.length; i += win) { const on = rms(vo, i, i + win) > 0.002; if (on !== speaking) { edges.push([i / 48000, on, Math.abs(vo[i + (on ? 0 : win - 1)])]); speaking = on; } }
const worst = Math.max(...edges.map((e) => e[2]));
console.log(`narration: ${edges.filter((e) => e[1]).length} line starts detected; worst level at any edge ${worst.toFixed(4)} (${db(worst)} dB)`);
// 2. Peaks and crest of the final mix
let pk = 0; for (const v of mix) pk = Math.max(pk, Math.abs(v));
console.log(`mix: peak ${db(pk)} dBFS, overall RMS ${db(rms(mix, 0, mix.length))} dB`);
// 3. Voice vs mix in each spoken stretch
const on = edges.filter((e) => e[1]).map((e) => e[0]), off = edges.filter((e) => !e[1]).map((e) => e[0]);
let worstMargin = 99; const margins = [];
on.forEach((s, k) => { const e = off.find((o) => o > s) ?? s + 2; if (e - s < 0.8) return; const a = Math.round(s * 48000), b2 = Math.round(e * 48000); const v = rms(vo, a, b2) * Math.pow(10, 3.5 / 20), m = rms(mix, a, b2); margins.push(20 * Math.log10(v / Math.sqrt(Math.max(1e-12, m * m - v * v)))); const music = Math.sqrt(Math.max(1e-12, m * m - v * v)); const margin = 20 * Math.log10(v / music); worstMargin = Math.min(worstMargin, margin); });
margins.sort((p, q) => p - q); console.log(`voice over music while she speaks: tightest ${margins[0].toFixed(1)} dB, median ${margins[margins.length >> 1].toFixed(1)} dB, across ${margins.length} phrases`);
// 4. Music between lines
const gaps = off.map((o) => [o, on.find((s) => s > o)]).filter(([o, s]) => s && s - o > 1.2);
console.log("music between lines:", gaps.slice(0, 6).map(([o, s]) => `${o.toFixed(0)}s ${db(rms(mix, Math.round((o + 0.4) * 48000), Math.round((s - 0.2) * 48000)))}dB`).join("  "));
