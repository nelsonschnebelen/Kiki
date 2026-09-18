import Image from "next/image";
import { siteContent } from "@/data/site-content";
import Reveal from "./Reveal";

/**
 * "Meet me at KIKI": the rose heart, the long table by the river and the
 * champagne, arranged as an editorial collage.
 */
export default function MeetMeSection() {
  const { meet } = siteContent;

  return (
    <section id="meet" className="relative z-10 bg-stone pb-[12svh] pt-[6svh]" aria-labelledby="meet-heading">
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-6 px-5 md:grid-cols-12 md:gap-6 md:px-10">
        <Reveal className="relative md:col-span-3">
          <div className="relative aspect-square w-full overflow-hidden rounded-[2px]">
            <Image src={meet.heart.src} alt={meet.heart.alt} fill sizes="(max-width: 767px) 100vw, 25vw" className="object-cover" />
          </div>
        </Reveal>

        <Reveal className="md:col-span-6" delay={0.1}>
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2px] md:aspect-[16/11]">
            <Image src={meet.table.src} alt={meet.table.alt} fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" />
          </div>
        </Reveal>

        <Reveal className="flex flex-col md:col-span-3" delay={0.2}>
          <h2 id="meet-heading" className="font-display text-[24px] leading-tight tracking-[0.12em] text-cobalt uppercase md:text-[26px]">
            {meet.eyebrow}
          </h2>
          <span className="mt-5 block h-px w-10 bg-gold" aria-hidden />
          <p className="mt-5 font-sans text-[11px] uppercase leading-[1.9] tracking-[0.3em] text-cobalt-deep/80">
            {meet.lines[0]}
            <br />
            {meet.lines[1]}
          </p>
          <div className="relative mt-8 aspect-[4/5] w-full overflow-hidden rounded-[2px]">
            <Image src={meet.champagne.src} alt={meet.champagne.alt} fill sizes="(max-width: 767px) 100vw, 25vw" className="object-cover" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
