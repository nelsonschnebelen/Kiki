import { useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { DISHIO, PARTY_SIZES, RESTAURANT, SPACES, TIMES } from "./config";
import { Button, Petals, Wordmark, fmtTime } from "./ui";

const rise = { hidden: { opacity: 0, y: 22 }, show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 1, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] as const } }) };

export interface Prefill { date: string; time: string; partySize: number | "11+" }

const nextDays = (n: number) => {
  const out: { iso: string; label: string }[] = [];
  const d = new Date();
  for (let i = 0; i < n; i++) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
    const iso = `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
    out.push({ iso, label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : x.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) });
  }
  return out;
};

/** One of the three selectors on the card: icon, small label, the value, a chevron, with a native select on top for reliability. */
function Picker({ icon, label, value, children, ...rest }: { icon: ReactNode; label: string; value: string; children: ReactNode } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="relative flex min-w-0 items-center gap-3 rounded-[14px] border border-[#1238B8]/22 bg-white px-4 py-3 transition-colors focus-within:border-[#E50064] focus-within:shadow-[0_0_0_4px_rgba(229,0,100,0.12)] hover:border-[#1238B8]">
      <span className="shrink-0 text-[#1238B8]" aria-hidden>{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[9.5px] font-semibold uppercase tracking-[0.3em] text-[#0E2C93]/60">{label}</span>
        <span className="block truncate text-[15px] font-medium text-[#1238B8]">{value}</span>
      </span>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#1238B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 6l4 4 4-4" /></svg>
      <select className="absolute inset-0 h-full w-full cursor-pointer opacity-0" aria-label={label} {...rest}>
        {children}
      </select>
    </label>
  );
}

/**
 * Dishio's reservation landing in KIKI's language: the terrace by day, the
 * wordmark over the water, one white card with date, time and guests, the
 * pink call to action, and the spaces you can book. Petals fall throughout.
 */
export default function Landing({ onReserve, onSpace }: { onReserve: (p: Prefill) => void; onSpace: (id: string, p: Prefill) => void }) {
  const days = useMemo(() => nextDays(21), []);
  const [date, setDate] = useState(days[0].iso);
  const [time, setTime] = useState("19:00");
  const [guests, setGuests] = useState<number | "11+">(2);
  const prefill: Prefill = { date, time, partySize: guests };
  const dayLabel = days.find((d) => d.iso === date)?.label ?? date;

  const share = async () => {
    const data = { title: RESTAURANT.name, text: `Reserve a table at ${RESTAURANT.name}`, url: typeof window !== "undefined" ? window.location.href : "" };
    try {
      if (navigator.share) await navigator.share(data);
      else await navigator.clipboard.writeText(data.url);
    } catch {
      /* dismissed */
    }
  };

  const iconBtn = "grid h-11 w-11 place-items-center rounded-full bg-white/90 text-[#1238B8] shadow-[0_10px_30px_-12px_rgba(14,44,147,0.5)] transition-colors hover:text-[#E50064]";

  return (
    <div className="relative min-h-[100svh] w-full overflow-hidden">
      {/* KIKI's terrace, lifted a touch so it reads bright. */}
      <motion.div className="absolute inset-0" initial={{ scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 10, ease: "linear" }}>
        <img src={RESTAURANT.hero.image} alt={RESTAURANT.hero.alt} className="h-full w-full object-cover" style={{ objectPosition: RESTAURANT.hero.focus, filter: "brightness(1.08) saturate(1.08)" }} />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/55" aria-hidden />
      <Petals count={18} seed={5} scale={1.25} />

      <div className="relative flex min-h-[100svh] flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 sm:px-8 sm:pt-6">
          <motion.div variants={rise} custom={0} initial="hidden" animate="show" className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2.5 text-[13px] text-[#1238B8] shadow-[0_10px_30px_-12px_rgba(14,44,147,0.5)]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#1238B8" aria-hidden><path d="M12 2l2.9 6.6 7.1.7-5.4 4.8 1.6 7L12 17.3 5.8 21l1.6-7L2 9.3l7.1-.7z" /></svg>
            <span className="font-semibold">{RESTAURANT.rating.toFixed(1)}</span>
            <span className="text-[#0E2C93]/60">({RESTAURANT.reviews.toLocaleString("en-US")})</span>
          </motion.div>
          <motion.div variants={rise} custom={0} initial="hidden" animate="show" className="flex items-center gap-2">
            <a href={RESTAURANT.menuUrl} className="hidden items-center gap-2 rounded-full bg-white/90 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1238B8] shadow-[0_10px_30px_-12px_rgba(14,44,147,0.5)] transition-colors hover:text-[#E50064] sm:flex">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden><path d="M7 3v18M4 3v5a3 3 0 006 0V3M17 3c-2 1-3 3.5-3 7 0 1.5 1 2.5 3 2.5V21" /></svg>
              View menu
            </a>
            <a href={RESTAURANT.menuUrl} className={`${iconBtn} sm:hidden`} aria-label="View menu">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden><path d="M7 3v18M4 3v5a3 3 0 006 0V3M17 3c-2 1-3 3.5-3 7 0 1.5 1 2.5 3 2.5V21" /></svg>
            </a>
            <button type="button" className={iconBtn} aria-label="Save">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden><path d="M6 3h12v18l-6-4-6 4z" /></svg>
            </button>
            <button type="button" onClick={share} className={iconBtn} aria-label="Share">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="M8.2 10.8l7.6-4.6M8.2 13.2l7.6 4.6" /></svg>
            </button>
          </motion.div>
        </div>

        {/* Wordmark */}
        <motion.div variants={rise} custom={1} initial="hidden" animate="show" className="relative mt-1 flex flex-col items-center text-center sm:mt-0">
          {/* A soft cobalt pool behind the wordmark so white type holds against the sky. */}
          <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[220%] w-[min(90vw,620px)] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(14,44,147,0.42),rgba(14,44,147,0))]" />
          <Wordmark color="#FFFFFF" className="relative w-[min(58vw,360px)] [filter:drop-shadow(0_2px_6px_rgba(14,44,147,0.75))_drop-shadow(0_12px_34px_rgba(14,44,147,0.55))]" />
          <p className="relative mt-2 text-[10px] font-semibold uppercase tracking-[0.55em] text-white [text-shadow:0_1px_4px_rgba(14,44,147,0.9),0_4px_18px_rgba(14,44,147,0.6)] sm:text-[12px]">{RESTAURANT.brandLine}</p>
        </motion.div>

        {/* Handwritten note */}
        <motion.p variants={rise} custom={2} initial="hidden" animate="show" aria-hidden className="k-script absolute left-[5%] top-[19%] hidden rotate-[-5deg] text-[30px] leading-[0.95] text-white drop-shadow-[0_2px_12px_rgba(14,44,147,0.6)] lg:block">
          Good Food
          <br />
          Brighter Days <span className="text-[22px]">♡</span>
        </motion.p>

        {/* Booking card */}
        <motion.form
          variants={rise}
          custom={2}
          initial="hidden"
          animate="show"
          onSubmit={(e) => {
            e.preventDefault();
            onReserve(prefill);
          }}
          className="mx-auto mt-6 w-[min(100%-32px,700px)] rounded-[22px] bg-white/92 p-5 text-center shadow-[0_40px_90px_-40px_rgba(14,44,147,0.55)] backdrop-blur-xl sm:mt-8 sm:p-8"
        >
          <h1 className="k-display text-[26px] uppercase leading-none tracking-[0.12em] text-[#1238B8] sm:text-[38px]">Your table awaits</h1>
          <p className="mt-3 text-[13px] text-[#0E2C93]/80 sm:text-[15px]">
            {RESTAURANT.neighborhood} <span className="mx-1.5 text-[#E50064]">•</span> {RESTAURANT.cuisine} <span className="mx-1.5 text-[#E50064]">•</span> {RESTAURANT.priceTier}
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Picker
              label="Date"
              value={dayLabel}
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>}
              onChange={(e) => setDate(e.target.value)}
              defaultValue={date}
            >
              {days.map((d) => (
                <option key={d.iso} value={d.iso}>{d.label}</option>
              ))}
            </Picker>
            <Picker
              label="Time"
              value={fmtTime(time)}
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>}
              onChange={(e) => setTime(e.target.value)}
              defaultValue={time}
            >
              <optgroup label="Lunch">{TIMES.lunch.map((t) => <option key={t} value={t}>{fmtTime(t)}</option>)}</optgroup>
              <optgroup label="Dinner">{TIMES.dinner.map((t) => <option key={t} value={t}>{fmtTime(t)}</option>)}</optgroup>
            </Picker>
            <Picker
              label="Guests"
              value={guests === "11+" ? "11 or more" : String(guests)}
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0113 0M16 4.5a3.5 3.5 0 010 7M21.5 20a6.5 6.5 0 00-5-6.3" /></svg>}
              onChange={(e) => setGuests(e.target.value === "11+" ? "11+" : Number(e.target.value))}
              defaultValue={String(guests)}
            >
              {PARTY_SIZES.map((n) => (
                <option key={String(n)} value={String(n)}>{n === "11+" ? "11 or more" : `${n} ${n === 1 ? "guest" : "guests"}`}</option>
              ))}
            </Picker>
          </div>
          <Button full arrow type="submit" className="mt-5 !py-[19px] !text-[13px]">
            Find your table
          </Button>
          <p className="mt-3.5 flex items-center justify-center gap-2 text-[12px] text-[#0E2C93]/75">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#1238B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 8.5l3 3 7-7" /></svg>
            {RESTAURANT.cancellation}
          </p>
        </motion.form>

        {/* Spaces */}
        <div className="mt-auto pt-8">
          <div className="k-snap flex gap-3 overflow-x-auto px-4 pb-2 sm:px-8 lg:mx-auto lg:max-w-[1500px] lg:grid lg:grid-cols-5 lg:overflow-visible">
            {SPACES.map((s, i) => (
              <motion.button
                key={s.id}
                type="button"
                onClick={() => onSpace(s.id, prefill)}
                variants={rise}
                custom={3 + i * 0.6}
                initial="hidden"
                animate="show"
                className="group w-[64vw] max-w-[260px] shrink-0 rounded-[14px] border-[1.5px] border-[#1238B8]/60 bg-white/92 p-1.5 pb-3 text-center shadow-[0_24px_50px_-30px_rgba(14,44,147,0.6)] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-[#E50064] lg:w-auto lg:max-w-none"
              >
                <span className="block aspect-[16/10] w-full overflow-hidden rounded-[10px]">
                  <img src={s.img} alt="" className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.65,0,0.15,1)] group-hover:scale-[1.06]" />
                </span>
                <span className="mt-3 block text-[11px] font-semibold uppercase tracking-[0.3em] text-[#1238B8] transition-colors group-hover:text-[#E50064]">{s.name}</span>
              </motion.button>
            ))}
          </div>
          <p className="py-5 text-center text-[12px] text-[#0E2C93]/70">
            Powered by{" "}
            <a href={DISHIO.url} target="_blank" rel="noopener noreferrer" className="k-link text-[#1238B8]">
              {DISHIO.name}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
