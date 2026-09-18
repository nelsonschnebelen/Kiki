"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type RefObject } from "react";
import { siteContent } from "@/data/site-content";
import { pickVideoSource, prefersReducedMotion } from "@/lib/animation";
import ReserveButton from "./ReserveButton";

interface HeroProps {
  /** Photograph layer. The scroll sequence scales and fades this. */
  bgRef: RefObject<HTMLDivElement | null>;
  /** Reserve button, note and scroll hint. The scroll sequence fades this. */
  uiRef: RefObject<HTMLDivElement | null>;
}

/**
 * Full-viewport hero: the photograph (with an ambient video loop layered on top
 * once it can play), the Reserve button beneath the wordmark, and a scroll hint.
 * The KIKI wordmark itself lives in the scroll sequence so both hero and video
 * versions share one transform.
 */
export default function Hero({ bgRef, uiRef }: HeroProps) {
  const { hero, reservationUrl } = siteContent;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || prefersReducedMotion()) return;
    const src = pickVideoSource(hero.video);
    if (!src) return;

    let cancelled = false;
    const onCanPlay = () => {
      if (cancelled) return;
      v.play()
        .then(() => setVideoReady(true))
        .catch(() => setVideoReady(false));
    };
    const onError = () => setVideoReady(false);

    v.addEventListener("canplay", onCanPlay, { once: true });
    v.addEventListener("error", onError);
    v.src = src;
    v.load();

    return () => {
      cancelled = true;
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("error", onError);
      v.pause();
      v.removeAttribute("src");
      v.load();
    };
  }, [hero.video]);

  return (
    <>
      <div ref={bgRef} className="absolute inset-0 will-change-transform" style={{ transformOrigin: "50% 50%" }}>
        <Image
          src={hero.image}
          alt={hero.alt}
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover object-center"
        />
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
        {/* Very light exposure lift so the white wordmark reads on the brightest skies. */}
        <div className="absolute inset-0 bg-white/[0.04]" aria-hidden />
      </div>

      <div ref={uiRef} className="pointer-events-none absolute inset-0 z-30">
        <p
          aria-hidden
          className="script absolute right-[6vw] top-[9svh] hidden rotate-[-6deg] text-right text-[30px] leading-[0.95] text-cobalt drop-shadow-[0_1px_0_rgba(255,255,255,0.6)] md:block lg:text-[34px]"
        >
          {hero.note[0]}
          <br />
          {hero.note[1]}
          <br />
          <span className="text-[22px]">♡</span>
        </p>

        <div className="kiki-reserve-slot absolute left-1/2 -translate-x-1/2">
          <ReserveButton
            href={reservationUrl}
            label={hero.reserveLabel}
            variant="onImage"
            size="lg"
            className="pointer-events-auto"
          />
        </div>

        <div className="absolute bottom-[4.5svh] left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-white">
          <span className="font-sans text-[9px] uppercase tracking-[0.4em] drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
            {hero.scrollHint}
          </span>
          <span className="scroll-cue" aria-hidden />
        </div>
      </div>
    </>
  );
}
