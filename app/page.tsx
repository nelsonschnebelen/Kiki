import Header from "@/components/Header";
import KikiScrollSequence from "@/components/KikiScrollSequence";
import ExperienceWheel from "@/components/ExperienceWheel";
import MeetMeSection from "@/components/MeetMeSection";
import SiteFooter from "@/components/SiteFooter";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main">
        <KikiScrollSequence />
        <ExperienceWheel />
        <MeetMeSection />
      </main>
      <SiteFooter />
    </>
  );
}
