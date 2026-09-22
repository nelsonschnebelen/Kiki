import type { Metadata } from "next";
import PageChrome from "@/components/PageChrome";
import PageHero from "@/components/PageHero";
import ParallaxBand from "@/components/ParallaxBand";
import Chapter from "@/components/Chapter";
import Meander from "@/components/Meander";
import Reveal from "@/components/Reveal";
import ReserveButton from "@/components/ReserveButton";
import { vipPage as p } from "@/data/pages";
import { siteContent } from "@/data/site-content";

export const metadata: Metadata = { title: "VIP · KIKI On the River" };

export default function VipPage() {
  return (
    <PageChrome current="/vip">
      <PageHero {...p.hero} height="full">
        <ReserveButton href={siteContent.reservationUrl} label={p.cta.label} variant="onImage" size="lg" withArrow />
      </PageHero>

      <Reveal className="mx-auto max-w-[820px] px-6 pb-[3svh] pt-[10svh] text-center">
        <p className="font-display text-[19px] uppercase leading-[1.75] tracking-[0.16em] text-cobalt md:text-[22px]">{p.intro}</p>
      </Reveal>

      <Chapter kicker="Bottle service" title="Champagne, sparklers, the works" body="Regular, Wednesday and event pricing on the bottle list. Tell us the occasion and we will have it on ice when you arrive." image="/images/letters/k2.jpg" alt="A champagne celebration with sparklers" focus="50% 30%" />

      <section className="mx-auto max-w-[1400px] px-6 py-[6svh] md:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {p.nights.map((n, i) => (
            <Reveal key={n.day} delay={i * 0.1} className="border-t border-cobalt/20 pt-7">
              <p className="font-sans text-[10px] font-medium uppercase tracking-[0.42em] text-bougainvillea">{n.day}</p>
              <h3 className="mt-4 font-display text-[28px] uppercase leading-[1.1] tracking-[0.1em] text-cobalt">{n.title}</h3>
              <p className="mt-5 font-sans text-[14px] leading-[1.8] text-cobalt-deep/78">{n.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <ParallaxBand image="/images/letters/i2.jpg" alt="Dancing at KIKI after dark" note={["Same Table", "Different Magic"]} height="70svh" dim focus="50% 30%">
        <Reveal className="max-w-[640px] text-white">
          <p className="font-sans text-[10px] uppercase tracking-[0.5em] text-white/75">{p.perks.title}</p>
          <ul className="mt-6 space-y-3">
            {p.perks.items.map((it) => (
              <li key={it} className="flex items-start gap-4 font-display text-[16px] uppercase leading-[1.5] tracking-[0.14em] md:text-[19px]">
                <span className="mt-[9px] h-px w-6 shrink-0 bg-gold" aria-hidden />
                {it}
              </li>
            ))}
          </ul>
        </Reveal>
      </ParallaxBand>

      <section className="py-[12svh] text-center">
        <Reveal className="mx-auto max-w-[720px] px-6">
          <Meander className="mx-auto mb-8 opacity-70" units={7} />
          <h2 className="font-display text-[34px] uppercase leading-[1.1] tracking-[0.16em] text-cobalt md:text-[48px]">Your night starts here</h2>
          <p className="mx-auto mt-6 max-w-[48ch] font-sans text-[13px] leading-[1.8] text-cobalt-deep/75">{p.cta.note}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ReserveButton href={siteContent.reservationUrl} label={p.cta.label} variant="primary" size="lg" withArrow />
            <ReserveButton href={siteContent.privateEventsUrl} label="Bottle packages & groups" variant="ghost" size="lg" withArrow />
          </div>
        </Reveal>
      </section>
    </PageChrome>
  );
}
