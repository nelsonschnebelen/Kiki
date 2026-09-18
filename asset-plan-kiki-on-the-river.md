# Asset Plan — KIKI on the River

**Category:** Greek‑Mediterranean waterfront restaurant · **Mood:** bright, airy, editorial, celebratory · **Date:** 2026‑09‑17
**Higgsfield balance at planning time:** 1,200 credits

## Concept — "The table, then the night"

The visitor lands on the sunlit terrace. Bougainvillea sways and a few petals
fall. As they scroll, KIKI grows past the screen and the letters fill with four
living scenes: the pour, the lunch, the toast, the dance. Beneath, the wheel
turns day into night.

- **Opening frame:** the supplied hero still (chef pouring, guests, Greek flag, river).
- **Transformation:** the wordmark scales up and fills with video; petals multiply.
- **Resting frame:** four looping letter videos on warm stone, wheel below.

All videos **loop in place** (start frame = end frame = the supplied still).
They are played, not scrubbed, so they do not need all‑keyframe encoding.

## Assets to generate

Every still is already supplied, so only motion is generated.

| # | Asset | Model | Params | Credits |
|---|---|---|---|---|
| 1 | Hero ambient loop | `seedance1_5` | 4s, 720p, 16:9, silent, start_image = end_image = `01-kiki-hero-restaurant` | **4.8** |
| 2 | Letter loop K1 (chef pouring rosé) | `seedance1_5` | 4s, 720p, 3:4, silent, start = end = `02-letter-k-chef-rose` | **4.8** |
| 3 | Letter loop I1 (Mediterranean lunch) | `seedance1_5` | 4s, 720p, 3:4, silent, start = end = `03-letter-i-daytime-dining` | **4.8** |
| 4 | Letter loop K2 (champagne celebration) | `seedance1_5` | 4s, 720p, 3:4, silent, start = end = `04-letter-k-champagne` | **4.8** |
| 5 | Letter loop I2 (dancing) | `seedance1_5` | 4s, 720p, 3:4, silent, start = end = `05-letter-i-nightlife` | **4.8** |
| — | **Total** | | | **24** |

Preflighted today: a 4s / 720p `seedance1_5` clip is 4.8 credits in both 16:9
and 3:4. Budget one retry (4.8) if a loop drifts: **worst case 28.8**.

Naive equivalent (8s · 1080p · audio on = 24 each, plus separate 9:16 renders):
**≈ 240 credits**. Saving from the cost levers: **≈ 216 credits**.

Balance after: **1,176** (1,171 with one retry)

## Prompts (exact text that will be sent)

**#1 — Hero ambient loop**
> One continuous locked‑off take. Bougainvillea branches sway very gently in a warm breeze; a handful of magenta petals drift slowly downward through the frame; sunlight glitters softly on the river; the chef's pour continues in a slow, steady stream; guests move subtly and naturally as they talk. Extremely slow, calm, almost imperceptible motion. Consistent bright lighting throughout, no cuts, no camera movement, composition stays centred, final frame settles and matches the first frame for a seamless loop.

**#2 — K1, chef pouring rosé**
> One continuous locked‑off take: the chef slowly pours rosé, the wine level in the glass rising gently; his eyes stay on the glass; soft bougainvillea petals drift past; sunlight glitters on the water behind. Consistent bright lighting, no cuts, no camera movement, subject stays centred, motion settles at the end to match the first frame.

**#3 — I1, Mediterranean lunch**
> One continuous locked‑off take: guests laugh and lean toward each other, glasses of rosé lift slightly and clink, sunlight sparkles on the water behind, a petal drifts down. Slow natural motion, consistent lighting, no cuts, no camera movement, settles to match the first frame.

**#4 — K2, champagne celebration**
> One continuous locked‑off take: the sparklers on the champagne bottles glow and shed gentle sparks, coupe glasses rise together in a toast, petals fall slowly. Elegant slow motion, consistent lighting, no cuts, no camera movement, settles to match the first frame.

**#5 — I2, dancing**
> One continuous locked‑off take: the woman sways and turns slowly with her arm raised, disco‑ball light drifts across the scene, white napkins wave gently behind her, festoon lights twinkle. Slow glamorous motion, consistent lighting, no cuts, no camera movement, settles to match the first frame.

## Supplied by the client (no credits)

- All twelve stills in `assets/source/` (hero, four letters, long table, wheel
  day, wheel night, rose heart, sunset table, waterfront, nightlife banner).
  These replace every image generation in the earlier draft of this plan and
  are already live on the site via `scripts/import-assets.mjs`.

## Not generating, and why

- **Any still** — supplied.
- **Mobile video versions** — encoded from the masters with `scripts/encode-video.mjs` (free).
- **Poster frames** — the supplied stills are the posters.
- **A 9:16 hero** — the 16:9 master is cropped with `object-fit: cover`.
- **1080p or 8s clips** — they sit behind live type at letter size; 720p/4s is indistinguishable and a quarter of the price.

---

**Approval required.** Reply "approved" to spend 24 credits (up to 28.8 with one
retry), or tell me what to change. Nothing is generated until then.
