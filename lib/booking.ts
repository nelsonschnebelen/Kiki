/**
 * Reservation plumbing shared by the booking bar, every Reserve button and the drawer.
 *
 * SevenRooms pre-fill parameters were verified against KIKI's live booking page:
 *   ?date=YYYY-MM-DD&party_size=N&start_time=HH:MM
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

/** Builds the SevenRooms booking URL for a request. */
export function buildBookingUrl(req: ReservationRequest = {}): string {
  const url = new URL(siteContent.booking.url);
  if (req.date) url.searchParams.set("date", req.date);
  if (req.partySize) url.searchParams.set("party_size", String(req.partySize));
  if (req.time) url.searchParams.set("start_time", req.time);
  return url.toString();
}

/** Opens the reservation drawer. Safe to call from anywhere on the client. */
export function openReservation(req: ReservationRequest = {}) {
  window.dispatchEvent(new CustomEvent<ReservationRequest>(RESERVATION_EVENT, { detail: req }));
}

/** True when a link points at the reservation flow, so its click should open the drawer instead. */
export function isReservationHref(href: string): boolean {
  return href === siteContent.reservationUrl;
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
