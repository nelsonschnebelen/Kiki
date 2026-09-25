"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { siteContent } from "@/data/site-content";
import { formatDate, openReservation } from "@/lib/booking";
import { nextDateFor } from "@/lib/hours";
import Meander from "./Meander";
import Reveal from "./Reveal";
import SplitReveal from "./SplitReveal";

/**
 * "Book the night you want": the four nights people come to KIKI for, each
 * resolved to its next real date and opened straight into SevenRooms at that
 * date and time. One tap from the page to a table.
 */
export default function QuickPicks({ compact = false }: { compact?: boolean }) {
  const { quickPicks } = siteContent;
  const [dates, setDates] = useState<Record<string, string>>({});
  useEffect(() => {
    setDates(Object.fromEntries(quickPicks.map((q) => [q.id, nextDateFor(q.days, q.time)])));
  }, [quickPicks]);

  return (
    <section className={`relative ${compact ? "" : "mx-auto max-w-[1500px] px-6 py-[10svh] md:px-10"}`} aria-labelledby={compact ? undefined : "quick-picks-heading"} aria-label={compact ? "Book the night you want" : undefined}>
      {!compact && (
        <Reveal className="mb-10 text-center md:mb-14">
          <p className="script text-[26px] leading-none text-bougainvillea">Which night is yours?</p>
          <SplitReveal id="quick-picks-heading" className="font-display display-sturdy-lg mt-3 text-[32px] uppercase leading-[1.12] tracking-[0.14em] text-cobalt md:text-[46px]">
            Book the night you want
          </SplitReveal>
          <Meander className="mx-auto mt-6 opacity-70" units={5} />
        </Reveal>
      )}
      <ul className={`grid gap-4 ${compact ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 md:gap-5 lg:grid-cols-4"}`}>
        {quickPicks.map((q, i) => {
          const date = dates[q.id];
          return (
            <li key={q.id}>
              <Reveal delay={i * 0.08}>
                <button
                  type="button"
                  onClick={() => openReservation({ date, time: q.time, partySize: siteContent.booking.defaultPartySize })}
                  className="group relative block w-full overflow-hidden rounded-[4px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-4 focus-visible:ring-offset-stone"
                  aria-label={`Reserve ${q.title}${date ? `, ${formatDate(date)}` : ""}`}
                >
                  <div className={`relative w-full overflow-hidden ${compact ? "aspect-[16/9]" : "aspect-[4/5]"}`}>
                    <Image src={q.image} alt="" fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw" quality={82} className="object-cover transition-transform duration-[1400ms] ease-editorial group-hover:scale-[1.05]" style={{ objectPosition: q.focus }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-cobalt-deep/85 via-cobalt-deep/15 to-transparent" aria-hidden />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="font-sans text-[9.5px] font-semibold uppercase tracking-[0.36em] text-white/80">{q.when}</p>
                      <h3 className="font-display display-sturdy mt-2 text-[20px] uppercase leading-[1.15] text-white md:text-[22px]">{q.title}</h3>
                      <p className="mt-1.5 font-sans text-[12px] text-white/80">{q.body}</p>
                      <p className="mt-4 inline-flex items-center gap-2 border-b border-white/70 pb-1 font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-white transition-colors group-hover:border-bougainvillea group-hover:text-bougainvillea">
                        {date ? `Reserve · ${formatDate(date)}` : "Reserve"}
                        <span aria-hidden className="transition-transform duration-500 ease-editorial group-hover:translate-x-1">
                          ›
                        </span>
                      </p>
                    </div>
                  </div>
                </button>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
