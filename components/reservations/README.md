# KIKI reservations (Dishio flow)

Dishio's reservation landing and six-step flow, restyled for KIKI on the River.
Built to drop into the Dishio Lovable project unchanged:

- Plain React + Tailwind (layout only) + framer-motion. No Next.js APIs.
- Brand tokens, type, glass, buttons and petal keyframes live in
  `reservations.css`, scoped under `.kiki-rsv`.
- Colours are literal (`#E50064` pink, `#1238B8` cobalt, `#F5F0E8` stone), so
  no Tailwind config changes are needed.
- Fonts: Bodoni Moda, Inter and Caveat. Here they come from `next/font`
  (`--font-bodoni` etc.); in Lovable add them from Google Fonts and the CSS
  falls back to the family names.
- Assets referenced from `/public`: `/brand/kiki-logo.svg`, `/petals/*-soft.png`,
  `/images/*`. Copy them across, or point `config.ts` at Dishio's asset store.

Files:

| File | What |
|---|---|
| `KikiReservations.tsx` | Entry. Landing → steps, state, transitions. |
| `Landing.tsx` | Hero, rating, Reserve a Table, spaces, details. |
| `steps.tsx` | Phone · When & where (+ floor plan) · Details · Add-ons · Payment · Confirmed. |
| `ui.tsx` | Petals, florals, wordmark, buttons, chips, fields, stepper, meander. |
| `config.ts` | KIKI's Dishio config: spaces, add-ons, valet, occasions, times, tables. |
| `reservations.css` | Tokens and the handful of classes the components use. |

Nothing is submitted anywhere; the payment step is a mock.
