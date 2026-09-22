import type { Metadata } from "next";
import PageChrome from "@/components/PageChrome";
import PageHero from "@/components/PageHero";
import ParallaxBand from "@/components/ParallaxBand";
import Chapter from "@/components/Chapter";
import Meander from "@/components/Meander";
import Reveal from "@/components/Reveal";
import SplitReveal from "@/components/SplitReveal";
import ReserveButton from "@/components/ReserveButton";
import { happeningsPage as p } from "@/data/pages";
import { siteContent } from "@/data/site-content";

export const metadata: Metadata = { title: "Happenings · KIKI On the River" };

export default function HappeningsPage() {
  return (
    <PageChrome current="/happenings">
      <PageHero {...p.hero} />

      <Reveal className="mx-auto max-w-[820px] px-6 pb-[4svh] pt-[10svh] text-center">
        <p className="font-display text-[19px] uppercase leading-[1.75] tracking-[0.16em] text-cobalt md:text-[22px]">{p.intro}</p>
      </Reveal>

      <section className="mx-auto max-w-[1400px] px-6 py-[9svh] md:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {p.happenings.items.map((h, i) => (
            <Reveal key={h.title} delay={i * 0.1} className="border-t border-cobalt/20 pt-7">
              <p className="font-sans text-[10px] font-medium uppercase tracking-[0.42em] text-cobalt-deep/65">{h.day}</p>
              <SplitReveal as="h3" unit="lines" className="mt-4 font-display text-[28px] uppercase leading-[1.15] tracking-[0.1em] text-cobalt">{h.title}</SplitReveal>
              <p className="mt-2 font-sans text-[11px] uppercase tracking-[0.3em] text-bougainvillea">{h.time}</p>
              <p className="mt-5 font-sans text-[14px] leading-[1.8] text-cobalt-deep/78">{h.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <ParallaxBand image={p.chapters[2].image} alt={p.chapters[2].alt} note={p.chapters[2].note} height="66svh" dim>
        <div className="text-white">
          <p className="font-sans text-[10px] uppercase tracking-[0.5em] text-white/75">{p.happenings.title}</p>
          <SplitReveal className="mt-4 font-display text-[40px] uppercase leading-[1.12] tracking-[0.12em] md:text-[64px]">
            Day turns
            <br />
            into night
          </SplitReveal>
        </div>
      </ParallaxBand>

      {p.chapters.map((c, i) => (
        <Chapter key={c.id} {...c} flip={i % 2 === 1} />
      ))}

      <ParallaxBand image={p.atSea.image} alt={p.atSea.alt} height="78svh" dim focus="50% 40%">
        <Reveal className="max-w-[640px] text-white">
          <p className="font-sans text-[10px] uppercase tracking-[0.5em] text-white/75">{p.atSea.kicker}</p>
          <SplitReveal className="mt-4 font-display text-[38px] uppercase leading-[1.12] tracking-[0.1em] md:text-[56px]">{p.atSea.title}</SplitReveal>
          <p className="mt-6 max-w-[52ch] font-sans text-[14px] leading-[1.8] text-white/88 md:text-[15px]">{p.atSea.body}</p>
          <div className="mt-8">
            <ReserveButton href={siteContent.privateEventsUrl} label={p.atSea.cta} variant="onImage" size="lg" withArrow className="!border-white !bg-white !text-cobalt hover:!bg-transparent hover:!text-white" />
          </div>
        </Reveal>
      </ParallaxBand>

      <section className="py-[12svh] text-center">
        <Reveal className="mx-auto max-w-[720px] px-6">
          <Meander className="mx-auto mb-8 opacity-70" units={7} />
          <SplitReveal className="font-display text-[34px] uppercase leading-[1.15] tracking-[0.16em] text-cobalt md:text-[48px]">Your table. Your night.</SplitReveal>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ReserveButton href={siteContent.reservationUrl} label="VIP reservations" variant="primary" size="lg" withArrow />
            <ReserveButton href={siteContent.privateEventsUrl} label="Plan a private event" variant="ghost" size="lg" withArrow />
          </div>
        </Reveal>
      </section>
    </PageChrome>
  );
}
