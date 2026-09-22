import type { Metadata } from "next";
import KikiReservations from "@/components/reservations/KikiReservations";

/* Option B: Dishio's own reservation system, brighter. Shared by URL only. */
export const metadata: Metadata = { title: "Reserve a table · KIKI On the River", robots: { index: false, follow: false } };

export default function ReservationsLitePage() {
  return <KikiReservations variant="lite" />;
}
