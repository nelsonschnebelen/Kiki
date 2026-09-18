"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import Lenis from "lenis";

export { gsap, ScrollTrigger };

/* ---------------------------------------------------------------------------
 * Easing
 * ------------------------------------------------------------------------- */

export const EASE = {
  /** Slow-in, slow-out editorial ease used for scale and UI moves. */
  editorial: "kikiEditorial",
  /** Fast-out, settle ease used for reveals. */
  reveal: "kikiReveal",
  cssEditorial: "cubic-bezier(0.65, 0, 0.15, 1)",
  cssReveal: "cubic-bezier(0.22, 1, 0.36, 1)",
} as const;

let registered = false;

/** Registers plugins and custom eases once, on the client only. */
export function registerGsap() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  CustomEase.create(EASE.editorial, "0.65, 0, 0.15, 1");
  CustomEase.create(EASE.reveal, "0.22, 1, 0.36, 1");
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}

/* ---------------------------------------------------------------------------
 * Scroll sequence choreography (fractions of the pinned scroll distance)
 * ------------------------------------------------------------------------- */

export const SEQUENCE = {
  /** Scroll distance of the pinned hero, as a multiple of the viewport height. */
  scrollMultiplier: { desktop: 2.8, mobile: 2.0 },
  /** Hero holds; background scales; base petals drift. */
  hold: [0, 0.25],
  /** Reserve button, scroll hint and note fade. */
  ui: [0.25, 0.4],
  /** Wordmark scales from hero size to full-bleed. */
  scale: [0.25, 0.72],
  /** Solid white letters crossfade into video-filled letters. */
  crossfade: [0.45, 0.7],
  /** Transition petals enter. */
  petals: [0.3, 0.7],
  /** Hero photograph fades to reveal the stone section beneath. */
  heroFade: [0.62, 0.9],
  /** Video letters settle with a slight scale. */
  settle: [0.7, 1],
  /** Video playback starts once the letters are largely revealed. */
  playThreshold: 0.42,
} as const;

/* ---------------------------------------------------------------------------
 * Environment helpers
 * ------------------------------------------------------------------------- */

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

export function hasFinePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px)").matches;
}

interface NetworkInformationLike {
  saveData?: boolean;
  effectiveType?: string;
}

/** True on data-saver mode or slow connections. Used to skip video downloads. */
export function isConstrainedConnection(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & { connection?: NetworkInformationLike };
  const c = nav.connection;
  if (!c) return false;
  if (c.saveData) return true;
  return c.effectiveType === "slow-2g" || c.effectiveType === "2g" || c.effectiveType === "3g";
}

/** Picks the right video file for the device, or null when video should not load at all. */
export function pickVideoSource(src: { desktop: string; mobile: string }): string | null {
  if (isConstrainedConnection()) return null;
  return isMobileViewport() ? src.mobile : src.desktop;
}

/**
 * Returns null during SSR and the first client render (so markup matches),
 * then the real preference.
 */
export function usePrefersReducedMotion(): boolean | null {
  const [reduced, setReduced] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/* ---------------------------------------------------------------------------
 * Smooth scrolling
 * ------------------------------------------------------------------------- */

/** Starts Lenis, drives it from the GSAP ticker, and keeps ScrollTrigger in sync. */
export function initSmoothScroll(): () => void {
  registerGsap();
  const lenis = new Lenis({
    lerp: 0.09,
    smoothWheel: true,
    syncTouch: false,
    autoRaf: false,
  });
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
  };
}
