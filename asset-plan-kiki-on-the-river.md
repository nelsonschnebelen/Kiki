# Asset Plan — KIKI on the River

**Category:** Greek‑Mediterranean waterfront restaurant · **Mood:** bright, airy, editorial, celebratory · **Date:** 2026‑09‑17
**Higgsfield balance at planning time:** 1,200 credits

## Concept — "The table, then the night"

The visitor lands on the sunlit terrace. Bougainvillea sways and a few petals
fall. As they scroll, KIKI grows past the screen and the letters fill with four
living scenes: the pour, the lunch, the toast, the dance. Beneath, the wheel
turns day into night.

- **Opening frame:** the terrace at golden midday, clean sky and water behind the wordmark.
- **Transformation:** the wordmark scales up and fills with video; petals multiply.
- **Resting frame:** four looping letter videos on warm stone, wheel below.

All videos **loop in place** (start frame = end frame). They are played, not
scrubbed, so they do not need all‑keyframe encoding.

## Assets to generate

| # | Asset | Model | Params | Credits |
|---|---|---|---|---|
| 1 | Hero clean plate (no text), up to 3 passes | `nano_banana_pro` | 2k, 16:9, image_references = mock‑hero | 3 × 2 = **6** |
| 2 | Hero ambient loop | `seedance1_5` | 4s, 720p, 16:9, silent, start_image = end_image = #1 | **4.8** |
| 3 | Letter stills ×4 (chef pour, lunch, champagne, dancing) + 1 retry | `nano_banana_pro` | 2k, 3:4, batched | 5 × 2 = **10** |
| 4 | Letter loops ×4 | `seedance1_5` | 4s, 720p, 3:4, silent, start = end = still | 4 × 4.8 = **19.2** |
| 5 | Section stills ×7 (wheel day, wheel night, rose heart, long table, champagne, footer night, vase) | `nano_banana_pro` | 2k, batched | 7 × 2 = **14** |
| — | **Total** | | | **54** |

All figures are `get_cost` preflights measured today (2k still = 2.0; 4s/720p
clip = 4.8 in both 16:9 and 3:4).

Naive equivalent (five clips at 8s · 1080p · audio on = 24 each, plus separate
9:16 renders, plus 4k stills): **≈ 260 credits**.
Saving from the cost levers: **≈ 206 credits**.

Balance after: **1,146**

## Prompts (exact text that will be sent)

**#1 — Hero clean plate** (image_references: `assets/mockups/mock-hero.png`)
> Editorial photograph of a bright Greek‑Mediterranean waterfront restaurant terrace in Miami at golden midday, matching the reference image's scene, palette and mood exactly, but with absolutely no text, no logo, no signage and no buttons anywhere. Long white‑linen tables with blue‑and‑white Greek ceramic plates, olive oil bottles and lemons; white bistro chairs with blue ikat cushions; glamorous guests in white and pastel linen laughing over rosé; blue‑and‑white striped columns wrapped in vivid magenta bougainvillea; woven rattan pendant lanterns; sunlit Miami River with white yachts and a distant skyline; palm trees; a few loose bougainvillea petals drifting through the air. Keep open sky and water in the upper centre of the frame, reserved for typography. Bright, airy, high‑key exposure, natural sunlight, crisp detail, fashion‑magazine quality, 35mm lens, no dark shadows, no vignette.

**#2 — Hero ambient loop**
> One continuous locked‑off take. Bougainvillea branches sway very gently in a warm breeze; a handful of magenta petals drift slowly downward through the frame; sunlight glitters softly on the river; guests move subtly and naturally as they talk; a yacht in the far distance glides slowly. Extremely slow, calm, almost imperceptible motion. Consistent bright lighting throughout, no cuts, no camera movement, composition stays centred, final frame settles and matches the first frame for a seamless loop.

**#3 — Letter stills** (image_references: mock‑hero for palette; all vertical, subject centred with headroom)
> a. **K — chef pouring rosé.** Close portrait of a handsome chef in a navy chef jacket with a small embroidered crest, pouring pale pink rosé from a bottle into a stemmed glass at a white‑linen table set with Greek mezze, blue‑and‑white ceramic plates and lemons; bright waterfront terrace with bougainvillea and blue‑striped columns softly out of focus behind him; sunny midday, high‑key editorial photography.
> b. **I — Mediterranean lunch.** Glamorous guests in white and pastel linen at a long white table enjoying a Mediterranean lunch on a sunlit Miami River terrace; rosé glasses raised, Greek salads and grilled octopus on blue‑and‑white plates, magenta bougainvillea and a blue‑and‑white striped column, yachts and glittering water behind; bright, joyful, high‑key.
> c. **K — champagne celebration.** Hands raising coupe glasses around a magnum of champagne with a lit sparkler at a bright waterfront restaurant, bougainvillea petals in the air, guests in white and pastel laughing, blue‑striped columns and sunlit river behind; golden late‑afternoon light, celebratory but elegant.
> d. **I — dancing.** A glamorous woman in a blush‑pink satin dress dancing with arms raised beneath strings of warm festoon lights and bougainvillea at dusk on a waterfront terrace; a disco ball glints, guests wave white napkins in the air, magenta and warm‑pink lighting with a still‑bright sky; joyful fashion‑editorial energy.

**#4 — Letter loops** (start_image = end_image = the approved still; 4s, 720p, 3:4, silent)
> a. One continuous locked‑off take: the chef slowly pours rosé, the wine level in the glass rising gently; his eyes stay on the glass; soft bougainvillea petals drift past. Consistent bright lighting, no cuts, no camera movement, subject stays centred, motion settles at the end to match the first frame.
> b. One continuous locked‑off take: guests laugh and lean toward each other, glasses lift slightly and clink, sunlight sparkles on the water behind, a petal drifts down. Slow natural motion, consistent lighting, no cuts, no camera movement, settles to match the first frame.
> c. One continuous locked‑off take: the sparkler glows and sheds gentle sparks, coupe glasses rise together in a toast, petals fall slowly. Elegant slow motion, consistent lighting, no cuts, no camera movement, settles to match the first frame.
> d. One continuous locked‑off take: the woman sways and turns slowly with arms raised, disco‑ball light drifts across the scene, white napkins wave gently behind her, festoon lights twinkle. Slow glamorous motion, consistent lighting, no cuts, no camera movement, settles to match the first frame.

**#5 — Section stills** (2k, batched)
> a. **Wheel, day (1:1).** Square photograph of the KIKI terrace by bright day: white‑linen tables under a bougainvillea canopy, blue‑and‑white striped columns, the Miami River and yachts, guests in white; high‑key and sunny, centred composition.
> b. **Wheel, night (1:1).** Square photograph of the same terrace at night: a disco ball, warm festoon lights and magenta uplighting on the bougainvillea, guests dancing and waving white napkins, the skyline glowing across the river; vibrant and celebratory, never dark or muddy.
> c. **Rose heart (1:1).** Square photograph of a large heart sculpted from thousands of blush and pink roses mounted on a bougainvillea‑covered wall, with a pink neon script sign reading "Meet me at KIKI" glowing in front of it; bright daylight, editorial, centred.
> d. **Long table (16:10).** Photograph down the length of a long white‑linen table set for a private event under a bougainvillea canopy beside the Miami River: white chairs, blue‑and‑white Greek ceramics, lemons, olive oil, blue‑striped columns, yachts and skyline beyond; sunny golden afternoon, high‑key.
> e. **Champagne (4:5).** Vertical photograph of champagne bottles chilling in polished silver ice buckets on a white‑linen table at a waterfront terrace at golden hour, coupe glasses catching the light, bougainvillea and a blue‑striped column softly behind; bright and luxurious.
> f. **Footer, night (21:9).** Ultra‑wide photograph of a joyful crowd dancing on a bougainvillea‑canopied waterfront terrace at night, white napkins twirling overhead, a disco ball, warm festoon lights, magenta and gold light, the Miami skyline glowing across the river; celebratory and vibrant, not dark.
> g. **Vase (3:4).** Vertical still life of a tall blue‑and‑white Greek ceramic vase with a meander pattern, filled with magenta bougainvillea, on a white‑linen table with a sunlit river terrace softly behind; bright, editorial.

## Supplied by the client (no credits)

- Two mockups (`assets/mockups/`). Used as image references for palette and
  mood, and cropped into interim photography so the site runs today.

## Not generating, and why

- **Mobile video versions** — encoded from the desktop masters with
  `scripts/encode-video.mjs` (free).
- **Poster frames** — extracted from each clip by the same script (free).
- **A 9:16 hero** — the 16:9 master is cropped with `object-fit: cover`.
- **Hero video at 1080p or 8s** — it sits behind live type and is re‑encoded for web; 720p/4s is indistinguishable and a quarter of the price.
- **Petals** — drawn as SVG in `PetalField.tsx`; no image needed.

---

**Approval required.** Reply "approved" to spend 54 credits, or tell me what to
change. Nothing is generated until then.
