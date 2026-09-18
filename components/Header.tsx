"use client";

import { useEffect, useRef } from "react";
import { siteContent } from "@/data/site-content";
import {
  gsap,
  ScrollTrigger,
  registerGsap,
  isMobileViewport,
  prefersReducedMotion,
  SEQUENCE,
  EASE,
} from "@/lib/animation";
import ReserveButton from "./ReserveButton";

/**
 * Minimal persistent bar. Hidden over the hero (per client direction the hero
 * carries only the photograph, the wordmark and Reserve), then slides in once
 * the KIKI sequence has scrolled away.
 */
export default function Header() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    registerGsap();
    const reduced = prefersReducedMotion();

    const show = () =>
      gsap.to(el, { autoAlpha: 1, yPercent: 0, duration: reduced ? 0 : 0.7, ease: EASE.reveal });
    const hide = () =>
      gsap.to(el, { autoAlpha: 0, yPercent: -100, duration: reduced ? 0 : 0.45, ease: EASE.editorial });

    const trigger = ScrollTrigger.create({
      start: () => {
        if (reduced) return window.innerHeight * 0.9;
        const m = isMobileViewport() ? SEQUENCE.scrollMultiplier.mobile : SEQUENCE.scrollMultiplier.desktop;
        return window.innerHeight * (m + 0.55);
      },
      onEnter: show,
      onLeaveBack: hide,
    });

    return () => trigger.kill();
  }, []);

  return (
    <header
      ref={ref}
      className="fixed inset-x-0 top-0 z-50 border-b border-cobalt/10 bg-white/92 backdrop-blur-sm"
      style={{ opacity: 0, visibility: "hidden", transform: "translateY(-100%)" }}
    >
      <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-5 md:px-10">
        <a
          href="#main"
          className="font-display text-[22px] leading-none tracking-[0.12em] text-cobalt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2"
          aria-label={`${siteContent.brand.name} ${siteContent.brand.subtitle}, back to top`}
        >
          {siteContent.brand.name}
          <span className="ml-3 hidden font-sans text-[9px] font-medium uppercase tracking-[0.34em] text-cobalt/70 sm:inline">
            {siteContent.brand.subtitle}
          </span>
        </a>
        <ReserveButton href={siteContent.reservationUrl} label={siteContent.hero.reserveLabel} size="md" />
      </div>
    </header>
  );
}
