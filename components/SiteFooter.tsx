import { siteContent, resolveHref } from "@/data/site-content";
import BrandMark from "./BrandMark";
import FooterMedia from "./FooterMedia";

/** Night-time close: the dancing crowd photograph with the wordmark over it. */
export default function SiteFooter() {
  const { footer, hero, reservationUrl } = siteContent;

  return (
    <footer className="relative z-10 min-h-[78svh] w-full overflow-hidden text-white" aria-label="Footer">
      <FooterMedia image={footer.image} alt={footer.alt} video={footer.video} />

      <p
        aria-hidden
        className="script absolute left-[5vw] top-[8svh] hidden rotate-[-8deg] text-[34px] leading-[0.95] drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] md:block"
      >
        {footer.note.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
        <span className="text-[24px]">♡</span>
      </p>

      <div className="relative flex min-h-[78svh] flex-col items-center justify-end px-6 pb-[8svh] pt-[24svh] text-center">
        <a
          href={reservationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
          aria-label={`KIKI on the Miami River, ${hero.reserveLabel}`}
        >
          <BrandMark color="white" className="h-[56px] md:h-[84px]" />
        </a>
        <p className="mt-4 font-sans text-[10px] font-medium uppercase tracking-[0.5em] drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)] md:text-[11px]">
          {siteContent.brand.subtitle}
        </p>

        <nav aria-label="Footer" className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {footer.links.map((l) => (
            <a
              key={l.label}
              href={resolveHref(l.href)}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline font-sans text-[10px] uppercase tracking-[0.32em] drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]"
            >
              {l.label}
            </a>
          ))}
          <a
            href={footer.instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline font-sans text-[10px] uppercase tracking-[0.32em] drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]"
          >
            {footer.instagram.label}
          </a>
        </nav>

        <address className="mt-8 font-sans text-[10px] not-italic tracking-[0.22em] text-white/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]">
          {footer.address}
        </address>
      </div>
    </footer>
  );
}
