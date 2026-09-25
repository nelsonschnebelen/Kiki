import Image from "next/image";
import { siteContent } from "@/data/site-content";
import Reveal from "./Reveal";

const TILES = [
  { src: "/images/wheel-night.jpg", focus: "50% 50%" },
  { src: "/images/champagne.jpg", focus: "50% 40%" },
  { src: "/images/letters/i2.jpg", focus: "50% 30%" },
  { src: "/images/heart.jpg", focus: "40% 50%" },
  { src: "/images/marina.jpg", focus: "50% 40%" },
  { src: "/images/letters/k2.jpg", focus: "50% 30%" },
];

/** Six frames from the river, each a door to the Instagram account. */
export default function InstagramStrip() {
  const { instagram } = siteContent.contact;
  return (
    <section className="relative bg-stone-deep/60 py-[8svh]" aria-label="KIKI on Instagram">
      <Reveal className="mx-auto mb-7 flex max-w-[1500px] items-end justify-between px-6 md:px-10">
        <div>
          <p className="script text-[24px] leading-none text-bougainvillea">Follow the night</p>
          <h2 className="font-display display-sturdy-lg mt-2 text-[22px] uppercase tracking-[0.14em] text-cobalt md:text-[28px]">{instagram.label}</h2>
        </div>
        <a href={instagram.href} target="_blank" rel="noopener noreferrer" className="link-underline font-sans text-[10px] font-medium uppercase tracking-[0.32em] text-cobalt">
          Follow on Instagram
        </a>
      </Reveal>
      <ul className="mx-auto grid max-w-[1500px] grid-cols-3 gap-1.5 px-6 md:grid-cols-6 md:gap-2 md:px-10">
        {TILES.map((t, i) => (
          <li key={t.src}>
            <Reveal delay={i * 0.05}>
              <a href={instagram.href} target="_blank" rel="noopener noreferrer" className="group relative block aspect-square overflow-hidden rounded-[3px]" aria-label={`${instagram.label} on Instagram`}>
                <Image src={t.src} alt="" fill sizes="(max-width: 767px) 33vw, 16vw" quality={75} className="object-cover transition-transform duration-[1200ms] ease-editorial group-hover:scale-[1.06]" style={{ objectPosition: t.focus }} />
                <span className="absolute inset-0 bg-cobalt/0 transition-colors duration-500 group-hover:bg-cobalt/25" aria-hidden />
              </a>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
