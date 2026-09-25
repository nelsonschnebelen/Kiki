import type { Metadata } from "next";
import ReserveDishio from "@/components/ReserveDishio";

export const metadata: Metadata = { title: "Reservations · KIKI On the River" };

/** Reservations: the Dishio flow, under the site's header and footer. Every Reserve button on the site lands here or in the drawer. */
export default function ReservePage() {
  return <ReserveDishio />;
}
