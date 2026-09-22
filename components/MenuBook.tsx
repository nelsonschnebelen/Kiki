"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MENUS, MENU_DISCLAIMER, type Menu } from "@/data/menu";
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion, EASE } from "@/lib/animation";
import Meander from "./Meander";
import ParallaxBand from "./ParallaxBand";
import Reveal from "./Reveal";

/** A photograph to break each menu, chosen to suit the course. */
const BANDS: Record<string, { image: string; alt: string; note: string[]; focus?: string }> = {
  dinner: { image: "/images/letters/k1.jpg", alt: "The chef pouring rosé at the table", note: ["Same Table", "Different Magic"], focus: "50% 30%" },
  lunch: { image: "/images/letters/i1.jpg", alt: "Lunch on the water", note: ["Good Food", "Brighter Days"], focus: "50% 45%" },
  cocktails: { image: "/images/champagne.jpg", alt: "Champagne on ice at sunset", note: ["Sunset Sips", "Await"], focus: "50% 40%" },
  brunch: { image: "/images/long-table.jpg", alt: "A long table under the bougainvillea", note: ["Brunch Meets", "The Riviera"], focus: "60% 50%" },
  "happy-hour": { image: "/images/marina.jpg", alt: "The marina at golden hour", note: ["Sip, Savor", "Repeat"], focus: "50% 40%" },
  dessert: { image: "/images/heart.jpg", alt: "A heart of pink roses", note: ["Sweet", "Endings"], focus: "40% 50%" },
};

export default function MenuBook() {
  const [active, setActive] = useState<Menu>(MENUS[0]);
  const id = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  /* Deep links: /menu#brunch */
  useEffect(() => {
    const pick = () => {
      const m = MENUS.find((x) => x.id === window.location.hash.slice(1));
      if (m) setActive(m);
    };
    pick();
    window.addEventListener("hashchange", pick);
    return () => window.removeEventListener("hashchange", pick);
  }, []);

  /* Switching menus: dishes rise in, and the page re-measures for the new height. */
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (prefersReducedMotion()) {
      ScrollTrigger.refresh();
      return;
    }
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(".menu-item", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: EASE.reveal, stagger: 0.03, overwrite: "auto" });
    }, list);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [active]);

  const choose = (m: Menu) => {
    setActive(m);
    history.replaceState(null, "", `#${m.id}`);
    const top = (barRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 72;
    if (window.scrollY > top) window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  const band = BANDS[active.id] ?? BANDS.dinner;
  const split = Math.min(2, Math.max(1, Math.floor(active.sections.length / 2)));
  const before = active.sections.slice(0, split);
  const after = active.sections.slice(split);

  return (
    <div>
      {/* Course selector, sticky under the header. */}
      <div ref={barRef} className="sticky top-[72px] z-30 border-y border-cobalt/12 bg-stone/92 backdrop-blur-sm md:top-20">
        <div role="tablist" aria-label="Menus" className="mx-auto flex max-w-[1400px] gap-2 overflow-x-auto px-4 py-3 md:justify-center md:gap-3 md:px-8 md:py-4">
          {MENUS.map((m) => {
            const on = m.id === active.id;
            return (
              <button
                key={m.id}
                role="tab"
                id={`${id}-tab-${m.id}`}
                aria-selected={on}
                aria-controls={`${id}-panel`}
                onClick={() => choose(m)}
                className={`shrink-0 rounded-[2px] border px-5 py-3 font-sans text-[10px] font-medium uppercase tracking-[0.3em] transition-colors duration-500 ease-editorial focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt md:text-[10.5px] ${
                  on ? "border-cobalt bg-cobalt text-white" : "border-cobalt/25 bg-transparent text-cobalt hover:border-cobalt"
                }`}
              >
                {m.title}
              </button>
            );
          })}
        </div>
      </div>

      <div ref={listRef} id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active.id}`}>
        <Sections sections={before} menuId={active.id} />
        <ParallaxBand image={band.image} alt={band.alt} note={band.note} focus={band.focus} height="58svh" />
        <Sections sections={after} menuId={active.id} />

        <Reveal className="mx-auto max-w-[900px] px-6 pb-[12svh] pt-[6svh] text-center">
          <Meander className="mx-auto mb-8 opacity-80" units={7} />
          {active.chef && <p className="font-display text-[15px] uppercase tracking-[0.34em] text-cobalt">{active.chef}</p>}
          <p className="mx-auto mt-6 max-w-[62ch] font-sans text-[11px] leading-[1.9] tracking-[0.06em] text-cobalt-deep/65">{MENU_DISCLAIMER}</p>
        </Reveal>
      </div>
    </div>
  );
}

function Sections({ sections, menuId }: { sections: Menu["sections"]; menuId: string }) {
  if (!sections.length) return null;
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-[7svh] md:px-10">
      {sections.map((s, i) => (
        <Reveal key={`${menuId}-${s.title}-${i}`} className={i ? "mt-[9svh]" : ""}>
          <header className="mb-10 text-center md:mb-14">
            <Meander className="mx-auto mb-6 opacity-70" units={5} />
            <h2 className="font-display text-[30px] uppercase leading-[1.1] tracking-[0.16em] text-cobalt md:text-[40px]">{s.title}</h2>
            {s.note && <p className="mt-4 font-sans text-[10px] uppercase tracking-[0.4em] text-cobalt-deep/70 md:text-[11px]">{s.note}</p>}
          </header>
          {s.items.length > 0 && (
            <ul className="grid grid-cols-1 gap-x-16 gap-y-8 md:grid-cols-2 md:gap-y-10">
              {s.items.map((it, j) => (
                <li key={j} className="menu-item border-b border-cobalt/12 pb-6">
                  <h3 className="font-display text-[19px] uppercase leading-[1.25] tracking-[0.12em] text-cobalt md:text-[21px]">{it.name}</h3>
                  {it.description && <p className="mt-2.5 font-sans text-[13px] leading-[1.75] text-cobalt-deep/75 md:text-[14px]">{it.description}</p>}
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      ))}
    </div>
  );
}
