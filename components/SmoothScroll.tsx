"use client";

import { useEffect } from "react";
import { initSmoothScroll, prefersReducedMotion } from "@/lib/animation";

/** Mounts Lenis smooth scrolling (skipped under prefers-reduced-motion). */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    return initSmoothScroll();
  }, []);
  return null;
}
