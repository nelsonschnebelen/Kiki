import type { CSSProperties } from "react";
import Header from "@/components/Header";
import KikiScrollSequence from "@/components/KikiScrollSequence";
import ExperienceWheel from "@/components/ExperienceWheel";
import MeetMeSection from "@/components/MeetMeSection";
import SiteFooter from "@/components/SiteFooter";
import ReservationDrawer from "@/components/ReservationDrawer";
import QuickPicks from "@/components/QuickPicks";
import InstagramStrip from "@/components/InstagramStrip";
import MobileReserveBar from "@/components/MobileReserveBar";
import { BRAND_GEOMETRY } from "@/lib/brand-geometry";

/* Wordmark proportions drive the sequence layout and where the next section starts. */
const wordmarkVars = { "--wm-aspect": BRAND_GEOMETRY.letterAspect } as CSSProperties;

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main" style={wordmarkVars}>
        <KikiScrollSequence />
        <ExperienceWheel />
        <MeetMeSection />
        <QuickPicks />
        <InstagramStrip />
      </main>
      <SiteFooter />
      <MobileReserveBar after={3.2} />
      <ReservationDrawer />
    </>
  );
}
