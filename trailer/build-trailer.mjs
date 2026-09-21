/**
 * Assembles the KIKI website reveal trailer.
 *
 *   node trailer/build-trailer.mjs [path/to/music.(mp3|wav)]
 *
 * Inputs: trailer/assets (Higgsfield narration + clips), trailer/work/site-*.mp4
 * (capture-site.mjs), trailer/work/titles/*.mov (render-titles.mjs), and KIKI's
 * own films in public/video. Each segment is rendered on its own, then the cut is
 * concatenated, finished Netflix-style (2:1 letterbox, grade, vignette, grain)
 * and mixed. With a music file it is ducked under the narration; without one a
 * synthesized drone and impacts stand in.
 *
 * Writes trailer/out/kiki-trailer.mp4 and trailer/out/kiki-trailer-vo-stem.wav.
 */
import ffmpegPath from "ffmpeg-static";
import sharp from "sharp";
import { execFileSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";

const args = process.argv.slice(2);
const music = args.find((a) => !a.startsWith("--"));
/* Second in the supplied track where its drop lands; it is slid to meet the site reveal. */
const dropArg = args.find((a) => a.startsWith("--drop="));
const DROP = dropArg ? Number(dropArg.split("=")[1]) : null;
const BRAND = "trailer/brand/dl";
const W = "trailer/work", T = `${W}/titles`, SEG = `${W}/seg`, OUT = "trailer/out";
await mkdir(SEG, { recursive: true });
await mkdir(OUT, { recursive: true });
const ff = (args) => execFileSync(ffmpegPath, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });

const COVER = "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080";
const ENC = ["-an", "-c:v", "libx264", "-preset", "medium", "-crf", "14", "-pix_fmt", "yuv420p", "-r", "30"];

/* ---------------------------------------------------------------- phone frame assets */
const PH = { w: 430, h: 930, r: 52 };
await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${PH.w}" height="${PH.h}"><rect width="${PH.w}" height="${PH.h}" rx="${PH.r}" fill="#fff"/></svg>`)).png().toFile(`${W}/phone-mask.png`);
await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${PH.w + 28}" height="${PH.h + 28}">
  <rect x="2" y="2" width="${PH.w + 24}" height="${PH.h + 24}" rx="${PH.r + 12}" fill="none" stroke="#0b0d14" stroke-width="14"/>
  <rect x="9" y="9" width="${PH.w + 10}" height="${PH.h + 10}" rx="${PH.r + 5}" fill="none" stroke="#3a3f52" stroke-width="1.5"/>
  <rect x="${(PH.w + 28) / 2 - 58}" y="22" width="116" height="26" rx="13" fill="#0b0d14"/></svg>`)).png().toFile(`${W}/phone-bezel.png`);

await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1040" height="585"><rect width="1040" height="585" rx="18" fill="#fff"/></svg>`)).png().toFile(`${W}/dash-mask.png`);

/* ---------------------------------------------------------------- the cut
 * base:  how the picture under the titles is made
 * over:  [titleFile, atSeconds] overlays (ProRes 4444 with alpha)
 * vo:    [lineNumber, atSeconds] narration cues, relative to the segment
 * hit:   seconds (relative) where a low impact lands
 */
const black = (d) => ({ inputs: ["-f", "lavfi", "-i", `color=c=black:s=1920x1080:r=30:d=${d}`], chain: "[0:v]null" });
const clip = (file, from, to, speed = 1, extra = "") => ({
  inputs: ["-i", file],
  chain: `[0:v]trim=start=${from}:end=${to},setpts=PTS-STARTPTS,${COVER}${speed !== 1 ? `,setpts=PTS/${speed},minterpolate=fps=30:mi_mode=blend` : ",fps=30"}${extra}`,
});
/* Generated data network, shifted from cobalt to Dishio green and pushed dark. */
const DATA = (d) => `trim=duration=${d},setpts=PTS-STARTPTS,${COVER},hue=h=-105:s=0.85,eq=brightness=-0.14:contrast=1.08`;
const dataBg = (d) => ({ inputs: ["-stream_loop", "-1", "-i", `${W}/data-loop.mp4`], chain: `[0:v]${DATA(d)}` });
/* The animated Dishio logo (alpha) over black, enlarged. */
const dishioLogo = (d) => ({
  inputs: ["-f", "lavfi", "-i", `color=c=black:s=1920x1080:r=30:d=${d}`, "-i", `${BRAND}/logo-anim.mov`],
  chain: `[1:v]scale=iw*1.7:-1,crop=1920:1080[lg];[0:v][lg]overlay=eof_action=pass`,
});
/* Dishio's retargeting animation (black background keyed out) on the right of the data field. */
const withRetarget = (d) => ({
  inputs: ["-stream_loop", "-1", "-i", `${W}/data-loop.mp4`, "-i", `${BRAND}/retarget.mp4`],
  chain: `[0:v]${DATA(d)}[bg];[1:v]trim=start=2.2:end=${(2.2 + d).toFixed(2)},setpts=PTS-STARTPTS,fps=30,crop=1080:1080:420:0,scale=820:820,colorkey=black:0.1:0.08[rt];[bg][rt]overlay=1010:130`,
});
/* Dishio's real dashboard animation in a rounded window on the right. */
const withDashboard = (d) => ({
  inputs: ["-stream_loop", "-1", "-i", `${W}/data-loop.mp4`, "-i", `${BRAND}/dashboard-anim.mp4`, "-i", `${W}/dash-mask.png`],
  chain: `[0:v]${DATA(d)}[bg];[1:v]trim=start=0.6:end=${(0.6 + d).toFixed(2)},setpts=PTS-STARTPTS,fps=30,scale=1040:585,format=rgba[ds];[2:v]format=gray[dm];[ds][dm]alphamerge[dw];[bg][dw]overlay=820:248`,
});

const CUT = [
  { id: "presents", dur: 5.0, ...dishioLogo(5.0), over: [["presents", 0]], hit: [0.2], fade: [0, 0.6] },
  { id: "river", dur: 10.4, ...clip("trailer/assets/clips/river.mp4", 0, 8, 0.77), vo: [[1, 2.2], [2, 5.9]], fade: [1.2, 0.3] },
  { id: "legend", dur: 7.6, ...clip("public/video/hero.mp4", 0.4, 8.0), over: [["renowned", 3.6]], vo: [[3, 0.5]], hit: [0], fade: [0.15, 0.2] },
  { id: "best", dur: 3.3, ...black(3.3), over: [["bt-best", 0.5]], vo: [[4, 0.35]], hit: [0.5] },
  { id: "petals", dur: 7.2, ...clip("trailer/assets/clips/petals.mp4", 0, 3.25, 0.45), vo: [[5, 0.9]], fade: [0.5, 0.35] },
  { id: "evolve", dur: 4.2, ...black(4.2), over: [["evolve", 0]], vo: [[6, 2.0]], hit: [0.2, 1.7] },
  { id: "sequence", dur: 18.0, ...clip(`${W}/site-sequence.mp4`, 1.6, 19.6), over: [["lb-scroll", 4.8], ["lb-brand", 9.3]], vo: [[7, 0.7], [8, 5.2]], hit: [0], fade: [0.4, 0] },
  { id: "wheel", dur: 10.2, ...clip(`${W}/site-wheel.mp4`, 1.2, 11.4), over: [["lb-wheel", 5.4]], vo: [[9, 0.5]] },
  { id: "booking", dur: 11.6, ...clip(`${W}/site-booking.mp4`, 1.4, 15.9, 1.25), over: [["lb-book", 6.6]], vo: [[10, 0.8]] },
  { id: "mobile", dur: 6.8, phone: true, over: [["lb-mobile", 1.9]], vo: [[11, 0.6]] },
  { id: "footer", dur: 5.8, ...clip(`${W}/site-footer.mp4`, 3.6, 9.4), over: [["lb-world", 1.5]], vo: [[12, 0.7]], fade: [0, 0.5] },
  { id: "intel", dur: 5.4, ...dataBg(5.4), vo: [[13, 0.8]], hit: [0.1], fade: [0.6, 0] },
  { id: "d1", dur: 6.4, ...dataBg(6.4), over: [["d1", 0]], vo: [[14, 0.7]], hit: [0.6] },
  { id: "d2", dur: 6.2, ...dataBg(6.2), over: [["d2", 0]], vo: [[15, 0.4]] },
  { id: "d3", dur: 6.6, ...dataBg(6.6), over: [["d3", 0]], vo: [[16, 0.5]] },
  { id: "d4", dur: 5.4, ...withRetarget(5.4), over: [["d4", 0]], vo: [[17, 0.7]] },
  { id: "d5", dur: 6.2, ...dataBg(6.2), over: [["d5", 0]], vo: [[18, 0.5]] },
  { id: "d6", dur: 7.6, ...withDashboard(7.6), over: [["d6", 0]], vo: [[19, 0.6]], fade: [0, 0.5] },
  { id: "close", dur: 8.5, ...black(8.5), over: [["close", 0]], vo: [[20, 1.2], [21, 4.6]], hit: [0.3] },
];

/* ---------------------------------------------------------------- data background loop (boomerang, slowed) */
ff(["-i", "trailer/assets/clips/data.mp4", "-filter_complex",
  "[0:v]setpts=PTS/0.6,minterpolate=fps=30:mi_mode=blend,split[f][r];[r]reverse,setpts=PTS-STARTPTS[rv];[f][rv]concat=n=2:v=1:a=0,scale=1920:1080[v]",
  "-map", "[v]", ...ENC, `${W}/data-loop.mp4`]);

/* ---------------------------------------------------------------- render each segment */
let cursor = 0, REVEAL = 0;
const cues = [], hits = [];
for (const s of CUT) {
  const out = `${SEG}/${s.id}.mp4`;
  let inputs, graph;
  if (s.phone) {
    // Blurred fill of the same footage behind a phone: rounded screen + bezel, on the right.
    inputs = ["-i", `${W}/site-mobile.mp4`, "-i", `${W}/phone-mask.png`, "-i", `${W}/phone-bezel.png`];
    const x = 1210, y = (1080 - PH.h) / 2;
    graph =
      `[0:v]trim=start=1.5:end=${1.5 + s.dur * 2.3},setpts=PTS-STARTPTS,setpts=PTS/2.3,fps=30,split[a][b];` +
      `[a]${COVER},boxblur=40:5,eq=brightness=-0.38:saturation=1.25:contrast=1.1[bg];` +
      `[b]scale=${PH.w}:${PH.h}:flags=lanczos,format=rgba[scr];[1:v]format=gray,scale=${PH.w}:${PH.h}[m];[scr][m]alphamerge[phone];` +
      `[bg][phone]overlay=${x}:${y}[p1];[p1][2:v]overlay=${x - 14}:${y - 14}[base]`;
  } else {
    inputs = s.inputs;
    graph = `${s.chain}[base]`;
  }
  let last = "base";
  const n0 = inputs.filter((a) => a === "-i").length;
  (s.over || []).forEach(([file, at], i) => {
    inputs = [...inputs, "-i", `${T}/${file}.mov`];
    graph += `;[${n0 + i}:v]setpts=PTS+${at}/TB[o${i}];[${last}][o${i}]overlay=eof_action=pass:format=auto[b${i}]`;
    last = `b${i}`;
  });
  const [fi, fo] = s.fade || [0, 0];
  graph += `;[${last}]trim=duration=${s.dur},setpts=PTS-STARTPTS${fi ? `,fade=t=in:st=0:d=${fi}` : ""}${fo ? `,fade=t=out:st=${(s.dur - fo).toFixed(2)}:d=${fo}` : ""},fps=30,format=yuv420p[v]`;
  ff([...inputs, "-filter_complex", graph, "-map", "[v]", "-t", String(s.dur), ...ENC, out]);
  if (s.id === "sequence") REVEAL = cursor;
  (s.vo || []).forEach(([n, at]) => cues.push({ n, at: cursor + at }));
  (s.hit || []).forEach((at) => hits.push(cursor + at));
  console.log(`${s.id.padEnd(9)} ${cursor.toFixed(1).padStart(6)}s  +${s.dur}s`);
  cursor += s.dur;
}
const TOTAL = cursor;

/* ---------------------------------------------------------------- picture: concat + Netflix finish */
await writeFile(`${SEG}/list.txt`, CUT.map((s) => `file '${s.id}.mp4'`).join("\n"));
ff(["-f", "concat", "-safe", "0", "-i", `${SEG}/list.txt`, "-vf",
  [
    "eq=contrast=1.07:saturation=1.06:gamma=0.97",
    "colorbalance=rs=-0.03:bs=0.05:rh=0.03:bh=-0.03", // cool shadows, warm highlights
    "vignette=PI/5.2",
    "noise=alls=5:allf=t+u",
    "drawbox=x=0:y=0:w=iw:h=60:color=black:t=fill",
    "drawbox=x=0:y=ih-60:w=iw:h=60:color=black:t=fill", // 2:1 letterbox
    "format=yuv420p",
  ].join(","),
  "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "22", "-maxrate", "9M", "-bufsize", "18M", "-pix_fmt", "yuv420p", "-r", "30", "-movflags", "+faststart", `${W}/picture.mp4`]);

/* ---------------------------------------------------------------- sound */
// Narration stem: each line placed at its cue, lightly polished.
const voInputs = cues.flatMap((c) => ["-i", `${W}/vo-${String(c.n).padStart(2, "0")}.wav`]);
const voGraph =
  cues.map((c, i) => `[${i}:a]highpass=f=85,acompressor=threshold=-20dB:ratio=3:attack=8:release=160,aecho=0.8:0.35:38:0.12,adelay=${Math.round(c.at * 1000)}:all=1[v${i}]`).join(";") +
  `;${cues.map((_, i) => `[v${i}]`).join("")}amix=inputs=${cues.length}:normalize=0:duration=longest,apad=whole_dur=${TOTAL},atrim=duration=${TOTAL},loudnorm=I=-15:TP=-1.5:LRA=9[vo]`;
ff([...voInputs, "-filter_complex", voGraph, "-map", "[vo]", "-ar", "48000", "-ac", "2", `${OUT}/kiki-trailer-vo-stem.wav`]);

if (music) {
  // Supplied track: trimmed to length, faded, ducked under the narration.
  ff(["-i", `${OUT}/kiki-trailer-vo-stem.wav`, "-i", music, "-filter_complex",
    `[1:a]${DROP == null ? "" : DROP > REVEAL ? `atrim=start=${(DROP - REVEAL).toFixed(2)},asetpts=PTS-STARTPTS,` : `adelay=${Math.round((REVEAL - DROP) * 1000)}:all=1,`}atrim=duration=${TOTAL},afade=t=in:d=1.5,afade=t=out:st=${(TOTAL - 3).toFixed(2)}:d=3,volume=0.9[m];[0:a]asplit[vo][key];` +
    `[m][key]sidechaincompress=threshold=0.03:ratio=6:attack=25:release=420[duck];[vo][duck]amix=inputs=2:normalize=0,alimiter=limit=0.95[a]`,
    "-map", "[a]", "-ar", "48000", `${W}/mix.wav`]);
} else {
  // Stand-in bed: a slow low drone plus impacts on the big cuts.
  ff(["-f", "lavfi", "-i", "sine=f=46:d=3.2", "-f", "lavfi", "-i", "anoisesrc=d=3.2:c=brown:a=0.9", "-filter_complex",
    "[1:a]lowpass=f=140[n];[0:a][n]amix=inputs=2:normalize=0,afade=t=out:st=0.05:d=3.1:curve=exp,volume=1.6,aformat=channel_layouts=stereo[b]",
    "-map", "[b]", "-ar", "48000", `${W}/boom.wav`]);
  const hitInputs = hits.flatMap(() => ["-i", `${W}/boom.wav`]);
  const drone = `sine=f=55:d=${TOTAL}[d1];sine=f=55.6:d=${TOTAL}[d2];sine=f=82.4:d=${TOTAL},volume=0.5[d3];[d1][d2][d3]amix=inputs=3:normalize=0,tremolo=f=0.11:d=0.5,lowpass=f=220,afade=t=in:d=4,afade=t=out:st=${(TOTAL - 4).toFixed(2)}:d=4,volume=0.11,aformat=channel_layouts=stereo[dr]`;
  const hg = hits.map((at, i) => `[${i + 1}:a]adelay=${Math.round(at * 1000)}:all=1,volume=0.55[h${i}]`).join(";");
  ff(["-i", `${OUT}/kiki-trailer-vo-stem.wav`, ...hitInputs, "-filter_complex",
    `${drone};${hg};[0:a][dr]${hits.map((_, i) => `[h${i}]`).join("")}amix=inputs=${hits.length + 2}:normalize=0:duration=first,alimiter=limit=0.95[a]`,
    "-map", "[a]", "-ar", "48000", `${W}/mix.wav`]);
}

ff(["-i", `${W}/picture.mp4`, "-i", `${W}/mix.wav`, "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-shortest", "-movflags", "+faststart", `${OUT}/kiki-trailer.mp4`]);
console.log(`site reveal lands at ${REVEAL.toFixed(1)}s`);
console.log(`\ndone: ${OUT}/kiki-trailer.mp4  ${Math.floor(TOTAL / 60)}:${String(Math.round(TOTAL % 60)).padStart(2, "0")}  (${music ? "with supplied music" : "stand-in drone + impacts"})`);
