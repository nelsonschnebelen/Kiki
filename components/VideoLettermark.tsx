"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type CSSProperties, type RefObject } from "react";
import type { LetterContent } from "@/data/site-content";
import { gsap, registerGsap, pickVideoSource, prefersReducedMotion } from "@/lib/animation";

/* ---------------------------------------------------------------------------
 * Geometry. The wordmark is laid out in a fixed 1000 x 300 design box so the
 * element's aspect ratio never changes; letters are centred inside it.
 * ------------------------------------------------------------------------- */

export const LETTERMARK = {
  VB_W: 1000,
  VB_H: 300,
  FONT_SIZE: 400,
  BASELINE: 292,
  GAP: 14,
  OUTLINE: 5,
  /** Ink-width estimates used until the display font has been measured. */
  estimate: { K: { x: 8, w: 290 }, I: { x: 10, w: 150 } },
} as const;

/** Height divided by width of the wordmark box. Mirrored in globals.css (0.3). */
export const LETTERMARK_ASPECT = LETTERMARK.VB_H / LETTERMARK.VB_W;

type Mode = "sequence" | "solid" | "posters";

interface VideoLettermarkProps {
  letters: readonly LetterContent[];
  /**
   * "sequence": solid layer over video layer, both exposed through refs for the scroll timeline.
   * "solid": white letters only (hero in the reduced-motion fallback).
   * "posters": video layer visible with poster images and no video elements.
   */
  mode?: Mode;
  /** In "sequence" mode, starts/pauses the letter videos. */
  playing?: boolean;
  solidRef?: RefObject<SVGSVGElement | null>;
  videoLayerRef?: RefObject<HTMLDivElement | null>;
}

interface Ink {
  x: number;
  w: number;
}
interface Slot {
  x: number;
  w: number;
  ink: Ink;
}

const FONT: CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 800,
  fontVariationSettings: '"opsz" 96',
  letterSpacing: 0,
};

function layoutSlots(inks: Ink[]): Slot[] {
  const total = inks.reduce((sum, ink) => sum + ink.w, 0) + LETTERMARK.GAP * (inks.length - 1);
  let x = (LETTERMARK.VB_W - total) / 2;
  return inks.map((ink) => {
    const slot = { x, w: ink.w, ink };
    x += ink.w + LETTERMARK.GAP;
    return slot;
  });
}

const pct = (units: number) => `${(units / LETTERMARK.VB_W) * 100}%`;

/**
 * KIKI built as four independently clipped letters.
 *
 * Each letter is an SVG <clipPath> containing the glyph itself (objectBoundingBox
 * units), applied to a slot-sized HTML element holding that letter's poster and
 * video. A separate SVG draws the crisp white outline on top, and a solid white
 * SVG version sits above both for the hero state. clipPath is used rather than
 * <mask> because CSS references to SVG masks are not supported in Safari.
 */
export default function VideoLettermark({
  letters,
  mode = "sequence",
  playing = false,
  solidRef,
  videoLayerRef,
}: VideoLettermarkProps) {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, "");
  const clipId = (i: number) => `kiki-clip-${uid}-${i}`;

  const rootRef = useRef<HTMLDivElement>(null);
  const measureRefs = useRef<Array<SVGTextElement | null>>([]);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const visibleRef = useRef(true);

  const [inks, setInks] = useState<Ink[]>(() => letters.map((l) => ({ ...LETTERMARK.estimate[l.char] })));
  const slots = layoutSlots(inks);

  /* Measure the real glyph ink boxes once the display font is ready. */
  useEffect(() => {
    let cancelled = false;
    const measure = () => {
      if (cancelled) return;
      const next = measureRefs.current.map((el, i) => {
        const fallback = { ...LETTERMARK.estimate[letters[i].char] };
        if (!el) return fallback;
        try {
          const b = el.getBBox();
          return b.width > 10 ? { x: Math.round(b.x), w: Math.ceil(b.width) } : fallback;
        } catch {
          return fallback;
        }
      });
      setInks((prev) =>
        prev.every((p, i) => Math.abs(p.w - next[i].w) < 1 && Math.abs(p.x - next[i].x) < 1) ? prev : next,
      );
    };
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fonts?.ready) fonts.ready.then(measure);
    else measure();
    return () => {
      cancelled = true;
    };
  }, [letters]);

  /* Pause videos while the wordmark is off screen. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root || mode !== "sequence") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        videoRefs.current.forEach((v) => {
          if (!v || !v.dataset.loaded) return;
          if (entry.isIntersecting && playing) v.play().catch(() => {});
          else v.pause();
        });
      },
      { threshold: 0 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [mode, playing]);

  /* Start / stop playback. Sources are attached lazily on first play. */
  useEffect(() => {
    if (mode !== "sequence") return;
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (playing && visibleRef.current) {
        if (!v.dataset.loaded) {
          const src = pickVideoSource(letters[i].video);
          if (!src) return;
          v.dataset.loaded = "1";
          v.src = src;
          v.load();
        }
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [playing, mode, letters]);

  /* Fade each video in once it is actually rendering frames, and drift it inside its mask. */
  useEffect(() => {
    if (mode !== "sequence" || prefersReducedMotion()) return;
    registerGsap();
    const listeners: Array<() => void> = [];
    const ctx = gsap.context(() => {
      videoRefs.current.forEach((v, i) => {
        if (!v) return;
        const onPlaying = () => gsap.to(v, { opacity: 1, duration: 0.9, ease: "power2.out" });
        const onError = () => gsap.set(v, { opacity: 0 });
        v.addEventListener("playing", onPlaying);
        v.addEventListener("error", onError);
        listeners.push(() => {
          v.removeEventListener("playing", onPlaying);
          v.removeEventListener("error", onError);
        });
        gsap.to(v, {
          xPercent: i % 2 ? 1.6 : -1.6,
          yPercent: i % 2 ? -1.3 : 1.4,
          duration: 9 + i * 2.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });
    }, rootRef);
    return () => {
      listeners.forEach((off) => off());
      ctx.revert();
    };
  }, [mode]);

  const showSolid = mode === "sequence" || mode === "solid";
  const showVideoLayer = mode === "sequence" || mode === "posters";

  return (
    <div
      ref={rootRef}
      className="relative w-full"
      style={{ aspectRatio: `${LETTERMARK.VB_W} / ${LETTERMARK.VB_H}` }}
    >
      {/* Clip paths (one per letter) and hidden measurement glyphs. */}
      <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
        <defs>
          {letters.map((l, i) => {
            const slot = slots[i];
            return (
              <clipPath key={l.id} id={clipId(i)} clipPathUnits="objectBoundingBox">
                <text
                  x={-slot.ink.x}
                  y={LETTERMARK.BASELINE}
                  fontSize={LETTERMARK.FONT_SIZE}
                  transform={`scale(${1 / slot.w} ${1 / LETTERMARK.VB_H})`}
                  style={FONT}
                >
                  {l.char}
                </text>
              </clipPath>
            );
          })}
        </defs>
        <g style={{ visibility: "hidden" }}>
          {letters.map((l, i) => (
            <text
              key={l.id}
              ref={(el) => {
                measureRefs.current[i] = el;
              }}
              x={0}
              y={LETTERMARK.BASELINE}
              fontSize={LETTERMARK.FONT_SIZE}
              style={FONT}
            >
              {l.char}
            </text>
          ))}
        </g>
      </svg>

      {showVideoLayer && (
        <div
          ref={videoLayerRef}
          className="absolute inset-0 will-change-transform"
          style={{ opacity: mode === "posters" ? 1 : 0 }}
          aria-hidden={mode === "sequence"}
          role={mode === "posters" ? "img" : undefined}
          aria-label={mode === "posters" ? "KIKI" : undefined}
        >
          {letters.map((l, i) => {
            const slot = slots[i];
            return (
              <div
                key={l.id}
                className="absolute top-0 h-full overflow-hidden"
                style={{
                  left: pct(slot.x),
                  width: pct(slot.w),
                  clipPath: `url(#${clipId(i)})`,
                  WebkitClipPath: `url(#${clipId(i)})`,
                }}
              >
                <Image
                  src={l.video.poster}
                  alt=""
                  fill
                  sizes="(max-width: 767px) 48vw, 36vw"
                  quality={82}
                  className="object-cover"
                  style={{ transform: "scale(1.06)" }}
                />
                {mode === "sequence" && (
                  <video
                    ref={(el) => {
                      videoRefs.current[i] = el;
                    }}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={l.video.poster}
                    aria-label={l.label}
                    tabIndex={-1}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ transform: "scale(1.08)", opacity: 0 }}
                  />
                )}
              </div>
            );
          })}

          {/* Crisp white outline over the video-filled letters. */}
          <svg
            viewBox={`0 0 ${LETTERMARK.VB_W} ${LETTERMARK.VB_H}`}
            className="absolute inset-0 h-full w-full overflow-visible"
            aria-hidden
            focusable="false"
          >
            {letters.map((l, i) => {
              const slot = slots[i];
              return (
                <text
                  key={l.id}
                  x={slot.x - slot.ink.x}
                  y={LETTERMARK.BASELINE}
                  fontSize={LETTERMARK.FONT_SIZE}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth={LETTERMARK.OUTLINE}
                  strokeLinejoin="round"
                  style={FONT}
                >
                  {l.char}
                </text>
              );
            })}
          </svg>
        </div>
      )}

      {showSolid && (
        <svg
          ref={solidRef}
          viewBox={`0 0 ${LETTERMARK.VB_W} ${LETTERMARK.VB_H}`}
          className="absolute inset-0 h-full w-full overflow-visible"
          role="img"
          aria-label="KIKI"
          style={{ filter: "drop-shadow(0 6px 28px rgba(18, 56, 184, 0.22))" }}
        >
          {letters.map((l, i) => {
            const slot = slots[i];
            return (
              <text
                key={l.id}
                x={slot.x - slot.ink.x}
                y={LETTERMARK.BASELINE}
                fontSize={LETTERMARK.FONT_SIZE}
                fill="#FFFFFF"
                style={FONT}
              >
                {l.char}
              </text>
            );
          })}
        </svg>
      )}
    </div>
  );
}
