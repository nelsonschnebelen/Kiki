"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { siteContent } from "@/data/site-content";
import {
  RESERVATION_EVENT,
  buildBookingUrl,
  formatDate,
  formatTime,
  type ReservationRequest,
} from "@/lib/booking";
import BrandMark from "./BrandMark";
import KikiReservations from "./reservations/KikiReservations";

interface LenisLike {
  stop: () => void;
  start: () => void;
}

/**
 * Slide-in reservation panel. Every Reserve button and the booking bar open it
 * (see lib/booking.ts). The site stays visible behind it, lightly dimmed, so
 * booking reads as part of the page rather than a pop-up. Inside is the Dishio
 * flow (components/reservations), pre-filled with whatever was chosen outside.
 */
export default function ReservationDrawer() {
  const { booking } = siteContent;
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState<ReservationRequest>({});
  const [src, setSrc] = useState<string | null>(null);
  const [session, setSession] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setOpen(false), []);

  /* Open on request from anywhere in the app. */
  useEffect(() => {
    const onReserve = (e: Event) => {
      const detail = (e as CustomEvent<ReservationRequest>).detail ?? {};
      returnFocusRef.current = document.activeElement as HTMLElement | null;
      const next = buildBookingUrl(detail);
      setRequest(detail);
      setSrc(next);
      setSession((n) => n + 1); // a fresh flow each time it opens
      setOpen(true);
    };
    window.addEventListener(RESERVATION_EVENT, onReserve);
    return () => window.removeEventListener(RESERVATION_EVENT, onReserve);
  }, []);

  /* While open: lock page scroll, close on Escape, keep Tab inside the panel, restore focus after. */
  useEffect(() => {
    if (!open) return;
    const lenis = (window as Window & { __lenis?: LenisLike }).__lenis;
    lenis?.stop();
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.documentElement.dataset.drawer = "open";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = panelRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], input, select, textarea");
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 80);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = previousOverflow;
      delete document.documentElement.dataset.drawer;
      lenis?.start();
      returnFocusRef.current?.focus?.();
    };
  }, [open, close]);

  const summary = [
    request.date ? formatDate(request.date) : null,
    request.partySize ? `${request.partySize} ${request.partySize === 1 ? "guest" : "guests"}` : null,
    request.time ? formatTime(request.time) : null,
  ].filter(Boolean);

  return (
    <div
      className={`fixed inset-0 z-[70] ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
      // Hidden panels must not be reachable by keyboard or assistive tech.
      {...(!open ? { inert: true } : {})}
    >
      {/* The site stays visible behind the panel. */}
      <div
        className={`absolute inset-0 bg-cobalt-deep/35 backdrop-blur-[2px] transition-opacity duration-500 ease-editorial motion-reduce:transition-none ${open ? "opacity-100" : "opacity-0"}`}
        onClick={close}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={booking.drawer.title}
        data-lenis-prevent
        style={{ "--glass-shadow": "-30px 0 80px -30px rgba(14,44,147,0.45)" } as CSSProperties}
        className={`glass absolute inset-y-0 right-0 flex w-full flex-col transition-transform duration-[650ms] ease-editorial motion-reduce:transition-none sm:w-[min(560px,92vw)] ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="relative shrink-0 border-b border-cobalt/12 px-6 pb-5 pt-6 sm:px-8">
          <div className="flex items-start justify-between gap-6">
            <BrandMark color="cobalt" className="h-8" />
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              className="-mr-2 -mt-1 grid h-10 w-10 place-items-center rounded-full text-cobalt transition-colors duration-300 hover:bg-cobalt/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
              aria-label="Close reservations"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden>
                <path d="M2.5 2.5l11 11M13.5 2.5l-11 11" />
              </svg>
            </button>
          </div>
          <h2 className="mt-6 font-display text-[26px] uppercase leading-[1.1] tracking-[0.1em] text-cobalt">{booking.drawer.title}</h2>
          <p className="mt-3 font-sans text-[10.5px] uppercase tracking-[0.3em] text-cobalt-deep/70">
            {summary.length ? summary.join("  ·  ") : booking.drawer.subtitle}
          </p>
          <span className="absolute bottom-0 left-6 block h-px w-12 bg-gold sm:left-8" aria-hidden />
        </div>

        <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-4 pt-3 sm:px-4" data-lenis-prevent>
          {open && <KikiReservations key={session} mode="drawer" prefill={request} onClose={close} />}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-4 border-t border-cobalt/12 px-6 py-3.5 sm:px-8">
          <span className="font-sans text-[9.5px] uppercase tracking-[0.26em] text-cobalt-deep/55">{booking.drawer.poweredBy}</span>
          {src && (
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline font-sans text-[9.5px] uppercase tracking-[0.26em] text-cobalt"
            >
              {booking.drawer.newTab}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
