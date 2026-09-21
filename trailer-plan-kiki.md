# KIKI — "It's Time" · Website reveal trailer

> **Status, 2026-09-21: first cut built.** `trailer/out/kiki-trailer.mp4`, 2:21, 1080p, Netflix-style finish (2:1 letterbox, grade, grain, push-in title cards). Female narration (Higgsfield voice "Soraya", chosen as the lowest-pitched of 24 presets). The Dishio act was expanded to six panels using the real capability list from get.dish.io, so the running time grew from the planned 70 seconds. Music is Nelson's Suno track "Final Hit" (trailer/assets/music/final-hit.mp3, 100 BPM, final hit at 168.52s). Mix it with: `node trailer/build-trailer.mjs trailer/assets/music/final-hit.mp3 --hit=168.52 --bpm=100` (add `--audio-only` to skip re-rendering picture). The intro plays from the top; at the site reveal (37.7s) it cuts 40 bars forward so the final hit lands at 133.7s as the picture goes to black for the logo. Dishio sections use the real brand kit (trailer/brand, local only). Spend: 22.3 credits.
>
> Rebuild from scratch: `node trailer/capture-site.mjs` → `node trailer/render-titles.mjs` → `node trailer/build-trailer.mjs [music]`. The cut, cue times and overlays are one table (`CUT`) in build-trailer.mjs.

**Update, one-minute cut.** The default build is now 1:02 (`trailer/out/kiki-trailer.mp4`); `--long` builds the 2:22 version as `kiki-trailer-full.mp4`. Audio was reworked after clicks and distortion in v2: every narration line is faded at both edges, the narration uses fixed gain instead of a loudness leveller, the music sits at -9 dB with slow ducking, and the limiter no longer engages. `node trailer/audio-qc.mjs` measures edge clicks, peaks and the voice-over-music margin.

The plan below is the original brief, kept for reference.

**Format:** 16:9, 1080p, about 70 seconds · **Tone:** Netflix title sequence. Slow, confident, dark-to-bright. Short lines, long pauses, hard cuts on the beat.
**Audience:** KIKI's owners and marketing team, in the room or on a link.
**Higgsfield balance:** 1,197.6 credits

## The idea

Three acts. **The legend** (KIKI is already world-class). **The gap** (the website isn't). **The reveal** (the new site, feature by feature, then the intelligence behind it). It ends on the logo and one line.

## Script

Narration is in quotes. ON SCREEN lines are title cards in the site's own type (Bodoni caps, cobalt and white).

### Act 1 — The legend (0:00 – 0:16)

| Time | Picture | Narration / on screen |
|---|---|---|
| 0:00 | Black. Low hum. A single bougainvillea petal falls through the dark. | — |
| 0:03 | **[Generated]** Aerial drift up the Miami River at blue hour, city lights coming on. | "Some places you visit." |
| 0:07 | KIKI's own footage: the fly-through of the room, slowed. | "Some places… you never forget." |
| 0:11 | Fast cuts on the beat: champagne sparklers, the samba dancers, napkins in the air, the yacht. | ON SCREEN: **MIAMI · WORLD-RENOWNED** |
| 0:14 | Hard cut to black. | "KIKI is known around the world." |

### Act 2 — The gap (0:16 – 0:26)

| Time | Picture | Narration / on screen |
|---|---|---|
| 0:16 | Black. One beat of silence. | "A brand like this deserves the best." |
| 0:20 | **[Generated]** Macro: petals lifting off a white tablecloth in slow motion, as if the room inhales. | "And the best… never stands still." |
| 0:24 | ON SCREEN, one word at a time: **IT'S TIME · TO EVOLVE** | — |

### Act 3 — The reveal (0:26 – 1:02)

Real screen recordings of the live site, captured at 60fps, framed in a floating browser with soft shadow.

| Time | Picture | Narration / on screen |
|---|---|---|
| 0:26 | The hero: three live panels of KIKI at night, logo over the top. Music drops in. | "This is the new KIKI on the River." |
| 0:31 | The scroll: the logo grows until it fills the screen and the letters fill with film. | "A homepage that moves like the night does." ON SCREEN: **CINEMATIC SCROLL** |
| 0:37 | Petals falling through the letters; the watercolour flowers blooming in. | ON SCREEN: **EVERY DETAIL, ON BRAND** |
| 0:40 | The wheel turning, sun to moon, the picture dissolving from day to night. | "From the first rosé… to the last dance." ON SCREEN: **DAY TURNS INTO NIGHT** |
| 0:46 | The booking bar: a date, six guests, 8:30. The drawer slides in with real availability. | "A table, booked in seconds. Without ever leaving." ON SCREEN: **RESERVATIONS, BUILT IN · POWERED BY SEVENROOMS** |
| 0:53 | Phone mock-up: the same site in a hand, scrolling. | ON SCREEN: **FLAWLESS ON EVERY SCREEN** |
| 0:56 | The four-panel footer film. | "Built from your world. Not a template." |

### Act 4 — The intelligence (1:02 – 1:14)

| Time | Picture | Narration / on screen |
|---|---|---|
| 1:02 | **[Generated]** Dark data visual: fine cobalt lines tracing from a glowing site into a network of points. | "And behind the beauty… intelligence." |
| 1:05 | Motion graphic: click events lighting up on the site (Reserve · VIP · Private Events), each spawning an audience tag. | "Fully integrated with Dishio. Every click, tracked. Every visitor, understood." |
| 1:09 | Tags resolve into three audience cards: **VIP INTENT · PRIVATE EVENTS · DATE-NIGHT DINERS** | "Custom audiences, built in real time, the moment a guest shows intent." ON SCREEN: **FIRST-PARTY DATA · REAL-TIME AUDIENCES · FULL-FUNNEL ATTRIBUTION** |

### Close (1:14 – 1:20)

| Time | Picture | Narration / on screen |
|---|---|---|
| 1:14 | Everything cuts to black. The KIKI logo resolves, petals falling past it. | "KIKI on the River." |
| 1:17 | ON SCREEN: **THE NEXT ERA · PRESENTED BY DISHIO** | "The next era starts now." |

**Narration word count:** about 150 words, which reads at trailer pace in roughly 70 seconds with pauses.

## What gets generated on Higgsfield

| # | Asset | Model | Settings | Credits |
|---|---|---|---|---|
| 1 | Voiceover, full script | `seed_audio` | one read; up to two retakes for pacing | about 2 each, **6 max** |
| 2 | Start frame: Miami River aerial, blue hour | `nano_banana_pro` | 2k, 16:9 | 2 |
| 3 | Aerial drift clip from #2 | `veo3_1` | 4s, 16:9, silent | 11 |
| 4 | Start frame: petals on a white tablecloth, macro | `nano_banana_pro` | 2k, 16:9 | 2 |
| 5 | Petals lifting clip from #4 | `seedance1_5` | 4s, 720p, silent | 4.8 |
| 6 | Start frame: dark cobalt data network | `nano_banana_pro` | 2k, 16:9 | 2 |
| 7 | Data network clip from #6 | `seedance1_5` | 4s, 720p, silent | 4.8 |
| — | **Total** | | | **about 33** |

All prices are preflighted today. Balance after: about 1,165.

Two retakes are budgeted for the voice only. Each still gets reviewed before it is animated, so a bad frame never becomes a paid clip.

## What costs nothing

- **Site footage.** Recorded from the live site with a scripted browser at 60fps, so the scroll is perfectly smooth and repeatable. Desktop and phone.
- **KIKI's own footage.** Already in the project: the fly-through, the party, the yacht, the nightlife reel.
- **Title cards, the browser frame, the audience-tag motion graphics, and the edit.** Built and cut locally.

## Three things I need from you

1. **Music.** Higgsfield does not generate standalone music, and a trailer lives or dies on its track. I need a licensed track from you (Artlist, Epidemic, Musicbed or similar): dark, building, a drop around 0:26. Without one I will cut it to a simple pulse and you can lay music over it later.
2. **The voice.** Deep, unhurried, male is the classic trailer read. From Higgsfield's presets I would start with **Arthur** or **Cillian**. Say if you would rather a female voice, which can suit KIKI's brand better.
3. **The Dishio claims.** See below.

## About "fully integrated with Dishio"

Right now the site has no tracking on it at all. The trailer says it is fully integrated, that every click is tracked, and that custom audiences are built from clicks. If KIKI's team opens the site's inspector, or asks to see an audience, that line has to hold up.

The good news is that it is cheap to make true. I can add a clean event layer to the site in about an hour: Reserve clicks, booking searches (with party size and date), VIP and private-event intent, scroll depth, and film engagement, all pushed to a standard data layer. With your Dishio snippet and your Meta and Google pixel IDs, those events build exactly the audiences the trailer names. Then the script is simply accurate.

If you would rather not wire it before the pitch, I would soften two lines to "built to integrate with Dishio" and "ready to track every click". Your call. The script above is written your way.

---

**Approval required.** Reply "approved" to spend about 33 credits, and tell me your answers to the three questions. Nothing is generated until then.
