"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type RefObject } from "react";
import { siteContent } from "@/data/site-content";
import { pickVideoSource, prefersReducedMotion } from "@/lib/animation";

interface HeroProps {
  /** Photograph layer. The scroll sequence scales and fades this. */
  bgRef: RefObject<HTMLDivElement | null>;
  /** Tagline, chevron and note. The scroll sequence fades this. */
  uiRef: RefObject<HTMLDivElement | null>;
  /** Pre-blurred copy of the photograph. The scroll sequence fades this in over the sharp one. */
  blurRef: RefObject<HTMLDivElement | null>;
}

/**
 * Full-viewport hero: the photograph (with an ambient video loop layered on top
 * once it can play), "EAT · DRINK · DANCE" and a chevron beneath the wordmark,
 * and the handwritten note. The wordmark itself lives in the scroll sequence
 * so the floral hero version and the video version share one transform.
 * Reserve lives in the header, as in the mock.
 */
export default function Hero({ bgRef, uiRef, blurRef }: HeroProps) {
  const { hero, brand } = siteContent;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || prefersReducedMotion()) return;
    const src = pickVideoSource(hero.video);
    if (!src) return;

    let cancelled = false;
    let inView = true;

    const tryPlay = () => {
      if (cancelled || !inView || document.hidden) return;
      v.play().catch(() => {});
    };
    const onPlaying = () => !cancelled && setVideoReady(true);
    const onError = () => setVideoReady(false);
    /*
     * ScrollTrigger re-parents the pinned stage (on creation and on every refresh),
     * and moving a media element in the DOM pauses it. Resume whenever the film is
     * paused while it should be running.
     */
    const onPause = () => requestAnimationFrame(tryPlay);
    const onVisibility = () => tryPlay();

    v.addEventListener("canplay", tryPlay);
    v.addEventListener("playing", onPlaying);
    v.addEventListener("pause", onPause);
    v.addEventListener("error", onError);
    document.addEventListener("visibilitychange", onVisibility);

    /* Only run the film while the hero is on screen. */
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) tryPlay();
        else v.pause();
      },
      { threshold: 0 },
    );
    io.observe(v);

    v.src = src;
    v.load();

    return () => {
      cancelled = true;
      io.disconnect();
      v.removeEventListener("canplay", tryPlay);
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("error", onError);
      document.removeEventListener("visibilitychange", onVisibility);
      v.pause();
      v.removeAttribute("src");
      v.load();
    };
  }, [hero.video]);

  return (
    <>
      <div ref={bgRef} className="absolute inset-0 will-change-transform" style={{ transformOrigin: "50% 50%", viewTransitionName: "page-hero" }}>
        <Image src={hero.image} alt={hero.alt} fill priority quality={85} sizes="100vw" className="object-cover object-center" />
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-[1400ms] ease-editorial"
          style={{ opacity: videoReady ? 1 : 0 }}
        />
        {/* A touch of shade, heavier at the edges, so the white wordmark and the header always read. */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/40" aria-hidden />
        {/* Blurred copy, faded in by the sequence (opacity only: no per-frame filter). */}
        <div ref={blurRef} className="absolute inset-0 opacity-0" aria-hidden>
          <Image src={hero.blurImage} alt="" fill sizes="100vw" quality={75} className="object-cover object-center" />
          <div className="absolute inset-0 bg-stone/55" />
        </div>
      </div>

      <div ref={uiRef} className="pointer-events-none absolute inset-0 z-30">
        <p
          aria-hidden
          className="script absolute right-[6vw] top-[14svh] hidden rotate-[-6deg] text-right text-[30px] leading-[0.95] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] md:block lg:text-[34px]"
        >
          {hero.note[0]}
          <br />
          {hero.note[1]}
          <br />
          <span className="text-[22px]">♡</span>
        </p>

        <div className="kiki-tagline-slot absolute left-1/2 flex -translate-x-1/2 flex-col items-center gap-5 text-white md:gap-6">
          <p className="whitespace-nowrap font-sans text-[11px] font-medium uppercase tracking-[0.52em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] md:text-[14px] lg:text-[16px]">
            {brand.subtitle}
          </p>
          <p className="whitespace-nowrap font-display text-[14px] uppercase tracking-[0.34em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] md:text-[18px] lg:text-[21px]">
            {brand.tagline}
          </p>
          <span className="hero-chevron grid h-11 w-11 place-items-center rounded-full bg-white/92 text-cobalt shadow-[0_10px_30px_-12px_rgba(14,44,147,0.5)]" aria-hidden>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6l5 5 5-5" />
            </svg>
          </span>
        </div>
      </div>
    </>
  );
}
