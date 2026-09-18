import Image from "next/image";
import { siteContent } from "@/data/site-content";
import Reveal from "./Reveal";

/**
 * "Meet me at KIKI", laid out as in the mock: the rose heart bleeding off the
 * left edge and rising into the wheel section, the long table running across
 * the centre, and the headline over the champagne on the right. Edge to edge,
 * no card gutters.
 */
export default function MeetMeSection() {
  const { meet } = siteContent;

  return (
    <section id="meet" className="relative z-10 bg-stone" aria-labelledby="meet-heading">
      <div className="grid grid-cols-1 md:grid-cols-[30%_44%_26%] md:grid-rows-[auto_1fr]">
        {/* Heart: rises into the section above on desktop. */}
        <Reveal className="relative md:row-span-2 md:-mt-[16svh]">
          <div className="relative aspect-square w-full overflow-hidden md:aspect-auto md:h-full md:min-h-[62svh]">
            <Image src={meet.heart.src} alt={meet.heart.alt} fill sizes="(max-width: 767px) 100vw, 30vw" className="object-cover object-[36%_50%]" />
          </div>
        </Reveal>

        {/* Headline block, top right. */}
        <Reveal className="order-first flex flex-col justify-center px-6 py-10 md:order-none md:col-start-3 md:px-8 md:pt-[6svh] md:pb-8" delay={0.1}>
          <h2 id="meet-heading" className="font-display text-[22px] leading-tight tracking-[0.16em] text-cobalt uppercase md:text-[24px] xl:text-[27px]">
            {meet.eyebrow}
          </h2>
          <span className="mt-4 block h-px w-10 bg-gold" aria-hidden />
          <p className="mt-5 font-sans text-[10.5px] uppercase leading-[2] tracking-[0.3em] text-cobalt-deep/80">
            {meet.lines[0]}
            <br />
            {meet.lines[1]}
          </p>
        </Reveal>

        {/* Long table: across the centre, full height. */}
        <Reveal className="relative md:col-start-2 md:row-span-2 md:row-start-1" delay={0.05}>
          <div className="relative aspect-[4/3] w-full overflow-hidden md:aspect-auto md:h-full md:min-h-[62svh]">
            <Image src={meet.table.src} alt={meet.table.alt} fill sizes="(max-width: 767px) 100vw, 44vw" className="object-cover object-[60%_50%]" />
          </div>
        </Reveal>

        {/* Champagne, bottom right. */}
        <Reveal className="relative md:col-start-3 md:row-start-2" delay={0.15}>
          <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-auto md:h-full md:min-h-[36svh]">
            <Image src={meet.champagne.src} alt={meet.champagne.alt} fill sizes="(max-width: 767px) 100vw, 26vw" className="object-cover" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
