/**
 * Reservation plumbing shared by the booking bar, every Reserve button and the drawer.
 *
 * Every reservation goes through the Dishio flow (components/reservations):
 * in the drawer when opened from a button, or on /reserve as a full page.
 * Links carry the same pre-fill parameters either way:
 *   /reserve?date=YYYY-MM-DD&party_size=N&start_time=HH:MM
 */
import { siteContent } from "@/data/site-content";

export interface ReservationRequest {
  /** YYYY-MM-DD. Omit to let SevenRooms default to today. */
  date?: string;
  partySize?: number;
  /** 24h HH:MM. Omit for "all times". */
  time?: string;
}

export const RESERVATION_EVENT = "kiki:reserve";

/** Builds the /reserve URL for a request (the no-JS and "open full page" path). */
export function buildBookingUrl(req: ReservationRequest = {}): string {
  const p = new URLSearchParams();
  if (req.date) p.set("date", req.date);
  if (req.partySize) p.set("party_size", String(req.partySize));
  if (req.time) p.set("start_time", req.time);
  const q = p.toString();
  return siteContent.booking.url + (q ? "?" + q : "");
}

/** Reads a request back out of a /reserve URL's query string. */
export function parseBookingRequest(search: string): ReservationRequest {
  const p = new URLSearchParams(search);
  const req: ReservationRequest = {};
  const date = p.get("date") ?? "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) req.date = date;
  const n = Number(p.get("party_size"));
  if (n >= 1 && n <= 20) req.partySize = n;
  const time = p.get("start_time") ?? "";
  if (/^\d{2}:\d{2}$/.test(time)) req.time = time;
  return req;
}

/** Opens the reservation drawer. Safe to call from anywhere on the client. */
export function openReservation(req: ReservationRequest = {}) {
  window.dispatchEvent(new CustomEvent<ReservationRequest>(RESERVATION_EVENT, { detail: req }));
}

/** True when a link points at the reservation flow, so its click should open the drawer instead. */
export function isReservationHref(href: string): boolean {
  return href === siteContent.reservationUrl || href.startsWith(siteContent.reservationUrl + "?");
}

/** Local-time YYYY-MM-DD (toISOString would shift the day for evening visitors). */
export function toDateInputValue(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** "20:30" -> "8:30 PM" */
export function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

/** "2026-09-30" -> "Wed, Sep 30" */
export function formatDate(value: string): string {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
