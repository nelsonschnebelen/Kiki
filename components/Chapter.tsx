import Image from "next/image";
import Meander from "./Meander";
import Reveal from "./Reveal";

interface ChapterProps {
  kicker: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  focus?: string;
  /** Photo on the right (default) or left. */
  flip?: boolean;
}

/** Editorial chapter: a tall photograph and a short passage, alternating sides. */
export default function Chapter({ kicker, title, body, image, alt, focus = "50% 50%", flip = false }: ChapterProps) {
  return (
    <section className="mx-auto grid max-w-[1500px] grid-cols-1 items-center gap-10 px-6 py-[7svh] md:grid-cols-2 md:gap-16 md:px-10">
      <Reveal className={`relative aspect-[4/5] w-full overflow-hidden rounded-[2px] ${flip ? "md:order-2" : ""}`}>
        <Image src={image} alt={alt} fill sizes="(max-width: 767px) 100vw, 50vw" quality={85} className="object-cover" style={{ objectPosition: focus }} />
      </Reveal>
      <Reveal className={`${flip ? "md:order-1 md:pr-[4vw]" : "md:pl-[4vw]"}`} delay={0.12}>
        <p className="font-sans text-[10px] font-medium uppercase tracking-[0.5em] text-cobalt-deep/65">{kicker}</p>
        <h2 className="mt-5 font-display text-[34px] uppercase leading-[1.08] tracking-[0.1em] text-cobalt md:text-[46px]">{title}</h2>
        <Meander className="mt-7 opacity-70" units={4} />
        <p className="mt-7 max-w-[46ch] font-sans text-[15px] leading-[1.85] text-cobalt-deep/80">{body}</p>
      </Reveal>
    </section>
  );
}
