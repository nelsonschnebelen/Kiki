"use client";

/* eslint-disable @next/next/no-img-element -- tiny transparent sprites; next/image adds no value here */

import { useEffect, useRef } from "react";
import { PETALS, MOBILE_PETAL_LIMIT } from "@/lib/petal-config";
import { gsap, registerGsap, hasFinePointer, prefersReducedMotion } from "@/lib/animation";

interface PetalFieldProps {
  /** Which depth layer to render. Two fields are stacked around the typography. */
  layer: "front" | "back";
}

/**
 * Seeded, layered bougainvillea: real bracts and leaves cut from the wordmark.
 *
 * Element stack per petal (outer to inner), each animated by one concern only:
 *   .petal-outer   scroll parallax + staged reveal (driven by the scroll sequence)
 *   .petal-drift   fall (y) and sway (x)
 *   .petal-tumble  3D tumble: rotationX turns over, rotationY flutters, rotation spins
 *   .petal-repel   cursor repulsion (desktop fine pointer only)
 *
 * Everything is transform/opacity. Drift is paused while the field is off screen.
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
        const d = el.dataset;
        const fall = Number(d.fall);
        const sway = Number(d.sway);
        const swayDuration = Number(d.swayDuration);
        const phase = Number(d.phase);
        const tumble = el.querySelector<HTMLElement>(".petal-tumble");
        if (!tumble) return;
        const rotation = Number(d.rotation);
        const spin = Number(d.spin);
        const tumbleDuration = Number(d.tumbleDuration);
        const flip = d.flip === "1";
        const tumbleAmplitude = Number(d.tumbleAmplitude);
        const flutter = Number(d.flutter);
        const flutterDuration = Number(d.flutterDuration);

        // Fall: slightly faster at the bottom than the top, like a petal gathering speed.
        tweens.push(
          gsap.fromTo(el, { y: "-18vh" }, { y: "120vh", duration: fall, ease: "power1.in", repeat: -1, delay: -phase * fall }),
          // Sway: a pendulum, paired with a lean into the direction of travel.
          gsap.fromTo(
            el,
            { x: -sway / 2 },
            { x: sway / 2, duration: swayDuration, ease: "sine.inOut", yoyo: true, repeat: -1, delay: -phase * swayDuration },
          ),
          // Tumble: a few petals turn right over; most rock, so they are rarely edge-on…
          flip
            ? gsap.fromTo(
                tumble,
                { rotationX: 0 },
                { rotationX: 360, duration: tumbleDuration, ease: "none", repeat: -1, delay: -phase * tumbleDuration },
              )
            : gsap.fromTo(
                tumble,
                { rotationX: -tumbleAmplitude },
                {
                  rotationX: tumbleAmplitude,
                  duration: tumbleDuration / 2,
                  ease: "sine.inOut",
                  yoyo: true,
                  repeat: -1,
                  delay: -phase * tumbleDuration,
                },
              ),
          // …flutters about the Y axis…
          gsap.fromTo(
            tumble,
            { rotationY: -flutter },
            { rotationY: flutter, duration: flutterDuration, ease: "sine.inOut", yoyo: true, repeat: -1, delay: -phase * flutterDuration },
          ),
          // …and spins slowly in the plane.
          gsap.fromTo(
            tumble,
            { rotation },
            { rotation: rotation + spin, duration: fall, ease: "none", repeat: -1, delay: -phase * fall },
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
        const RADIUS = 130;
        const PUSH = 32;

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

    /* Pause all motion while the field is off screen. */
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
      {petals.map((p) => {
        const height = Math.round((p.width * p.sprite.h) / p.sprite.w);
        return (
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
              data-spin={p.spin}
              data-tumble-duration={p.tumbleDuration}
              data-flip={p.flip ? "1" : "0"}
              data-tumble-amplitude={p.tumbleAmplitude}
              data-flutter={p.flutter}
              data-flutter-duration={p.flutterDuration}
              data-phase={p.phase}
              style={{ transform: "translateY(-18vh)", perspective: "600px" }}
            >
              <div
                className="petal-tumble will-change-transform"
                style={{ transform: `rotate(${p.rotation}deg)`, transformStyle: "preserve-3d" }}
              >
                <div className="petal-repel">
                  <img
                    src={p.sprite.src}
                    alt=""
                    width={p.width}
                    height={height}
                    decoding="async"
                    loading={p.tier === "base" ? "eager" : "lazy"}
                    draggable={false}
                    style={{
                      display: "block",
                      width: p.width,
                      height,
                      filter: [
                        p.blur ? `blur(${p.blur}px)` : "",
                        "drop-shadow(0 2px 3px rgba(120, 0, 40, 0.16))",
                      ]
                        .filter(Boolean)
                        .join(" "),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
