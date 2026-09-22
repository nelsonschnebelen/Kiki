"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap, registerGsap, prefersReducedMotion } from "@/lib/animation";

interface ParallaxBandProps {
  image: string;
  alt: string;
  /** Band height as a viewport fraction. */
  height?: string;
  /** Handwritten note, placed top-right. */
  note?: string[];
  /** Photograph focus, CSS object-position. */
  focus?: string;
  /** Darken for white type on top. */
  dim?: boolean;
  className?: string;
  children?: ReactNode;
}

/**
 * Full-bleed photograph that travels slower than the page (the image is
 * oversized and slides as the band crosses the viewport). Used between menu
 * courses and as chapter openers on the inner pages.
 */
export default function ParallaxBand({ image, alt, height = "62svh", note, focus = "50% 50%", dim = false, className = "", children }: ParallaxBandProps) {
  const rootRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(imgRef.current, { yPercent: -12 }, { yPercent: 12, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.5 } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className={`relative w-full overflow-hidden ${className}`} style={{ height }}>
      <div ref={imgRef} className="absolute -inset-y-[14%] inset-x-0 will-change-transform">
        <Image src={image} alt={alt} fill sizes="100vw" quality={82} className="object-cover" style={{ objectPosition: focus }} />
      </div>
      {dim && <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" aria-hidden />}
      {note && (
        <p aria-hidden className="script pointer-events-none absolute right-[6vw] top-[10%] hidden rotate-[-6deg] text-right text-[32px] leading-[0.95] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] md:block">
          {note.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
          <span className="text-[22px]">♡</span>
        </p>
      )}
      {children && <div className="relative flex h-full items-end px-6 pb-[7svh] md:px-10">{children}</div>}
    </section>
  );
}
