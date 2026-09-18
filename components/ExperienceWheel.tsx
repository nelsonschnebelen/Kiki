"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";
import { siteContent, resolveHref } from "@/data/site-content";
import { gsap, ScrollTrigger, registerGsap, usePrefersReducedMotion } from "@/lib/animation";
import ReserveButton from "./ReserveButton";
import Reveal from "./Reveal";

const MEANDER_UNITS = 30;

/**
 * "Day turns into night" wheel. Outer Greek border rotates clockwise, the inner
 * directional ring counter-clockwise; both respond to scroll and pick up a very
 * slow idle rotation once the section settles. The centre stays still.
 */
export default function ExperienceWheel() {
  const { wheel } = siteContent;
  const reduced = usePrefersReducedMotion();
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, "");

  const sectionRef = useRef<HTMLElement>(null);
  const outerScrollRef = useRef<HTMLDivElement>(null);
  const outerIdleRef = useRef<SVGSVGElement>(null);
  const innerScrollRef = useRef<HTMLDivElement>(null);
  const innerIdleRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (reduced !== false) return;
    const section = sectionRef.current;
    if (!section) return;
    registerGsap();

    const ctx = gsap.context(() => {
      const scrollTrigger = {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.9,
      };
      gsap.fromTo(outerScrollRef.current, { rotation: -34 }, { rotation: 34, ease: "none", scrollTrigger });
      gsap.fromTo(innerScrollRef.current, { rotation: 22 }, { rotation: -22, ease: "none", scrollTrigger });

      const idleOuter = gsap.to(outerIdleRef.current, { rotation: 360, duration: 340, ease: "none", repeat: -1, paused: true });
      const idleInner = gsap.to(innerIdleRef.current, { rotation: -360, duration: 280, ease: "none", repeat: -1, paused: true });

      const play = () => {
        idleOuter.play();
        idleInner.play();
      };
      const pause = () => {
        idleOuter.pause();
        idleInner.pause();
      };
      ScrollTrigger.create({
        trigger: section,
        start: "top 85%",
        end: "bottom 15%",
        onEnter: play,
        onEnterBack: play,
        onLeave: pause,
        onLeaveBack: pause,
      });
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  const meander = "M-20 13 H-13 V1 H13 V9 H-7 V5 H7 M13 13 H20";

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="kiki-wheel-section relative z-10 bg-transparent pb-[6svh] md:pb-[2svh]"
      aria-labelledby={`${uid}-heading`}
    >
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 items-start gap-10 px-5 md:px-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
        {/* Left: copy */}
        <Reveal className="order-2 lg:order-1 lg:pt-[34svh]">
          <h2
            id={`${uid}-heading`}
            className="font-display text-[26px] uppercase leading-[1.15] tracking-[0.1em] text-cobalt md:text-[32px] xl:text-[38px]"
          >
            {wheel.heading[0]}
            <br />
            {wheel.heading[1]}
          </h2>
          <span className="mt-6 block h-px w-12 bg-gold" aria-hidden />
          <div className="mt-8 flex flex-col items-start gap-4">
            {wheel.ctas.map((cta) => (
              <ReserveButton
                key={cta.label}
                href={resolveHref(cta.href)}
                label={cta.label}
                variant={cta.variant}
                size="md"
                withArrow
              />
            ))}
          </div>
        </Reveal>

        {/* Centre: wheel */}
        <div className="order-1 mx-auto w-[min(86vw,560px)] lg:order-2 lg:w-[min(40vw,600px)]">
          <div className="relative aspect-square w-full">
            {/* Stone disc with soft shadow */}
            <div
              className="absolute inset-0 rounded-full bg-[#FBF8F2] shadow-[0_40px_80px_-40px_rgba(18,56,184,0.35),0_0_0_1px_rgba(18,56,184,0.08)]"
              aria-hidden
            />

            {/* Outer ornamental ring (scroll-linked wrapper + idle svg) */}
            <div ref={outerScrollRef} className="absolute inset-0 will-change-transform">
              <svg
                ref={outerIdleRef}
                viewBox="0 0 400 400"
                className="absolute inset-0 h-full w-full will-change-transform"
                aria-hidden
                focusable="false"
              >
                <defs>
                  <path id={`${uid}-top`} d="M 42 200 A 158 158 0 0 1 358 200" fill="none" />
                  <path id={`${uid}-bottom`} d="M 42 200 A 158 158 0 0 0 358 200" fill="none" />
                </defs>
                <circle cx="200" cy="200" r="196" fill="none" stroke="#1238B8" strokeWidth="1.4" />
                <circle cx="200" cy="200" r="172" fill="none" stroke="#1238B8" strokeWidth="1" />
                <g fill="none" stroke="#1238B8" strokeWidth="1.5" strokeLinejoin="miter" strokeLinecap="square">
                  {Array.from({ length: MEANDER_UNITS }, (_, i) => (
                    <g key={i} transform={`rotate(${(i * 360) / MEANDER_UNITS} 200 200)`}>
                      <path d={meander} transform="translate(200 10)" />
                    </g>
                  ))}
                </g>
                <text
                  fill="#1238B8"
                  fontSize="13.5"
                  letterSpacing="3.4"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                >
                  <textPath href={`#${uid}-top`} startOffset="50%" textAnchor="middle">
                    {wheel.topArc}
                  </textPath>
                </text>
                <text
                  fill="#1238B8"
                  fontSize="13.5"
                  letterSpacing="3.4"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                >
                  <textPath href={`#${uid}-bottom`} startOffset="50%" textAnchor="middle">
                    {wheel.bottomArc}
                  </textPath>
                </text>
              </svg>
            </div>

            {/* Inner directional ring */}
            <div ref={innerScrollRef} className="absolute inset-0 will-change-transform">
              <svg
                ref={innerIdleRef}
                viewBox="0 0 400 400"
                className="absolute inset-0 h-full w-full will-change-transform"
                aria-hidden
                focusable="false"
              >
                <circle cx="200" cy="200" r="138" fill="none" stroke="#1238B8" strokeWidth="1" strokeDasharray="1.5 5" />
                <g fill="none" stroke="#1238B8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  {[45, 135, 225, 315].map((deg) => (
                    <path key={deg} d="M205 55 L199 62 L205 69" transform={`rotate(${deg} 200 200)`} />
                  ))}
                </g>
                {/* Sun, on the day side */}
                <g transform="translate(62 200)" stroke="#1238B8" strokeWidth="1.4" fill="none" strokeLinecap="round">
                  <circle r="5" />
                  {Array.from({ length: 8 }, (_, i) => (
                    <line key={i} x1="0" y1="-8" x2="0" y2="-11" transform={`rotate(${i * 45})`} />
                  ))}
                </g>
                {/* Moon, on the night side */}
                <circle cx="338" cy="200" r="6" fill="#1238B8" />
              </svg>
            </div>

            {/* Stationary centre: day / night photograph and the label */}
            <div className="absolute inset-[19.5%] overflow-hidden rounded-full ring-1 ring-cobalt/15">
              <Image
                src={wheel.centerImage}
                alt={wheel.centerAlt}
                fill
                sizes="(max-width: 1023px) 60vw, 26vw"
                quality={85}
                className="object-cover"
              />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-[23%] flex justify-center">
              <span className="whitespace-nowrap rounded-full bg-white/92 px-4 py-2 font-display text-[11px] tracking-[0.36em] text-cobalt shadow-sm md:px-5 md:text-[12.5px]">
                {wheel.center}
              </span>
            </div>
          </div>
        </div>

        {/* Right: handwritten note + vase */}
        <Reveal className="order-3 hidden lg:block lg:pt-[30svh]" delay={0.15}>
          <p aria-hidden className="script rotate-[-6deg] text-[36px] leading-[0.95] text-cobalt xl:text-[42px]">
            {wheel.note[0]}
            <br />
            {wheel.note[1]}
            <br />
            <span className="text-[26px]">♡</span>
          </p>
          <div className="relative mt-10 ml-auto aspect-[3/4] w-[min(22vw,260px)] overflow-hidden rounded-[2px]">
            <Image src={wheel.accentImage} alt={wheel.accentAlt} fill sizes="22vw" className="object-cover" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
