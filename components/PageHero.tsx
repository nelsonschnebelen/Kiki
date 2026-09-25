"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion, EASE } from "@/lib/animation";
import PetalField from "./PetalField";
import SplitReveal from "./SplitReveal";

interface PageHeroProps {
  image: string;
  alt: string;
  /** Big display title, e.g. "Menu". */
  title: string;
  /** Small tracked line above the title. */
  eyebrow?: string;
  /** Line under the title. */
  subtitle?: string;
  /** Handwritten note, top right. */
  note?: string[];
  /** Height as a viewport fraction. Menu uses a shorter hero so the food arrives sooner. */
  height?: "full" | "tall";
  /** CSS object-position for the photograph. */
  focus?: string;
  children?: ReactNode;
}

/**
 * Inner-page hero in the homepage's language: a photograph that dollies and
 * drifts on scroll (parallax), petals falling in front of and behind the
 * title, the title itself easing up and thinning out as you leave, and a
 * scroll chevron. Everything is transform and opacity.
 */
export default function PageHero({ image, alt, title, eyebrow, subtitle, note, height = "tall", focus = "50% 50%", children }: PageHeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    registerGsap();
    const ctx = gsap.context(() => {
      const st = { trigger: root, start: "top top", end: "bottom top", scrub: 0.6 };
      gsap.fromTo(bgRef.current, { scale: 1.02, yPercent: 0 }, { scale: 1.16, yPercent: 14, ease: "none", scrollTrigger: st });
      gsap.fromTo(copyRef.current, { yPercent: 0, opacity: 1 }, { yPercent: 55, opacity: 0, ease: "none", scrollTrigger: { ...st, end: "60% top" } });
      gsap.fromTo(veilRef.current, { opacity: 0 }, { opacity: 0.55, ease: "none", scrollTrigger: st });
      // Petals drift up slightly faster than the photograph, for depth.
      gsap.utils.toArray<HTMLElement>(".petal-outer", root).forEach((el) => {
        const depth = Number(el.dataset.depth) || 0.5;
        gsap.fromTo(el, { y: 0 }, { y: () => -depth * window.innerHeight * 0.4, ease: "none", scrollTrigger: st });
      });
      // Entrance.
      gsap.fromTo(
        copyRef.current!.querySelectorAll("[data-rise]"),
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.3, ease: EASE.reveal, stagger: 0.12, delay: 0.15, overwrite: "auto" },
      );
    }, root);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className={`relative w-full overflow-hidden bg-stone ${height === "full" ? "h-[100svh]" : "h-[82svh] min-h-[560px]"}`}>
      <div ref={bgRef} className="absolute inset-0 will-change-transform" style={{ transformOrigin: "50% 40%", viewTransitionName: "page-hero" }}>
        <Image src={image} alt={alt} fill priority quality={85} sizes="100vw" className="object-cover" style={{ objectPosition: focus }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/30" aria-hidden />
      </div>
      <div ref={veilRef} className="absolute inset-0 bg-stone opacity-0" aria-hidden />

      <PetalField layer="back" max={3} allVisible />

      <div ref={copyRef} className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white will-change-transform" style={{ viewTransitionName: "hero-copy" }}>
        {eyebrow && (
          <p data-rise className="font-sans text-[10px] font-medium uppercase tracking-[0.55em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] md:text-[12px]">
            {eyebrow}
          </p>
        )}
        <SplitReveal
          as="h1"
          unit="chars"
          on="mount"
          delay={0.35}
          stagger={0.05}
          className={`mt-5 font-display uppercase leading-[1.05] tracking-[0.12em] drop-shadow-[0_6px_30px_rgba(0,0,0,0.35)] ${title.length > 6 ? "text-[clamp(44px,8.6vw,132px)]" : "text-[clamp(64px,13vw,190px)]"}`}
        >
          {title}
        </SplitReveal>
        {subtitle && (
          <p data-rise className="mt-6 max-w-[34ch] font-display text-[15px] uppercase leading-[1.6] tracking-[0.3em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] md:text-[18px]">
            {subtitle}
          </p>
        )}
        {children && <div data-rise className="mt-9">{children}</div>}
      </div>

      <PetalField layer="front" max={2} allVisible />

      {note && (
        <p aria-hidden className="script pointer-events-none absolute right-[6vw] top-[16svh] hidden rotate-[-6deg] text-right text-[30px] leading-[0.95] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] md:block lg:text-[34px]">
          {note.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
          <span className="text-[22px]">♡</span>
        </p>
      )}

      <span className="hero-chevron absolute bottom-[5svh] left-1/2 grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full bg-white/92 text-cobalt shadow-[0_10px_30px_-12px_rgba(14,44,147,0.5)]" aria-hidden>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6l5 5 5-5" />
        </svg>
      </span>
    </section>
  );
}
