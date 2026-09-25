"use client";

import { Link } from "next-view-transitions";
import { useEffect, useId, useState } from "react";
import { siteContent } from "@/data/site-content";
import { ScrollTrigger, registerGsap, isMobileViewport, prefersReducedMotion, SEQUENCE } from "@/lib/animation";
import BrandMark from "./BrandMark";
import ReserveButton from "./ReserveButton";

/**
 * Editorial bar laid out as in the mock: small wordmark left, navigation,
 * Reserve right. Transparent with white type over the hero photograph; turns
 * white with cobalt type once the photograph has faded out of the sequence.
 * Below md the links collapse into a minimal Menu button.
 */
interface HeaderProps {
  /** "home": transparent until the hero sequence has faded. "page": transparent over the page hero, solid after it. */
  mode?: "home" | "page";
  /** Pathname of the current page, for the active underline. */
  current?: string;
  /** Solid regardless of scroll (used over content with no hero photograph). */
  forceSolid?: boolean;
}

export default function Header({ mode = "home", current = "/", forceSolid = false }: HeaderProps) {
  const [scrolled, setSolid] = useState(false);
  const solid = forceSolid || scrolled;
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    registerGsap();
    const reduced = prefersReducedMotion();
    const trigger = ScrollTrigger.create({
      start: () => {
        if (mode === "page") return window.innerHeight * 0.62;
        if (reduced) return window.innerHeight * 0.85;
        const m = isMobileViewport() ? SEQUENCE.scrollMultiplier.mobile : SEQUENCE.scrollMultiplier.desktop;
        return (window.innerHeight * m * (SEQUENCE.door + SEQUENCE.heroFade[1])) / (1 + SEQUENCE.door);
      },
      onEnter: () => setSolid(true),
      onLeaveBack: () => setSolid(false),
    });
    /* Home only: the page opens on the stone door, where the header must already be solid. */
    let doorTrigger: ScrollTrigger | undefined;
    if (mode === "home" && !reduced) {
      doorTrigger = ScrollTrigger.create({
        start: 0,
        end: () => {
          const m = isMobileViewport() ? SEQUENCE.scrollMultiplier.mobile : SEQUENCE.scrollMultiplier.desktop;
          return (window.innerHeight * m * SEQUENCE.door * 0.8) / (1 + SEQUENCE.door);
        },
        onLeave: () => setSolid(false),
        onEnterBack: () => setSolid(true),
      });
      setSolid(true);
    }
    return () => {
      trigger.kill();
      doorTrigger?.kill();
    };
  }, [mode]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /* Links whose href is "#" are demo placeholders: swallow the click so the page neither navigates nor jumps. */
  const inert = (href: string) => href === "#";

  const onImage = !solid && !open;
  const linkClass =
    "link-underline font-sans text-[10px] font-medium uppercase tracking-[0.32em] focus-visible:outline-none " +
    (onImage ? "text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]" : "text-cobalt");

  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className={
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-500 ease-editorial " +
        (onImage ? "border-b border-transparent bg-transparent" : "glass-light border-b border-white/60")
      }
    >
      <div className="mx-auto flex h-[72px] max-w-[1600px] items-center gap-6 px-5 md:h-20 md:px-8 lg:gap-10">
        <Link
          href="/"
          className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
          aria-label="KIKI on the River, home"
        >
          <BrandMark color={onImage ? "white" : "cobalt"} className="h-7 md:h-9" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex lg:gap-9" aria-label="Primary">
          {siteContent.navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`${linkClass} ${item.href === current ? "is-current" : ""}`}
              aria-current={item.href === current ? "page" : undefined}
              onClick={inert(item.href) ? (e) => e.preventDefault() : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <ReserveButton href={siteContent.reservationUrl} label={siteContent.hero.reserveLabel} size="md" variant={onImage ? "onImage" : "primary"} />
          <button
            type="button"
            className={
              "md:hidden rounded-[2px] border px-3 py-[10px] font-sans text-[10px] font-medium uppercase tracking-[0.28em] transition-colors duration-500 ease-editorial focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current " +
              (onImage ? "border-white/70 text-white" : "border-cobalt/40 text-cobalt")
            }
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <div id={menuId} hidden={!open} className="border-t border-cobalt/10 bg-white/96 backdrop-blur-xl md:hidden">
        <nav className="mx-auto flex max-w-[1600px] flex-col px-5 py-4" aria-label="Primary, mobile">
          {siteContent.navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={item.href === current ? "page" : undefined}
              onClick={(e) => {
                if (inert(item.href)) e.preventDefault();
                setOpen(false);
              }}
              className={`border-b border-cobalt/10 py-4 font-sans text-[11px] font-medium uppercase tracking-[0.32em] last:border-b-0 ${item.href === current ? "text-bougainvillea" : "text-cobalt"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
