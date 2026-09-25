"use client";

import { useEffect, useRef, useState } from "react";
import { siteContent } from "@/data/site-content";
import { buildBookingUrl } from "@/lib/booking";

/**
 * SevenRooms, inline on the reservations page in a glass frame. Loads only
 * when scrolled near, and keeps a plain link for anyone the embed fails.
 */
export default function ReserveInline() {
  const { booking } = siteContent;
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const src = buildBookingUrl({ partySize: booking.defaultPartySize });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="glass overflow-hidden rounded-[6px]">
      <div className="relative h-[720px] bg-white">
        {!loaded && (
          <div className="absolute inset-0 grid place-items-center bg-stone" aria-hidden>
            <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-cobalt/60">{booking.drawer.loading}</span>
          </div>
        )}
        {near && <iframe src={src} title="KIKI on the River reservations, by SevenRooms" className="absolute inset-0 h-full w-full border-0" onLoad={() => setLoaded(true)} allow="payment" />}
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-cobalt/12 px-5 py-3">
        <span className="font-sans text-[9.5px] uppercase tracking-[0.26em] text-cobalt-deep/55">{booking.drawer.poweredBy}</span>
        <a href={src} target="_blank" rel="noopener noreferrer" className="link-underline font-sans text-[9.5px] uppercase tracking-[0.26em] text-cobalt">
          {booking.drawer.newTab}
        </a>
      </div>
    </div>
  );
}
