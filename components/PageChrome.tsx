import type { ReactNode } from "react";
import Header from "./Header";
import SiteFooter from "./SiteFooter";
import ReservationDrawer from "./ReservationDrawer";
import MobileReserveBar from "./MobileReserveBar";

/**
 * Header, footer, the reservation drawer and the mobile bar that the inner
 * pages share. Petals live in the hero only, so the reading is calm.
 */
export default function PageChrome({ children, current }: { children: ReactNode; current: string }) {
  return (
    <>
      <Header mode="page" current={current} />
      <main id="main" className="relative z-10">
        {children}
      </main>
      <SiteFooter />
      <MobileReserveBar after={0.8} />
      <ReservationDrawer />
    </>
  );
}
