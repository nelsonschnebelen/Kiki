import Image from "next/image";
import { siteContent } from "@/data/site-content";
import ReserveButton from "./ReserveButton";
import VideoLettermark from "./VideoLettermark";

/**
 * Static composition shown when the visitor prefers reduced motion:
 * the hero photograph with the wordmark and Reserve, followed by the
 * poster-filled KIKI letters. No pinning, no scrubbing, no video.
 */
export default function ReducedMotionFallback() {
  const { hero, letters, reservationUrl, brand } = siteContent;

  return (
    <section aria-label={`${brand.name} ${brand.subtitle}`}>
      <div className="relative h-[100svh] w-full overflow-hidden">
        <Image src={hero.image} alt={hero.alt} fill priority quality={85} sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-6">
          <div className="w-[58vw] md:w-[18vw]">
            <VideoLettermark letters={letters} mode="solid" />
          </div>
          <ReserveButton href={reservationUrl} label={hero.reserveLabel} variant="onImage" size="lg" />
        </div>
      </div>

      <div className="w-full overflow-hidden bg-stone pt-[8svh] pb-[46svh] md:pb-[42svh]">
        <div className="mx-auto w-[118vw] md:w-[108vw]">
          <VideoLettermark letters={letters} mode="posters" />
        </div>
      </div>
    </section>
  );
}
