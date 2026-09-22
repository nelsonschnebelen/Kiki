import type { Metadata } from "next";
import Image from "next/image";
import PageChrome from "@/components/PageChrome";
import PageHero from "@/components/PageHero";
import ParallaxBand from "@/components/ParallaxBand";
import Meander from "@/components/Meander";
import Reveal from "@/components/Reveal";
import SplitReveal from "@/components/SplitReveal";
import ReserveButton from "@/components/ReserveButton";
import { privateEventsPage as p } from "@/data/pages";
import { siteContent } from "@/data/site-content";

export const metadata: Metadata = { title: "Private Events · KIKI On the River" };

export default function PrivateEventsPage() {
  return (
    <PageChrome current="/private-events">
      <PageHero {...p.hero} />

      <Reveal className="mx-auto max-w-[820px] px-6 pb-[3svh] pt-[10svh] text-center">
        <p className="font-display text-[19px] uppercase leading-[1.75] tracking-[0.16em] text-cobalt md:text-[22px]">{p.intro}</p>
        <p className="mt-8 font-sans text-[10px] uppercase tracking-[0.42em] text-cobalt-deep/65">
          {p.director.role} · <span className="text-cobalt">{p.director.name}</span>
        </p>
      </Reveal>

      <section className="mx-auto max-w-[1500px] px-6 py-[6svh] md:px-10">
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {p.types.map((t, i) => (
            <Reveal key={t.title} delay={(i % 3) * 0.1} className="group">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px]">
                <Image src={t.image} alt="" fill sizes="(max-width: 767px) 100vw, 33vw" quality={82} className="object-cover transition-transform duration-[1400ms] ease-editorial group-hover:scale-[1.04]" style={{ objectPosition: t.focus }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" aria-hidden />
                <p className="script absolute bottom-6 left-6 right-6 text-[26px] leading-[1] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">{t.quote}</p>
              </div>
              <SplitReveal className="mt-6 font-display text-[24px] uppercase leading-[1.15] tracking-[0.12em] text-cobalt">{t.title}</SplitReveal>
              <p className="mt-3 font-sans text-[14px] leading-[1.8] text-cobalt-deep/78">{t.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <ParallaxBand image="/images/wheel-night.jpg" alt="The terrace at night, napkins in the air" note={["Private Moments", "Unforgettable Nights"]} height="64svh" dim>
        <div className="text-white">
          <p className="font-sans text-[10px] uppercase tracking-[0.5em] text-white/75">Signature spaces</p>
          <SplitReveal className="mt-4 font-display text-[40px] uppercase leading-[1.12] tracking-[0.12em] md:text-[60px]">{p.spaces.title}</SplitReveal>
        </div>
      </ParallaxBand>

      <section className="mx-auto max-w-[1400px] px-6 py-[9svh] md:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
          {p.spaces.items.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.08} className="border-t border-cobalt/20 pt-7">
              <SplitReveal as="h3" unit="lines" className="font-display text-[24px] uppercase leading-[1.15] tracking-[0.1em] text-cobalt">{s.name}</SplitReveal>
              <p className="mt-4 font-sans text-[14px] leading-[1.8] text-cobalt-deep/78">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-cobalt py-[12svh] text-center text-white">
        <Reveal className="mx-auto max-w-[720px] px-6">
          <Meander className="mx-auto mb-8 text-white opacity-80" units={7} />
          <SplitReveal className="font-display text-[36px] uppercase leading-[1.15] tracking-[0.16em] md:text-[52px]">Host your next event with us</SplitReveal>
          <p className="mx-auto mt-6 max-w-[48ch] font-sans text-[13px] leading-[1.8] text-white/80">{p.cta.note}</p>
          <div className="mt-10">
            <ReserveButton href={siteContent.privateEventsUrl} label={p.cta.label} variant="onImage" size="lg" withArrow className="!border-white !bg-white !text-cobalt hover:!bg-transparent hover:!text-white" />
          </div>
        </Reveal>
      </section>
    </PageChrome>
  );
}
