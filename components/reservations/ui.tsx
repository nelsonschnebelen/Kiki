import { useMemo, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion } from "framer-motion";
import { RESTAURANT } from "./config";

/* ---------------------------------------------------------------------------
 * Petals: single bougainvillea bracts falling through the page, in CSS.
 * ------------------------------------------------------------------------- */
const SPRITES = ["/petals/petal-01-soft.png", "/petals/petal-02-soft.png", "/petals/petal-03-soft.png", "/petals/petal-04-soft.png", "/petals/petal-05-soft.png", "/petals/petal-06-soft.png", "/petals/bract-14-soft.png", "/petals/bract-16-soft.png"];

function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface PetalsProps {
  count?: number;
  seed?: number;
  /** Bigger, slower petals for a hero; smaller for ambient. */
  scale?: number;
  className?: string;
}

export function Petals({ count = 10, seed = 7, scale = 1, className = "" }: PetalsProps) {
  const petals = useMemo(() => {
    const r = seeded(seed);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      src: SPRITES[Math.floor(r() * SPRITES.length)],
      x0: `${Math.round(r() * 100)}vw`,
      w: `${Math.round((14 + r() * 16) * scale)}px`,
      dur: `${(12 + r() * 12).toFixed(1)}s`,
      delay: `${(-r() * 24).toFixed(1)}s`,
      drift: `${Math.round((r() - 0.5) * 30)}vw`,
      r0: `${Math.round(r() * 360)}deg`,
      o: (0.55 + r() * 0.4).toFixed(2),
      flutter: `${(2.4 + r() * 2.2).toFixed(1)}s`,
      yStatic: `${Math.round(10 + r() * 70)}vh`,
    }));
  }, [count, seed, scale]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {petals.map((p) => (
        <span
          key={p.id}
          className="k-petal"
          style={{ "--x0": p.x0, "--w": p.w, "--dur": p.dur, "--delay": p.delay, "--drift": p.drift, "--r0": p.r0, "--o": p.o, "--flutter": p.flutter, "--y-static": p.yStatic } as React.CSSProperties}
        >
          <img src={p.src} alt="" draggable={false} />
        </span>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Watercolour florals in the corners
 * ------------------------------------------------------------------------- */
export function Florals({ variant = "both" }: { variant?: "both" | "top" | "bottom" }) {
  return (
    <>
      {variant !== "bottom" && <img src={RESTAURANT.florals.top} alt="" className="k-floral -left-[8%] -top-[2%] w-[58%] max-w-[420px]" draggable={false} />}
      {variant !== "top" && <img src={RESTAURANT.florals.down} alt="" className="k-floral -bottom-[2%] -right-[10%] w-[62%] max-w-[460px]" draggable={false} />}
    </>
  );
}

/* ---------------------------------------------------------------------------
 * Wordmark: the traced KIKI logo as a mask, so it takes any colour.
 * ------------------------------------------------------------------------- */
export function Wordmark({ color = "#1238B8", className = "" }: { color?: string; className?: string }) {
  return (
    <span
      role="img"
      aria-label={RESTAURANT.name}
      className={`inline-block ${className}`}
      style={{
        aspectRatio: "2400 / 658",
        backgroundColor: color,
        maskImage: `url(${RESTAURANT.logo})`,
        WebkitMaskImage: `url(${RESTAURANT.logo})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

/* ---------------------------------------------------------------------------
 * Buttons, chips, fields
 * ------------------------------------------------------------------------- */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "pink" | "ghost" | "white";
  full?: boolean;
  arrow?: boolean;
}

export function Button({ variant = "pink", full, arrow, className = "", children, ...rest }: ButtonProps) {
  return (
    <button type="button" className={`k-btn k-btn-${variant} ${full ? "w-full" : ""} ${className}`} {...rest}>
      <span>{children}</span>
      {arrow && (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      )}
    </button>
  );
}

export function Chip({ on, className = "", children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { on?: boolean }) {
  return (
    <button type="button" data-on={on ? "true" : "false"} aria-pressed={on} className={`k-chip ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function Field({ label, hint, children }: { label: ReactNode; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="k-label">{label}</span>
      {children}
      {hint && <span className="mt-2 block text-[11px] leading-relaxed text-[#0E2C93]/60">{hint}</span>}
    </label>
  );
}

/* ---------------------------------------------------------------------------
 * Greek key divider
 * ------------------------------------------------------------------------- */
export function Meander({ units = 5, className = "", color = "currentColor" }: { units?: number; className?: string; color?: string }) {
  const w = units * 40;
  return (
    <svg viewBox={`0 0 ${w} 16`} width={w} height={16} className={`k-meander ${className}`} aria-hidden focusable="false">
      <g fill="none" stroke={color} strokeWidth="1.4" strokeLinejoin="miter" strokeLinecap="square">
        {Array.from({ length: units }, (_, i) => (
          <path key={i} d="M0 14 H7 V2 H33 V10 H13 V6 H27 M33 14 H40" transform={`translate(${i * 40} 0)`} />
        ))}
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------------------
 * Step progress: six stops on a line, the pink fills as you go.
 * ------------------------------------------------------------------------- */
export function Stepper({ step, total = 6, labels }: { step: number; total?: number; labels: string[] }) {
  return (
    <div className="w-full" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step} aria-label={`Step ${step} of ${total}: ${labels[step - 1]}`}>
      <div className="relative mx-auto flex max-w-[360px] items-center justify-between">
        <span className="absolute left-3 right-3 top-1/2 h-px -translate-y-1/2 bg-[#1238B8]/15" aria-hidden />
        <motion.span
          className="absolute left-3 top-1/2 h-px -translate-y-1/2 bg-[#E50064]"
          aria-hidden
          initial={false}
          animate={{ width: `calc((100% - 24px) * ${(step - 1) / (total - 1)})` }}
          transition={{ duration: 0.7, ease: [0.65, 0, 0.15, 1] }}
        />
        {Array.from({ length: total }, (_, i) => {
          const n = i + 1;
          const done = n < step;
          const now = n === step;
          return (
            <span
              key={n}
              className={`relative z-10 grid h-6 w-6 place-items-center rounded-full border text-[10px] font-semibold transition-all duration-500 ${
                now ? "scale-110 border-[#E50064] bg-[#E50064] text-white shadow-[0_8px_20px_-8px_rgba(229,0,100,0.8)]" : done ? "border-[#E50064] bg-[#E50064]/90 text-white" : "border-[#1238B8]/20 bg-white text-[#1238B8]/60"
              }`}
            >
              {done ? "✓" : n}
            </span>
          );
        })}
      </div>
      <p className="mt-3 text-center text-[10px] font-semibold uppercase tracking-[0.4em] text-[#0E2C93]/60">{labels[step - 1]}</p>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Step heading in the site's voice
 * ------------------------------------------------------------------------- */
export function StepTitle({ script, title, subtitle }: { script?: string; title: string; subtitle?: string }) {
  return (
    <header className="text-center">
      {script && <p className="k-script text-[26px] leading-none text-[#E50064]">{script}</p>}
      <h2 className="k-display mt-2 text-[30px] uppercase leading-[1.08] tracking-[0.08em] text-[#1238B8] sm:text-[34px]">{title}</h2>
      {subtitle && <p className="mx-auto mt-4 max-w-[36ch] text-[14px] leading-[1.7] text-[#0E2C93]/70">{subtitle}</p>}
      <Meander units={4} className="mx-auto mt-5 text-[#1238B8]/60" />
    </header>
  );
}

export const money = (n: number) => `$${n.toLocaleString("en-US")}`;
export const fmtTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};
export const fmtDate = (iso: string, opts: Intl.DateTimeFormatOptions = { weekday: "long", month: "long", day: "numeric" }) =>
  new Date(iso + "T12:00:00").toLocaleDateString("en-US", opts);
