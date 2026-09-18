"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap, hasFinePointer, prefersReducedMotion } from "@/lib/animation";

type Variant = "primary" | "ghost" | "onImage";
type Size = "md" | "lg";

interface ReserveButtonProps {
  href: string;
  label: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  withArrow?: boolean;
  /** Opens in a new tab. Defaults to true for absolute URLs. */
  external?: boolean;
}

const BASE =
  "group relative inline-flex select-none items-center justify-center gap-3 rounded-[2px] font-sans font-medium uppercase tracking-[0.28em] " +
  "transition-[background-color,color,border-color,box-shadow] duration-500 ease-editorial " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-stone";

const VARIANTS: Record<Variant, string> = {
  primary: "border border-cobalt bg-cobalt text-white hover:bg-white hover:text-cobalt",
  ghost: "border border-cobalt/60 bg-transparent text-cobalt hover:border-cobalt hover:bg-cobalt hover:text-white",
  onImage:
    "border border-cobalt bg-cobalt text-white shadow-[0_18px_40px_-18px_rgba(18,56,184,0.7)] hover:bg-white hover:text-cobalt",
};

const SIZES: Record<Size, string> = {
  md: "px-7 py-3 text-[10.5px]",
  lg: "px-10 py-[15px] text-[11.5px]",
};

/**
 * Cobalt call-to-action with a subtle magnetic hover (desktop, fine pointer only)
 * and a cobalt-to-white colour inversion.
 */
export default function ReserveButton({
  href,
  label,
  variant = "primary",
  size = "md",
  className = "",
  withArrow = false,
  external,
}: ReserveButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !hasFinePointer() || prefersReducedMotion()) return;
    registerGsap();

    const toX = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" });
    const toY = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" });
    const strength = 0.26;
    const max = 10;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      toX(gsap.utils.clamp(-max, max, dx * strength));
      toY(gsap.utils.clamp(-max, max, dy * strength));
    };
    const onLeave = () => {
      toX(0);
      toY(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, []);

  const isExternal = external ?? /^https?:\/\//.test(href);

  return (
    <a
      ref={ref}
      href={href}
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
    >
      <span>{label}</span>
      {withArrow && (
        <span
          aria-hidden
          className="inline-block translate-x-0 transition-transform duration-500 ease-editorial group-hover:translate-x-1"
        >
          ›
        </span>
      )}
    </a>
  );
}
