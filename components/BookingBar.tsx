"use client";

import { useEffect, useId, useState, type CSSProperties, type FormEvent } from "react";
import { siteContent } from "@/data/site-content";
import { formatTime, openReservation, toDateInputValue } from "@/lib/booking";

const FIELD =
  "peer w-full appearance-none bg-transparent pb-1 pt-[22px] font-display text-[17px] leading-none tracking-[0.04em] text-cobalt outline-none " +
  "[color-scheme:light] focus-visible:outline-none";
const LABEL = "pointer-events-none absolute left-0 top-0 sm:left-5 sm:group-first:left-0 font-sans text-[9px] font-medium uppercase tracking-[0.32em] text-cobalt-deep/60";
const CELL =
  "group relative min-w-0 flex-1 border-b border-cobalt/25 px-0 transition-colors duration-300 focus-within:border-cobalt sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0";

/**
 * Date / guests / time, in KIKI's own type and colour. Submitting opens the
 * reservation drawer with SevenRooms already on that search. Large parties go
 * to the private-events enquiry instead.
 */
export default function BookingBar() {
  const { booking, privateEventsUrl } = siteContent;
  const id = useId();
  const [today, setToday] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(String(booking.defaultPartySize));
  const [time, setTime] = useState("");

  /* Set on the client so server and client markup match. */
  useEffect(() => {
    const t = toDateInputValue(new Date());
    setToday(t);
    setDate(t);
  }, []);

  const large = guests === "large";

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (large) {
      window.open(privateEventsUrl, "_blank", "noopener,noreferrer");
      return;
    }
    openReservation({ date: date || undefined, partySize: Number(guests), time: time || undefined });
  };

  return (
    <form
      onSubmit={onSubmit}
      aria-label={booking.bar.label}
      style={{ "--glass-shadow": "0 24px 60px -30px rgba(14,44,147,0.45), 0 0 0 1px rgba(255,255,255,0.35)" } as CSSProperties}
      className="glass-light relative flex w-[min(92vw,880px)] flex-col gap-4 rounded-[3px] px-6 py-5 sm:flex-row sm:items-stretch sm:gap-0 sm:py-4 sm:pl-7 sm:pr-4"
    >
      <div className={CELL}>
        <input
          id={`${id}-date`}
          type="date"
          value={date}
          min={today || undefined}
          onChange={(e) => setDate(e.target.value)}
          className={FIELD}
          required
        />
        <label htmlFor={`${id}-date`} className={LABEL}>
          {booking.bar.date}
        </label>
      </div>

      <div className={CELL}>
        <select id={`${id}-guests`} value={guests} onChange={(e) => setGuests(e.target.value)} className={FIELD}>
          {Array.from({ length: booking.maxPartySize }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "guest" : "guests"}
            </option>
          ))}
          <option value="large">{booking.bar.largeParty}</option>
        </select>
        <label htmlFor={`${id}-guests`} className={LABEL}>
          {booking.bar.guests}
        </label>
      </div>

      <div className={`${CELL} sm:border-r-0`}>
        <select id={`${id}-time`} value={time} onChange={(e) => setTime(e.target.value)} className={FIELD} disabled={large}>
          <option value="">{booking.bar.anyTime}</option>
          {booking.times.map((t) => (
            <option key={t} value={t}>
              {formatTime(t)}
            </option>
          ))}
        </select>
        <label htmlFor={`${id}-time`} className={LABEL}>
          {booking.bar.time}
        </label>
      </div>

      <button
        type="submit"
        className="group mt-1 inline-flex shrink-0 items-center justify-center gap-3 whitespace-nowrap rounded-[2px] border border-cobalt bg-cobalt px-8 py-[15px] font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-white transition-colors duration-500 ease-editorial hover:bg-white hover:text-cobalt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 sm:ml-5 sm:mt-0"
      >
        <span>{large ? booking.bar.largeCta : booking.bar.cta}</span>
        <span aria-hidden className="transition-transform duration-500 ease-editorial group-hover:translate-x-1">
          ›
        </span>
      </button>
    </form>
  );
}
