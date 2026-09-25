import Link from "next/link";
import { siteContent, resolveHref } from "@/data/site-content";
import { fmtHour } from "@/lib/hours";
import BrandMark from "./BrandMark";
import FooterMedia from "./FooterMedia";
import ReserveLink from "./ReserveLink";

/**
 * Night-time close: the dancing crowd film with the wordmark over it, then
 * everything a guest needs in one glance: hours, phone, email, directions.
 */
export default function SiteFooter() {
  const { footer, hero, reservationUrl, contact } = siteContent;
  const link = "link-underline font-sans text-[10px] uppercase tracking-[0.32em] drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]";

  return (
    <footer className="relative z-10 min-h-[86svh] w-full overflow-hidden text-white" aria-label="Footer">
      <FooterMedia image={footer.image} alt={footer.alt} video={footer.video} />
      {/* Legibility veil for the wordmark and links; the top of the film stays untouched. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[72%] bg-gradient-to-t from-black/80 via-black/40 to-transparent" aria-hidden />

      <p aria-hidden className="script absolute left-[5vw] top-[8svh] hidden rotate-[-8deg] text-[34px] leading-[0.95] drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] md:block">
        {footer.note.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
        <span className="text-[24px]">♡</span>
      </p>

      <div className="relative flex min-h-[86svh] flex-col items-center justify-end px-6 pb-[6svh] pt-[24svh] text-center">
        <ReserveLink
          href={reservationUrl}
          className="drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
          aria-label={`KIKI on the River, ${hero.reserveLabel}`}
        >
          <BrandMark color="white" className="h-[56px] md:h-[84px]" />
        </ReserveLink>
        <p className="mt-4 font-sans text-[10px] font-medium uppercase tracking-[0.5em] drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)] md:text-[11px]">{siteContent.brand.subtitle}</p>

        <nav aria-label="Footer" className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {footer.links.map((l) => (
            <ReserveLink key={l.label} href={resolveHref(l.href)} className={link}>
              {l.label}
            </ReserveLink>
          ))}
          {siteContent.navigation
            .filter((n) => n.href !== "/reserve")
            .map((n) => (
              <Link key={n.href} href={n.href} className={link}>
                {n.label}
              </Link>
            ))}
          <a href={contact.instagram.href} target="_blank" rel="noopener noreferrer" className={link}>
            {contact.instagram.label}
          </a>
        </nav>

        {/* Hours, phone, email, directions: the practical line. */}
        <div className="mt-10 grid w-full max-w-[1100px] grid-cols-1 gap-6 border-t border-white/20 pt-8 text-left sm:grid-cols-3">
          <div>
            <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.4em] text-white/60">Hours</p>
            <ul className="mt-3 space-y-1 font-sans text-[11.5px] leading-[1.7] text-white/90">
              {contact.hours.map((h) => (
                <li key={h.label} className="flex justify-between gap-4">
                  <span>{h.label}</span>
                  <span className="whitespace-nowrap text-white/75">
                    {fmtHour(h.open)} – {fmtHour(h.close)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.4em] text-white/60">Reservations</p>
            <p className="mt-3 font-sans text-[11.5px] leading-[1.7] text-white/90">
              <a href={contact.phoneHref} className="link-underline">
                {contact.phone}
              </a>
              <br />
              <a href={`mailto:${contact.email}`} className="link-underline">
                {contact.email}
              </a>
            </p>
            <p className="mt-3 font-sans text-[11px] leading-[1.6] text-white/70">Happy Hour · {contact.happyHour}</p>
          </div>
          <div>
            <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.4em] text-white/60">Find us</p>
            <address className="mt-3 font-sans text-[11.5px] not-italic leading-[1.7] text-white/90">{contact.address}</address>
            <a href={contact.directionsUrl} target="_blank" rel="noopener noreferrer" className="link-underline mt-2 inline-block font-sans text-[10px] uppercase tracking-[0.3em] text-white">
              Directions
            </a>
          </div>
        </div>

        <p className="mt-8 font-sans text-[9px] uppercase tracking-[0.3em] text-white/45">© {new Date().getFullYear()} KIKI on the River · Miami</p>
      </div>
    </footer>
  );
}
