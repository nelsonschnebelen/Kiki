import type { ReactNode } from "react";
import Header from "./Header";
import SiteFooter from "./SiteFooter";
import ReservationDrawer from "./ReservationDrawer";
import PetalField from "./PetalField";
import MobileReserveBar from "./MobileReserveBar";

/**
 * Header, footer, the reservation drawer, and the ambient petal layer that
 * the inner pages share. A few petals keep falling behind the content the
 * whole way down, fixed to the viewport.
 */
export default function PageChrome({ children, current }: { children: ReactNode; current: string }) {
  return (
    <>
      <Header mode="page" current={current} />
      <div className="pointer-events-none fixed inset-0 z-0" style={{ viewTransitionName: "petals" }} aria-hidden>
        <PetalField layer="back" max={6} allVisible />
      </div>
      <main id="main" className="relative z-10">
        {children}
      </main>
      <SiteFooter />
      <MobileReserveBar after={0.8} />
      <ReservationDrawer />
    </>
  );
}
