"use client";

import { useEffect, useRef, useState } from "react";
import { siteContent, resolveHref } from "@/data/site-content";
import {
  gsap,
  ScrollTrigger,
  registerGsap,
  isMobileViewport,
  usePrefersReducedMotion,
  EASE,
  SEQUENCE,
} from "@/lib/animation";
import Hero from "./Hero";
import PetalField from "./PetalField";
import VideoLettermark from "./VideoLettermark";
import ReducedMotionFallback from "./ReducedMotionFallback";
import ReserveButton from "./ReserveButton";

/**
 * One pinned, scroll-scrubbed sequence:
 * hero photograph -> KIKI scales past the viewport -> solid letters crossfade
 * into video-filled letters -> the hero fades and the stone section resolves
 * beneath the typography. The next section overlaps the bottom of the letters.
 */
export default function KikiScrollSequence() {
  const reduced = usePrefersReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const uiRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);
  const floralRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const wmRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLParagraphElement>(null);
  const solidRef = useRef<HTMLDivElement>(null);
  const videoLayerRef = useRef<HTMLDivElement>(null);

  const playingRef = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // Wait for the real preference; skip entirely when motion is reduced.
    if (reduced !== false) return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    const wm = wmRef.current;
    if (!section || !stage || !wm) return;

    registerGsap();

    const ctx = gsap.context(() => {
      const initialScale = () => {
        const v = parseFloat(getComputedStyle(wm).getPropertyValue("--wm-s0"));
        return Number.isFinite(v) && v > 0 ? v : 0.2;
      };

      const span = (range: readonly [number, number]) => range[1] - range[0];
      const tl = gsap.timeline({ defaults: { ease: "none" } });

      /* Background: slow dolly, then soften (blurred copy fades in), then fade to stone. */
      tl.fromTo(bgRef.current, { scale: 1 }, { scale: 1.06, duration: 1 }, 0);
      tl.to(blurRef.current, { opacity: 1, duration: span(SEQUENCE.heroBlur), ease: EASE.editorial }, SEQUENCE.heroBlur[0]);
      tl.to(bgRef.current, { opacity: 0, duration: span(SEQUENCE.heroFade) }, SEQUENCE.heroFade[0]);

      /* Hero UI leaves as the wordmark begins to grow. */
      tl.to(uiRef.current, { opacity: 0, y: 28, duration: span(SEQUENCE.ui), ease: EASE.editorial }, SEQUENCE.ui[0]);

      /* Wordmark: laid out at final size and scaled from its hero size to 1. */
      tl.fromTo(
        wm,
        { scale: initialScale },
        { scale: 1, duration: span(SEQUENCE.scale), ease: EASE.editorial },
        SEQUENCE.scale[0],
      );

      /* Solid white letters crossfade into video-filled letters. */
      tl.to(solidRef.current, { opacity: 0, duration: span(SEQUENCE.crossfade) }, SEQUENCE.crossfade[0]);
      tl.to(videoLayerRef.current, { opacity: 1, duration: span(SEQUENCE.crossfade) }, SEQUENCE.crossfade[0]);
      tl.fromTo(
        floralRef.current,
        { opacity: 0, scale: 1.04 },
        { opacity: 1, scale: 1, duration: span(SEQUENCE.crossfade) + 0.1, ease: EASE.reveal },
        SEQUENCE.crossfade[0],
      );

      /* Videos settle with a very slight scale once revealed. */
      tl.fromTo(
        videoLayerRef.current,
        { scale: 0.985 },
        { scale: 1, duration: span(SEQUENCE.settle), ease: EASE.editorial },
        SEQUENCE.settle[0],
      );

      /* Calls to action in the open space under the letters; gone before the wheel arrives there. */
      const mobile = isMobileViewport();
      const ctaIn = mobile ? SEQUENCE.ctaInMobile : SEQUENCE.ctaIn;
      const ctaOut = mobile ? SEQUENCE.ctaOutMobile : SEQUENCE.ctaOut;
      tl.fromTo(ctaRef.current, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: span(ctaIn), ease: EASE.reveal }, ctaIn[0]);
      tl.to(ctaRef.current, { autoAlpha: 0, y: -14, duration: span(ctaOut), ease: EASE.editorial }, ctaOut[0]);

      /* Handwritten note beside the letters. */
      tl.fromTo(noteRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.18, ease: EASE.reveal }, 0.78);

      /* Petals: depth parallax across the sequence, transition tier fades in. */
      const outers = gsap.utils.toArray<HTMLElement>(".petal-outer", stage);
      outers.forEach((el) => {
        const depth = Number(el.dataset.depth) || 0.5;
        tl.fromTo(el, { y: 0 }, { y: () => -depth * window.innerHeight * 0.34, duration: 1 }, 0);
      });
      const transitionPetals = outers.filter((el) => el.dataset.tier === "transition");
      tl.to(
        transitionPetals,
        {
          opacity: (_i: number, el: HTMLElement) => Number(el.dataset.opacity) || 0.9,
          duration: span(SEQUENCE.petals),
          ease: EASE.reveal,
          stagger: { each: 0.012, from: "random" },
        },
        SEQUENCE.petals[0],
      );

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => {
          const m = isMobileViewport() ? SEQUENCE.scrollMultiplier.mobile : SEQUENCE.scrollMultiplier.desktop;
          return `+=${Math.round(window.innerHeight * m)}`;
        },
        pin: stage,
        pinSpacing: true,
        scrub: 0.5,
        animation: tl,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const shouldPlay = self.progress > SEQUENCE.playThreshold;
          if (shouldPlay !== playingRef.current) {
            playingRef.current = shouldPlay;
            setPlaying(shouldPlay);
          }
        },
      });
    }, section);

    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, [reduced]);

  if (reduced) return <ReducedMotionFallback />;

  return (
    <section
      id="kiki-sequence"
      ref={sectionRef}
      className="pointer-events-none relative z-30"
      aria-label={`${siteContent.brand.name} ${siteContent.brand.subtitle}`}
    >
      {/* Transparent stage: once the photograph has faded, the section beneath shows through. */}
      <div ref={stageRef} className="kiki-stage relative h-[100svh] w-full overflow-hidden">
        <div className="kiki-stage-glow absolute inset-0" aria-hidden />

        <Hero bgRef={bgRef} uiRef={uiRef} blurRef={blurRef} />

        {/* Watercolour corners, revealed with the video letters. */}
        <div ref={floralRef} className="absolute inset-0 opacity-0" aria-hidden>
          <div className="kiki-floral kiki-floral--top" style={{ backgroundImage: `url(${siteContent.florals.top})` }} />
          <div className="kiki-floral kiki-floral--down" style={{ backgroundImage: `url(${siteContent.florals.down})` }} />
        </div>

        <PetalField layer="back" />

        <div ref={wmRef} className="kiki-wm absolute">
          <VideoLettermark
            letters={siteContent.letters}
            mode="sequence"
            playing={playing}
            solidRef={solidRef}
            videoLayerRef={videoLayerRef}
          />
        </div>

        <PetalField layer="front" />

        <div
          ref={ctaRef}
          className="kiki-sequence-cta pointer-events-auto absolute left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-3 sm:flex-row sm:gap-4"
          style={{ opacity: 0, visibility: "hidden" }}
        >
          {siteContent.wheel.ctas.map((cta) => (
            <ReserveButton
              key={cta.label}
              href={resolveHref(cta.href)}
              label={cta.label}
              variant={cta.variant}
              size="lg"
              withArrow
              className="whitespace-nowrap max-sm:w-[272px] max-sm:px-5 max-sm:tracking-[0.2em]"
            />
          ))}
        </div>

        <p
          ref={noteRef}
          aria-hidden
          className="script pointer-events-none absolute right-[4vw] top-[5svh] hidden rotate-[-8deg] text-right text-[30px] leading-[0.95] text-cobalt opacity-0 lg:block xl:text-[34px]"
        >
          {siteContent.sequenceNote[0]}
          <br />
          {siteContent.sequenceNote[1]}
          <br />
          <span className="text-[22px]">♡</span>
        </p>
      </div>
    </section>
  );
}
