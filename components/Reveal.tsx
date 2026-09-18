"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, registerGsap, prefersReducedMotion, EASE } from "@/lib/animation";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Fades and lifts its children into place the first time they scroll into view.
 * Content is visible by default (server render, no-JS, reduced motion).
 */
export default function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          delay,
          ease: EASE.reveal,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
