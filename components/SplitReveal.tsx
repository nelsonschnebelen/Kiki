"use client";

import { createElement, useEffect, useRef, type ReactNode } from "react";
import { gsap, SplitText, registerGsap, prefersReducedMotion, EASE } from "@/lib/animation";

type Tag = "h1" | "h2" | "h3" | "p" | "span";

interface SplitRevealProps {
  as?: Tag;
  children: ReactNode;
  className?: string;
  id?: string;
  /** "chars" rises letter by letter behind a mask; "lines" rises line by line. */
  unit?: "chars" | "lines";
  /** "scroll": the first time it enters the viewport. "mount": as soon as the page has fonts. */
  on?: "scroll" | "mount";
  delay?: number;
  /** Seconds between pieces. */
  stagger?: number;
}

/**
 * Text that rises into place piece by piece (GSAP SplitText). Rendered whole
 * on the server, so it is complete without JavaScript and under reduced
 * motion; the split happens on the client once fonts are ready, and is redone
 * if the text reflows. Line breaks (<br />) are honoured.
 */
export default function SplitReveal({ as = "h2", children, className, id, unit = "chars", on = "scroll", delay = 0, stagger }: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    registerGsap();
    let split: SplitText | undefined;
    let cancelled = false;
    const each = stagger ?? (unit === "chars" ? 0.022 : 0.12);

    const run = () => {
      if (cancelled) return;
      split = SplitText.create(el, {
        type: unit === "chars" ? "chars,words" : "lines",
        mask: unit,
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(unit === "chars" ? self.chars : self.lines, {
            yPercent: 110,
            duration: unit === "chars" ? 1.1 : 1.3,
            ease: EASE.reveal,
            stagger: { each, from: "start" },
            delay,
            ...(on === "scroll" ? { scrollTrigger: { trigger: el, start: "top 88%", once: true } } : {}),
          }),
      });
    };
    // Split against the real typeface, never the fallback.
    document.fonts.ready.then(run);

    return () => {
      cancelled = true;
      split?.revert();
    };
  }, [unit, on, delay, stagger]);

  return createElement(as, { ref, id, className }, children);
}
