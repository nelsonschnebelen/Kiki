"use client";

import { useEffect, useState } from "react";
import { parseBookingRequest, type ReservationRequest } from "@/lib/booking";
import Header from "./Header";
import SiteFooter from "./SiteFooter";
import ReservationDrawer from "./ReservationDrawer";
import KikiReservations from "./reservations/KikiReservations";

/**
 * /reserve: the Dishio flow as the site's reservations page. The site header
 * floats over the Dishio landing and goes solid once the steps begin; the
 * URL's date / party_size / start_time pre-fill the landing card.
 */
export default function ReserveDishio() {
  const [step, setStep] = useState(0);
  const [prefill, setPrefill] = useState<ReservationRequest | null>(null);

  useEffect(() => {
    setPrefill(parseBookingRequest(window.location.search));
  }, []);

  return (
    <>
      <Header mode="page" current="/reserve" forceSolid={step > 0} />
      <main id="main" className="relative z-10">
        {prefill && <KikiReservations mode="embedded" prefill={prefill} onStepChange={setStep} />}
      </main>
      <SiteFooter />
      <ReservationDrawer />
    </>
  );
}
