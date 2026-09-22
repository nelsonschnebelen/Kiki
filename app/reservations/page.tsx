import type { Metadata } from "next";
import KikiReservations from "@/components/reservations/KikiReservations";

/* Dishio's reservation flow in KIKI's style. Not linked from the site's navigation: shared by URL. */
export const metadata: Metadata = { title: "Reserve a table · KIKI On the River", robots: { index: false, follow: false } };

export default function ReservationsPage() {
  return <KikiReservations />;
}
