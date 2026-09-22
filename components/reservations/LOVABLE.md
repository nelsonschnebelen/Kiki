# Making Dishio's KIKI reservations brighter — the quick way

Reference build: https://kiki-on-the-river.vercel.app/reservations/lite
(the fuller KIKI version, for comparison: /reservations)

Nothing structural changes. It is a recolor of the existing Dishio flow:
light surfaces instead of black, KIKI pink as the accent, cobalt type.
Everything below is a find-and-replace on the current Lovable project.

## 1. Brand config (the `kiki` entry)

```ts
accent: "#E50064",        // was #3B82F6
accentLight: "#FF3F8E",   // was #60A5FA
accentRgb: "229,0,100",   // was 59,130,246
heroImage: "<KIKI terrace by day>",   // the bright lunch-on-the-terrace photo, not the steak
```

## 2. Page and surfaces

| Today (dark)                                  | Bright                                   |
|-----------------------------------------------|------------------------------------------|
| page background `#000` / `#0a0a0a`            | `#F7F4EE`                                |
| card `rgba(255,255,255,0.04)` + blur          | `rgba(255,255,255,0.82)` + blur, `0 0 0 1px rgba(18,56,184,0.06)` ring |
| card inner highlight `inset 0 1px 0 rgba(255,255,255,0.06)` | drop it                        |
| borders `rgba(255,255,255,0.08)` / `border-white/10` | `rgba(18,56,184,0.12)`            |
| hero overlay: fade to black at the bottom     | fade to `#F7F4EE` at the bottom (same gradient, other colour) |
| footer bar `rgba(20,20,22,0.78)`              | `rgba(255,255,255,0.9)`                  |

## 3. Type

| Today                     | Bright                          |
|---------------------------|---------------------------------|
| `text-white`              | `text-[#1238B8]` (cobalt)       |
| `text-white/60`, `/50`    | `text-[#0E2C93]/60`, `/50`      |
| selected chip `text-black` on accent | `text-white` on accent |
| step circles: white ring on black | cobalt/20 ring on white; active = pink fill |

Font stays Inter. No serif, no script, no petals in this option.

## 4. Buttons and chips

- Primary button: `bg-[var(--brand-accent)] text-white` (was `text-black`),
  shadow `0 18px 40px -14px rgba(var(--brand-accent-rgb),0.7)`.
- Selected chip / date card: pink fill, white text, same shadow.
- Unselected chip: `bg-white border-[#1238B8]/20 text-[#1238B8]`.

## 5. Lovable prompt (paste as-is)

> Restyle the KIKI reservations flow (landing + 6 steps) to a bright theme.
> Keep every component, layout and step exactly as they are. Change only
> colours: page background #F7F4EE; cards white at 82% with the existing
> blur and a 1px rgba(18,56,184,0.06) ring; all white text becomes cobalt
> #1238B8 (secondary text #0E2C93 at 60%); borders rgba(18,56,184,0.12);
> KIKI brand accent #E50064 with accentLight #FF3F8E and accentRgb
> 229,0,100; text on accent buttons and selected chips is white; the hero
> overlay fades to #F7F4EE instead of black; use the daytime terrace photo
> as the hero. Font stays Inter.

That is the whole change. Roughly 20 class/variable edits.
