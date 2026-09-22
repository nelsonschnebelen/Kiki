import type { Metadata } from "next";
import PageChrome from "@/components/PageChrome";
import PageHero from "@/components/PageHero";
import MenuBook from "@/components/MenuBook";
import ReserveButton from "@/components/ReserveButton";
import Reveal from "@/components/Reveal";
import SplitReveal from "@/components/SplitReveal";
import { siteContent } from "@/data/site-content";

export const metadata: Metadata = { title: "Menu · KIKI On the River" };

export default function MenuPage() {
  return (
    <PageChrome current="/menu">
      <PageHero
        image="/images/letters/i1.jpg"
        alt="Guests enjoying a Mediterranean lunch beside the Miami River"
        eyebrow="Modern Greek · Miami River"
        title="Menu"
        subtitle="Love at first bite"
        note={["Good Food", "Brighter Days"]}
        focus="50% 40%"
      />

      <Reveal className="mx-auto max-w-[760px] px-6 pb-[2svh] pt-[9svh] text-center">
        <p className="font-display text-[20px] uppercase leading-[1.7] tracking-[0.18em] text-cobalt md:text-[24px]">
          Modern Greek cuisine, served the KIKI way: bright by day, glamorous by night.
        </p>
        <p className="mt-6 font-sans text-[11px] uppercase tracking-[0.34em] text-cobalt-deep/65">Executive Chef Wladimir Arevalo</p>
      </Reveal>

      <MenuBook />

      <section className="relative overflow-hidden bg-cobalt py-[12svh] text-center text-white">
        <Reveal className="mx-auto max-w-[720px] px-6">
          <p className="font-sans text-[10px] uppercase tracking-[0.5em] text-white/70">Your table is waiting</p>
          <SplitReveal className="mt-5 font-display text-[36px] uppercase leading-[1.15] tracking-[0.16em] md:text-[52px]">Eat · Drink · Dance</SplitReveal>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ReserveButton href={siteContent.reservationUrl} label="Reserve a table" variant="onImage" size="lg" withArrow className="!border-white !bg-white !text-cobalt hover:!bg-transparent hover:!text-white" />
            <ReserveButton href={siteContent.privateEventsUrl} label="Plan a private event" variant="ghost" size="lg" withArrow className="!border-white/60 !text-white hover:!border-white hover:!bg-white hover:!text-cobalt" />
          </div>
        </Reveal>
      </section>
    </PageChrome>
  );
}
