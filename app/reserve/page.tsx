import type { Metadata } from "next";
import PageChrome from "@/components/PageChrome";
import PageHero from "@/components/PageHero";
import QuickPicks from "@/components/QuickPicks";
import ReserveInline from "@/components/ReserveInline";
import Meander from "@/components/Meander";
import Reveal from "@/components/Reveal";
import ReserveButton from "@/components/ReserveButton";
import SplitReveal from "@/components/SplitReveal";
import { siteContent } from "@/data/site-content";
import { fmtHour } from "@/lib/hours";

export const metadata: Metadata = { title: "Reservations · KIKI On the River" };

/**
 * Reservations as a first-class page: the SevenRooms flow inline, the nights
 * people book most as one-tap picks, and everything a guest needs to decide
 * (hours, phone, directions) without leaving.
 */
export default function ReservePage() {
  const { contact, booking } = siteContent;
  return (
    <PageChrome current="/reserve">
      <PageHero image="/images/long-table.jpg" alt="A long white table set beside the Miami River under bougainvillea" title="Reserve" eyebrow="Your table on the river" subtitle="Lunch in the sun · Dinner into dancing" note={["Meet Me", "At KIKI"]} focus="60% 50%" />

      <section className="mx-auto max-w-[1500px] px-6 pt-[8svh] md:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:gap-14">
          {/* Booking, inline. */}
          <Reveal>
            <p className="font-sans text-[10px] font-medium uppercase tracking-[0.5em] text-cobalt-deep/65">Book a table</p>
            <SplitReveal className="font-display display-sturdy-lg mt-3 text-[30px] uppercase leading-[1.12] tracking-[0.12em] text-cobalt md:text-[40px]">Pick your date and time</SplitReveal>
            <p className="mt-4 max-w-[52ch] font-sans text-[14px] leading-[1.8] text-cobalt-deep/75">{booking.drawer.subtitle}. Parties of {booking.maxPartySize + 1} or more, and full buyouts, go to our events team.</p>
            <div className="mt-8">
              <ReserveInline />
            </div>
          </Reveal>

          {/* The practical column. */}
          <aside className="space-y-8">
            <Reveal className="glass rounded-[6px] p-7">
              <p className="font-sans text-[10px] font-medium uppercase tracking-[0.5em] text-cobalt-deep/65">Hours</p>
              <dl className="mt-5 space-y-3">
                {contact.hours.map((h) => (
                  <div key={h.label} className="flex items-baseline justify-between gap-6 border-b border-cobalt/10 pb-3">
                    <dt className="font-display display-sturdy text-[13px] uppercase leading-snug text-cobalt">{h.label}</dt>
                    <dd className="shrink-0 whitespace-nowrap text-right font-sans text-[13px] text-cobalt-deep/80">
                      {fmtHour(h.open)} – {fmtHour(h.close)}
                      {"note" in h && h.note ? <span className="block text-[11px] text-bougainvillea">{h.note}</span> : null}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 font-sans text-[12px] text-cobalt-deep/70">
                <span className="text-bougainvillea">Happy Hour</span> · {contact.happyHour}
              </p>
            </Reveal>

            <Reveal delay={0.08} className="glass rounded-[6px] p-7">
              <p className="font-sans text-[10px] font-medium uppercase tracking-[0.5em] text-cobalt-deep/65">Find us</p>
              <address className="mt-4 font-display display-sturdy text-[15px] uppercase not-italic leading-[1.6] text-cobalt">{contact.address}</address>
              <div className="mt-5 flex flex-wrap gap-x-7 gap-y-3">
                <a href={contact.phoneHref} className="link-underline font-sans text-[10.5px] font-medium uppercase tracking-[0.3em] text-cobalt">
                  Call {contact.phone}
                </a>
                <a href={contact.directionsUrl} target="_blank" rel="noopener noreferrer" className="link-underline font-sans text-[10.5px] font-medium uppercase tracking-[0.3em] text-cobalt">
                  Directions
                </a>
                <a href={`mailto:${contact.email}`} className="link-underline font-sans text-[10.5px] font-medium uppercase tracking-[0.3em] text-cobalt">
                  Email
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.16} className="rounded-[6px] bg-cobalt p-7 text-white">
              <p className="font-sans text-[10px] font-medium uppercase tracking-[0.5em] text-white/70">Groups & celebrations</p>
              <p className="mt-3 font-display display-sturdy text-[17px] uppercase leading-[1.4]">Eleven or more? Birthdays, bottle service, buyouts?</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <ReserveButton href={siteContent.privateEventsUrl} label="Plan an event" variant="onImage" size="md" withArrow className="!border-white !bg-white !text-cobalt hover:!bg-transparent hover:!text-white" />
                <ReserveButton href="/vip" label="VIP tables" variant="ghost" size="md" withArrow className="!border-white/60 !text-white hover:!border-white hover:!bg-white hover:!text-cobalt" external={false} />
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      <div className="mx-auto max-w-[1500px] px-6 pb-[6svh] pt-[10svh] md:px-10">
        <Reveal className="mb-8 text-center">
          <Meander className="mx-auto mb-6 opacity-70" units={5} />
          <p className="script text-[26px] leading-none text-bougainvillea">Or pick a night</p>
          <h2 className="font-display display-sturdy-lg mt-3 text-[28px] uppercase leading-[1.12] tracking-[0.14em] text-cobalt md:text-[38px]">The nights everyone books</h2>
        </Reveal>
        <QuickPicks compact />
      </div>
    </PageChrome>
  );
}
