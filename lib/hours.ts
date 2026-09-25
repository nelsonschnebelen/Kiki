/** Opening-hours helpers for the footer, the reserve page and the mobile bar. */
import { siteContent } from "@/data/site-content";
import { toDateInputValue } from "./booking";

type Span = (typeof siteContent.contact.hours)[number];

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

/** "17:00" -> "5 PM", "12:30" -> "12:30 PM", "26:00" -> "2 AM" */
export function fmtHour(t: string): string {
  const [h24, m] = t.split(":").map(Number);
  const h = h24 % 24;
  const suffix = h < 12 ? "AM" : "PM";
  const hh = ((h + 11) % 12) + 1;
  return m ? `${hh}:${String(m).padStart(2, "0")} ${suffix}` : `${hh} ${suffix}`;
}

export function spanFor(day: number): Span | undefined {
  return siteContent.contact.hours.find((h) => (h.days as readonly number[]).includes(day));
}

/** Today's hours and whether the doors are open right now (Miami time is assumed to be the visitor's). */
export function todayStatus(now = new Date()): { label: string; open: boolean; line: string } {
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  // Before 6 AM we may still be inside yesterday's late close.
  const y = spanFor((day + 6) % 7);
  if (y && mins < 6 * 60 && toMin(y.close) > 24 * 60 && mins + 24 * 60 < toMin(y.close)) {
    return { label: "Open now", open: true, line: `Open until ${fmtHour(y.close)}` };
  }
  const t = spanFor(day);
  if (!t) return { label: "Closed today", open: false, line: "Closed today" };
  if (mins >= toMin(t.open) && mins < toMin(t.close)) return { label: "Open now", open: true, line: `Open until ${fmtHour(t.close)}` };
  if (mins < toMin(t.open)) return { label: `Opens ${fmtHour(t.open)}`, open: false, line: `Opens today at ${fmtHour(t.open)}` };
  return { label: "Closed", open: false, line: `Closed · ${t.label} ${fmtHour(t.open)} – ${fmtHour(t.close)}` };
}

/** The next calendar date (YYYY-MM-DD) that falls on one of the given weekdays, today included if the time is still ahead. */
export function nextDateFor(days: readonly number[], time: string, now = new Date()): string {
  for (let i = 0; i < 8; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    if (!days.includes(d.getDay())) continue;
    if (i === 0 && now.getHours() * 60 + now.getMinutes() > toMin(time) - 60) continue;
    return toDateInputValue(d);
  }
  return toDateInputValue(now);
}
