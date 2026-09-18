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
  Header.tsx            wordmark, Menu / Experience / Private Events / VIP, Reserve; transparent over the hero
  BrandMark.tsx         the "KIKI on the Miami River" wordmark as a colourable mask
  Hero.tsx              hero photograph (+ blurred copy for the transition), ambient loop, tagline, chevron
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
  import-assets.mjs     converts the supplied stills in assets/source into public/images
  extract-petals.mjs    cuts real bracts and leaves out of the floral wordmark → public/petals, lib/petal-sprites.ts
  vectorize-logo.mjs    traces the 500px KIKI logo to SVG + a 2400px PNG
  brand-geometry.mjs    measures the traced logo → letter masks, outlines, lib/brand-geometry.ts
  encode-video.mjs      encodes a generated clip into desktop/mobile MP4 + poster
  verify-scroll.mjs     headless Playwright check of the sequence (desktop, mobile, reduced motion)
  prepare-assets.mjs    earlier fallback that crops the mockups
assets/mockups/         the two supplied mockups (source for interim crops)
public/images, public/video   the media the site loads
```

## Replacing images, videos and links

Everything is referenced from **`data/site-content.ts`**. Drop the file into
`public/` and update the path there.

| What | Path in `site-content.ts` | File |
|---|---|---|
| Hero photograph | `hero.image` | `public/images/hero.jpg` (16:9, ≥1920px wide, **no text** — the wordmark is a separate layer) |
| Logo | — | `assets/source/15-kiki-logo-white-500.png`, then `vectorize-logo.mjs` and `brand-geometry.mjs` |
| Corner florals | `florals.top` / `florals.down` | KIKI's watercolour corners (remote for now) |
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
| 0 – 22% | Hero holds. Photograph dollies 1.00 → 1.06. Six base petals drift. |
| 22 – 36% | Tagline, chevron and note fade out. |
| 22 – 68% | Plain wordmark scales from its hero size to 98vw (all four letters in frame, edge to edge), centre anchored. |
| 24 – 60% | Twenty‑nine more petals fade in at staggered times and parallax speeds. |
| 30 – 55% | Photograph softens: a pre‑blurred copy fades over the sharp one (opacity only). |
| 48 – 70% | Blurred photograph fades out, leaving warm stone. |
| 50 – 74% | Logo crossfades into the video‑filled letters while the watercolour corner florals bloom in. |
| 74 – 100% | Video layer settles with a slight scale. Videos start playing at 45%. |

After the pin releases, the wheel section starts exactly at the bottom edge of
the letters (a CSS calc from the wordmark proportions, so it holds at any
viewport), and the collage tucks under the wheel.

### How the video letters work

The letters are KIKI's real logo. The supplied file is only 500px wide, so
`scripts/vectorize-logo.mjs` traces it to `public/brand/kiki-logo.svg` (crisp at
any size) and a 2400px PNG. `scripts/brand-geometry.mjs` then measures the four
letters and writes:

- `public/brand/mask-*.png` — each letter's alpha, used as a CSS `mask-image`
  on a slot‑sized element holding that letter's poster and video;
- `public/brand/outline-*.png` — a dilated copy of each letter, masking a white
  layer beneath it that reads as the crisp outline;
- `lib/brand-geometry.ts` — the letter box aspect, per‑letter slots, and where
  the letter box sits inside each wordmark image.

`VideoLettermark` lays the vector logo (hero state) exactly over the masked
video letters, which is what lets the scroll timeline crossfade one into the
other. Video fills the letter strokes; the white outline layer fills the
engraved inlines. `BrandMark` renders the same vector as a mask so it can be
white over the hero, cobalt in the bar and white in the footer.

To change the logo: replace `assets/source/15-kiki-logo-white-500.png`, then run
`node scripts/vectorize-logo.mjs && node scripts/brand-geometry.mjs`.

### Florals and petals

The second section is framed by KIKI's own watercolour corner florals, placed
the way their site frames its menu (top‑left and bottom‑right, contained,
behind the type). They are referenced from `florals` in `data/site-content.ts`
and currently load from kikiontheriver.com; drop local copies in `public/brand`
and change the two paths to self‑host. The falling petals are single bracts
tinted to the same soft pink by `scripts/extract-petals.mjs`.

### Hero film

`hero.video` points at KIKI's own homepage film on their server (37 MB). The
hero still is the poster and the fallback. To self‑host, save the file locally,
run `node scripts/encode-video.mjs <file> hero`, and set the two paths to
`/video/hero.mp4` and `/video/hero-mobile.mp4`.

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
- Petals: 36 on desktop, 16 on mobile (`MOBILE_PETAL_LIMIT`), seeded so server
  and client markup match. They are single bracts carved out of the floral
  wordmark (plus two buds and a leaf), sized to a single flower in the logo
  (`PETAL_SIZE`, 16–32px), each falling with sway, a 3D rocking tumble (a few
  flip right over), a Y‑axis flutter and a slow spin; all transforms, paused
  off screen.
- GSAP contexts are reverted on unmount; Lenis is destroyed.

## Visual direction

White `#FFFFFF` · Aegean cobalt `#1238B8` · Bougainvillea pink `#E50064` ·
Warm stone `#F5F0E8`. Bodoni Moda for the wordmark and headings, Inter for
labels, Caveat for the handwritten notes. Easing: `cubic-bezier(0.65, 0, 0.15, 1)`.
