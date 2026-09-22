"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap, prefersReducedMotion, EASE } from "@/lib/animation";

interface MeanderProps {
  className?: string;
  units?: number;
  /** Draw the key on, left to right, the first time it scrolls into view. */
  draw?: boolean;
}

/** A short run of the wheel's Greek key, used as a section divider. */
export default function Meander({ className = "", units = 9, draw = true }: MeanderProps) {
  const ref = useRef<SVGSVGElement>(null);
  const w = units * 40;

  useEffect(() => {
    const svg = ref.current;
    if (!svg || !draw || prefersReducedMotion()) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        svg.querySelectorAll("path"),
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 1.1, ease: EASE.editorial, stagger: 0.09, scrollTrigger: { trigger: svg, start: "top 92%", once: true } },
      );
    }, svg);
    return () => ctx.revert();
  }, [draw]);

  return (
    <svg ref={ref} viewBox={`0 0 ${w} 16`} width={w} height={16} className={`text-cobalt ${className}`} aria-hidden focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="miter" strokeLinecap="square">
        {Array.from({ length: units }, (_, i) => (
          <path key={i} d="M0 14 H7 V2 H33 V10 H13 V6 H27 M33 14 H40" transform={`translate(${i * 40} 0)`} />
        ))}
      </g>
    </svg>
  );
}
