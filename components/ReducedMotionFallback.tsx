import Image from "next/image";
import { siteContent } from "@/data/site-content";
import VideoLettermark from "./VideoLettermark";

/**
 * Static composition shown when the visitor prefers reduced motion:
 * the hero photograph with the floral wordmark and tagline, followed by the
 * poster-filled KIKI letters. No pinning, no scrubbing, no video.
 */
export default function ReducedMotionFallback() {
  const { hero, letters, brand } = siteContent;

  return (
    <section aria-label={`${brand.name} ${brand.subtitle}`}>
      <div className="relative h-[100svh] w-full overflow-hidden">
        <Image src={hero.image} alt={hero.alt} fill priority quality={85} sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[9vw] px-6 pt-[8svh] md:gap-[5vw]">
          <div className="w-[70vw] md:w-[40vw] lg:w-[36vw]">
            <VideoLettermark letters={letters} mode="solid" />
          </div>
          <p className="font-display text-[14px] uppercase tracking-[0.34em] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] md:text-[18px]">
            {brand.tagline}
          </p>
        </div>
      </div>

      <div className="w-full overflow-hidden bg-stone pt-[8svh] pb-[48svh] md:pb-[36svh]">
        <div className="mx-auto w-[98vw]">
          <VideoLettermark letters={letters} mode="posters" fill={siteContent.letterFill} />
        </div>
      </div>
    </section>
  );
}
