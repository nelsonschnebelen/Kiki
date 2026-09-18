# KIKI on the River — homepage

A single continuous cinematic homepage: a bright hero photograph, the KIKI
wordmark growing past the viewport and turning into four video‑filled letters,
petals drifting through the typography, and the "Day turns into night" wheel
resolving beneath it.

## Stack

- Next.js 15 (App Router) · TypeScript · Tailwind CSS 4
- GSAP 3 + ScrollTrigger (pinned, scrubbed sequence) · Lenis smooth scrolling
- Native HTML5 video, `next/image` for all photography
- SVG letter clipping for the video‑filled KIKI (see notes below)

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000. `npm run build` produces the production bundle.

Copy `.env.example` to `.env.local` to point the Reserve buttons somewhere else.

## Where things live

```
app/
  layout.tsx            fonts (Bodoni Moda, Inter, Caveat), metadata, reduced‑motion pre‑paint script
  page.tsx              page composition
  globals.css           tokens, wordmark sizing variables, Lenis + utility styles
components/
  Header.tsx            slim bar that slides in after the sequence (wordmark + Reserve)
  Hero.tsx              hero photograph, ambient video loop, Reserve button, scroll hint
  PetalField.tsx        seeded bougainvillea petals (drift, parallax, cursor repulsion)
  KikiScrollSequence.tsx  the pinned GSAP timeline that ties hero -> letters together
  VideoLettermark.tsx   KIKI as four independently clipped letters (solid / video / posters)
  ExperienceWheel.tsx   rotating Greek‑border wheel, "Your table. Your night." + CTAs
  MeetMeSection.tsx     rose heart, long table, champagne collage
  SiteFooter.tsx        night‑time close with the wordmark
  ReducedMotionFallback.tsx  static composition for prefers‑reduced‑motion
  ReserveButton.tsx     magnetic cobalt CTA with colour inversion
  Reveal.tsx            once‑only fade/lift on scroll
  SmoothScroll.tsx      Lenis bootstrap
lib/
  animation.ts          GSAP registration, custom eases, choreography constants, device helpers, Lenis
  petal-config.ts       seeded petal generator (deterministic → no hydration warnings)
data/
  site-content.ts       ALL copy, links, image and video paths
scripts/
  prepare-assets.mjs    crops the supplied mockups into interim photography
  encode-video.mjs      encodes a generated clip into desktop/mobile MP4 + poster
assets/mockups/         the two supplied mockups (source for interim crops)
public/images, public/video   the media the site loads
```

## Replacing images, videos and links

Everything is referenced from **`data/site-content.ts`**. Drop the file into
`public/` and update the path there.

| What | Path in `site-content.ts` | File |
|---|---|---|
| Hero photograph | `hero.image` | `public/images/hero.jpg` (16:9, ≥1920px wide, **no text** — the wordmark is live type) |
| Hero ambient loop | `hero.video.desktop` / `.mobile` | `public/video/hero.mp4`, `hero-mobile.mp4` |
| Letter videos | `letters[n].video.desktop` / `.mobile` | `public/video/letters/k1.mp4`, `i1`, `k2`, `i2` (+ `-mobile`) |
| Letter posters | `letters[n].video.poster` | `public/images/letters/*.jpg` (portrait, 3:4) |
| Wheel centre | `wheel.centerImage` | `public/images/wheel-center.jpg` (square, left = day, right = night) |
| Collage | `meet.heart / table / champagne` | `public/images/heart.jpg`, `long-table.jpg`, `champagne.jpg` |
| Footer | `footer.image` | `public/images/nightlife.jpg` (wide) |
| Reserve link | `reservationUrl` | or `NEXT_PUBLIC_RESERVATION_URL` in `.env.local` |
| Private events link | `privateEventsUrl` | or `NEXT_PUBLIC_PRIVATE_EVENTS_URL` |

Until real videos exist the letters and hero show their poster images; a
missing or failing video never breaks the page.

### Encoding generated clips

```bash
node scripts/encode-video.mjs path/to/raw-k1.mp4 letters/k1
node scripts/encode-video.mjs path/to/raw-hero.mp4 hero
```

Writes the desktop MP4 (1280px long edge), the mobile MP4 (720px) and the poster
JPEG in one go. Sources are chosen at runtime: mobile viewports get the
`-mobile` file, and visitors on data‑saver or 2G/3G connections get posters only.

### Photography pipeline

The supplied stills live in `assets/source/` (named by slot). Running
`node scripts/import-assets.mjs` converts them into every image under
`public/images`, including the day/night wheel composite and the champagne and
marina crops. Replace a source file and re-run to update the site.

`scripts/prepare-assets.mjs` is the earlier fallback that crops the mockups;
it is no longer needed unless a source still is missing.

Videos are the remaining generated assets; see `asset-plan-kiki-on-the-river.md`.

## The scroll sequence

The hero is pinned for 2.8× the viewport height (2× on mobile). The timeline is
scrubbed by scroll; fractions below are of that distance
(`SEQUENCE` in `lib/animation.ts`).

| Progress | What happens |
|---|---|
| 0 – 25% | Hero holds. Photograph dollies 1.00 → 1.06. Five base petals drift. |
| 25 – 40% | Reserve button, note and scroll hint fade out. |
| 25 – 72% | Wordmark scales from its hero size to 108vw (118vw mobile), centre anchored. |
| 30 – 70% | Thirteen more petals fade in at staggered times and parallax speeds. |
| 45 – 70% | Solid white letters crossfade into the video‑filled letters. |
| 62 – 90% | Photograph fades; the stone section resolves beneath the typography. |
| 70 – 100% | Video layer settles with a slight scale. Videos start playing at 42%. |

After the pin releases, the wheel section overlaps the bottom of the letters.

### How the video letters work

`VideoLettermark` lays the word out in a fixed 1000×300 design box. Each letter
is an SVG `<clipPath clipPathUnits="objectBoundingBox">` containing the glyph
itself, applied to a slot‑sized element holding that letter's poster and video.
A second SVG draws the white outline on top; a third, solid‑white SVG sits above
both for the hero state. Glyph widths are measured once the display font is
ready so the clip, outline and solid layers always line up.

`clipPath` is used instead of `<mask>` because CSS references to inline SVG
masks are not supported by Safari; the effect is identical.

The wordmark element is laid out at its **final** size and scaled *down* for the
hero, so the browser rasterises it at full resolution and the scrub stays crisp.

## Accessibility and performance

- `prefers-reduced-motion`: no pinning, no scrubbing, no video, no petal motion.
  The static hero and poster‑filled letters render instead (a pre‑paint script
  tags `<html data-motion="reduce">` so nothing flashes).
- Keyboard: skip link, visible focus rings, real links for every CTA.
- Only `transform` and `opacity` are animated. Blur on far petals is static.
- Videos: `muted loop playsInline preload="metadata"`, sources attached lazily
  when the letters reveal, paused when off screen, hidden on error.
- Cursor repulsion and magnetic hover only run on fine pointers.
- Petals: 18 on desktop, 8 on mobile (`MOBILE_PETAL_LIMIT`), seeded so server
  and client markup match.
- GSAP contexts are reverted on unmount; Lenis is destroyed.

## Visual direction

White `#FFFFFF` · Aegean cobalt `#1238B8` · Bougainvillea pink `#E50064` ·
Warm stone `#F5F0E8`. Bodoni Moda for the wordmark and headings, Inter for
labels, Caveat for the handwritten notes. Easing: `cubic-bezier(0.65, 0, 0.15, 1)`.
