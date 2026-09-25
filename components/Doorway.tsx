import { forwardRef } from "react";
import BrandMark from "./BrandMark";
import { siteContent } from "@/data/site-content";

/*
 * The arch is drawn in a 1000 x 1000 box and scaled to cover the viewport, so
 * it sits at the same place on every screen and the layer can zoom around it.
 * One CSS unit (--u) is 1/1000 of that cover scale, so the outline, the
 * wordmark and the mask stay in register at every viewport. The arch centre
 * sits a little below the middle to leave the header room above the wordmark.
 */
const ARCH = { w: 270, h: 430, r: 135, cx: 500, cy: 560 };
const MASK =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice"><path fill="#000" fill-rule="evenodd" d="M0 0H1000V1000H0Z M${ARCH.cx - ARCH.w / 2} ${ARCH.cy + ARCH.h / 2} V${ARCH.cy - ARCH.h / 2 + ARCH.r} A${ARCH.r} ${ARCH.r} 0 0 1 ${ARCH.cx + ARCH.w / 2} ${ARCH.cy - ARCH.h / 2 + ARCH.r} V${ARCH.cy + ARCH.h / 2} Z"/></svg>`,
  );

const u = (n: number) => `calc(${n} * var(--u))`;
const ORIGIN = `50% ${ARCH.cy / 10}%`;

/**
 * The door. A stone wall with one arched opening, the wordmark above it, the
 * film alive behind it. The scroll sequence zooms this layer through the arch
 * until the opening fills the screen, then lets it go. Swap the wall for a
 * photograph of the real entrance (with the doorway masked) and nothing else
 * needs to change.
 */
const Doorway = forwardRef<HTMLDivElement>(function Doorway(_, ref) {
  const { brand } = siteContent;
  const centre = { left: "50%", top: `${ARCH.cy / 10}%` };
  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 z-40 will-change-transform"
      style={{ transformOrigin: ORIGIN, "--u": "calc(max(100vw, 100svh) / 1000)", "--t": "calc(min(100vw, 100svh) / 1000)" } as React.CSSProperties}
      aria-hidden
    >
      {/* The wall, with the arch cut out of it. */}
      <div
        className="absolute inset-0 bg-stone"
        style={{ maskImage: `url("${MASK}")`, WebkitMaskImage: `url("${MASK}")`, maskSize: "cover", WebkitMaskSize: "cover", maskPosition: "center", WebkitMaskPosition: "center", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat" }}
      />
      {/* The frame: cobalt on the sides and over the top, open at the threshold; a soft inner shadow for depth. */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-t-full border-cobalt"
        style={{ ...centre, width: u(ARCH.w), height: u(ARCH.h), borderWidth: `${u(3)} ${u(3)} 0`, boxShadow: `inset 0 0 ${u(36)} rgba(14,44,147,0.35)` }}
      />
      {/* Wordmark over the door, the brand line beneath it. */}
      <div className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center" style={{ bottom: `calc(${100 - ARCH.cy / 10}% + ${u(ARCH.h / 2)} + max(20px, calc(28 * var(--t))))` }}>
        <div style={{ width: "max(150px, calc(190 * var(--t)))" }}>
          <BrandMark color="cobalt" className="block w-full" />
        </div>
        <p className="whitespace-nowrap font-sans font-medium uppercase tracking-[0.55em] text-cobalt" style={{ fontSize: "max(9px, calc(10 * var(--t)))", marginTop: "max(8px, calc(10 * var(--t)))" }}>
          {brand.subtitle}
        </p>
      </div>
      {/* Invitation under the threshold. */}
      <p className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-sans font-medium uppercase tracking-[0.5em] text-cobalt/70" style={{ top: `calc(${ARCH.cy / 10}% + ${u(ARCH.h / 2 + 26)})`, fontSize: u(9.5) }}>
        Scroll to come in
      </p>
    </div>
  );
});

export default Doorway;
