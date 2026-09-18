"use client";

import { useEffect, useRef } from "react";
import { PETALS, MOBILE_PETAL_LIMIT, type PetalConfig } from "@/lib/petal-config";
import { gsap, registerGsap, hasFinePointer, prefersReducedMotion } from "@/lib/animation";

interface PetalFieldProps {
  /** Which depth layer to render. Two fields are stacked around the typography. */
  layer: "front" | "back";
}

const GRADIENTS: Array<[string, string]> = [
  ["#FF3D8A", "#E50064"],
  ["#FF6FB0", "#F0187A"],
  ["#FFA0CB", "#FF4D9C"],
];

/** Bougainvillea bract: a soft, slightly pointed oval with a pale vein. */
function Petal({ petal, gradientId }: { petal: PetalConfig; gradientId: string }) {
  return (
    <svg
      width={petal.size}
      height={Math.round(petal.size * 1.3)}
      viewBox="0 0 24 32"
      aria-hidden
      style={{
        display: "block",
        filter: petal.blur ? `blur(${petal.blur}px)` : undefined,
      }}
    >
      <path
        d="M12 1.5C16.8 1.5 22.6 8.2 22 16.6C21.5 24.2 15.2 29.6 12 31C8.8 29.6 2.5 24.2 2 16.6C1.4 8.2 7.2 1.5 12 1.5Z"
        fill={`url(#${gradientId})`}
      />
      <path
        d="M12 4.5C12.7 12 12.9 20.5 12 28.5"
        stroke="rgba(255,255,255,0.42)"
        strokeWidth="0.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/**
 * Seeded, layered bougainvillea petals.
 *
 * - Drift (fall + sway) runs on GSAP tweens, paused while off screen.
 * - Scroll parallax and the staged reveal are driven by the scroll sequence,
 *   which targets `.petal-outer` and reads the data attributes set here.
 * - Cursor repulsion runs on desktop fine pointers only.
 */
export default function PetalField({ layer }: PetalFieldProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const petals = PETALS.filter((p) => p.front === (layer === "front"));

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    registerGsap();

    const tweens: gsap.core.Tween[] = [];
    let tickerFn: ((time: number) => void) | null = null;
    let onMove: ((e: MouseEvent) => void) | null = null;

    const ctx = gsap.context(() => {
      const drifts = gsap.utils.toArray<HTMLElement>(".petal-drift", root);

      drifts.forEach((el) => {
        if (!el.offsetParent) return; // hidden at this breakpoint
        const fall = Number(el.dataset.fall);
        const sway = Number(el.dataset.sway);
        const swayDuration = Number(el.dataset.swayDuration);
        const rotation = Number(el.dataset.rotation);
        const rotationDrift = Number(el.dataset.rotationDrift);
        const phase = Number(el.dataset.phase);

        tweens.push(
          gsap.fromTo(
            el,
            { y: "-16vh" },
            { y: "118vh", duration: fall, ease: "none", repeat: -1, delay: -phase * fall },
          ),
          gsap.fromTo(
            el,
            { x: -sway / 2, rotation },
            {
              x: sway / 2,
              rotation: rotation + rotationDrift,
              duration: swayDuration,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              delay: -phase * swayDuration,
            },
          ),
        );
      });

      /* Cursor repulsion: desktop only. */
      if (hasFinePointer()) {
        const repels = gsap.utils.toArray<HTMLElement>(".petal-repel", root).filter((el) => el.offsetParent);
        const setters = repels.map((el) => ({
          el,
          x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" }),
        }));
        const mouse = { x: -9999, y: -9999, active: false };
        const RADIUS = 150;
        const PUSH = 38;

        onMove = (e: MouseEvent) => {
          mouse.x = e.clientX;
          mouse.y = e.clientY;
          mouse.active = true;
        };
        tickerFn = () => {
          if (!mouse.active) return;
          for (const s of setters) {
            const r = s.el.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            const dx = cx - mouse.x;
            const dy = cy - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < RADIUS && dist > 0.001) {
              const push = (1 - dist / RADIUS) * PUSH;
              s.x((dx / dist) * push);
              s.y((dy / dist) * push);
            } else {
              s.x(0);
              s.y(0);
            }
          }
        };
        window.addEventListener("mousemove", onMove, { passive: true });
        gsap.ticker.add(tickerFn);
      }
    }, root);

    /* Pause all drift while the field is off screen. */
    const io = new IntersectionObserver(
      ([entry]) => {
        const method = entry.isIntersecting ? "resume" : "pause";
        tweens.forEach((t) => t[method]());
      },
      { threshold: 0 },
    );
    io.observe(root);

    return () => {
      io.disconnect();
      if (onMove) window.removeEventListener("mousemove", onMove);
      if (tickerFn) gsap.ticker.remove(tickerFn);
      ctx.revert();
    };
  }, [layer]);

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
        <defs>
          {GRADIENTS.map(([a, b], i) => (
            <linearGradient key={i} id={`petal-grad-${layer}-${i}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={a} />
              <stop offset="100%" stopColor={b} />
            </linearGradient>
          ))}
        </defs>
      </svg>

      {petals.map((p) => (
        <div
          key={p.id}
          className={`petal-outer absolute top-0 will-change-transform ${p.id >= MOBILE_PETAL_LIMIT ? "hidden md:block" : ""}`}
          data-tier={p.tier}
          data-depth={p.depth}
          data-opacity={p.opacity}
          style={{ left: `${p.x}vw`, opacity: p.tier === "base" ? p.opacity : 0 }}
        >
          <div
            className="petal-drift will-change-transform"
            data-fall={p.fallDuration}
            data-sway={p.sway}
            data-sway-duration={p.swayDuration}
            data-rotation={p.rotation}
            data-rotation-drift={p.rotationDrift}
            data-phase={p.phase}
            style={{ transform: `translateY(-16vh) rotate(${p.rotation}deg)` }}
          >
            <div className="petal-repel">
              <Petal petal={p} gradientId={`petal-grad-${layer}-${p.variant}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
