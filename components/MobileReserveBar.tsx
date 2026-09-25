"use client";

import { useEffect, useState } from "react";
import { siteContent } from "@/data/site-content";
import { openReservation } from "@/lib/booking";
import { todayStatus } from "@/lib/hours";

/**
 * Phone-only bar pinned to the bottom of the screen: Reserve and Call, with
 * tonight's hours. Slides up once the visitor is past the hero (so the hero's
 * own call to action isn't doubled) and drops away while the drawer is open
 * (see html[data-drawer] in globals.css).
 */
export default function MobileReserveBar({ after = 0.9 }: { /** Show after this many viewport heights. */ after?: number }) {
  const { contact, hero } = siteContent;
  const [shown, setShown] = useState(false);
  const [status, setStatus] = useState<{ line: string; open: boolean } | null>(null);

  useEffect(() => {
    setStatus(todayStatus());
    const onScroll = () => setShown(window.scrollY > window.innerHeight * after);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [after]);

  return (
    <div
      className={`mobile-reserve-bar fixed inset-x-0 bottom-0 z-[45] px-3 pb-[max(10px,env(safe-area-inset-bottom))] transition-transform duration-500 ease-editorial md:hidden ${shown ? "translate-y-0" : "translate-y-[120%]"}`}
      aria-hidden={!shown}
      {...(!shown ? { inert: true } : {})}
    >
      <div className="glass-light flex items-center gap-2 rounded-[14px] border border-white/60 p-2 pl-4">
        <div className="min-w-0 flex-1">
          <p className="truncate font-sans text-[9px] font-semibold uppercase tracking-[0.3em] text-cobalt-deep/60">{status?.open ? "Tonight" : "Hours"}</p>
          <p className="truncate font-display display-sturdy text-[12px] uppercase text-cobalt">{status?.line ?? contact.happyHour}</p>
        </div>
        <a href={contact.phoneHref} className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] border border-cobalt/25 text-cobalt" aria-label={`Call ${contact.phone}`}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
          </svg>
        </a>
        <button
          type="button"
          onClick={() => openReservation()}
          className="h-11 shrink-0 rounded-[10px] bg-cobalt px-5 font-sans text-[10.5px] font-semibold uppercase tracking-[0.24em] text-white shadow-[0_12px_28px_-12px_rgba(18,56,184,0.8)]"
        >
          {hero.reserveLabel}
        </button>
      </div>
    </div>
  );
}
