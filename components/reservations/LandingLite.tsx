import { motion } from "framer-motion";
import { DISHIO, RESTAURANT, SPACES } from "./config";
import type { Prefill } from "./Landing";

const rise = { hidden: { opacity: 0, y: 18 }, show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] as const } }) };

/**
 * Option B: Dishio's own landing, one to one, just brighter. Same photo, same
 * rating pill, title, subtitle, one button, the spaces row. No flourishes.
 */
export default function LandingLite({ onReserve, onSpace }: { onReserve: (p: Prefill) => void; onSpace: (id: string, p: Prefill) => void }) {
  const today = new Date();
  const prefill: Prefill = { date: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`, time: "19:00", partySize: 2 };
  const pill = "grid h-10 w-10 place-items-center rounded-full bg-white/85 text-[#1238B8] shadow-[0_8px_24px_-10px_rgba(14,44,147,0.45)] backdrop-blur-md transition-colors hover:text-[#E50064]";

  return (
    <div className="relative min-h-[100svh] w-full overflow-hidden bg-[#F5F0E8]">
      <div className="absolute inset-0">
        <img src={RESTAURANT.hero.image} alt={RESTAURANT.hero.alt} className="h-full w-full object-cover" style={{ objectPosition: RESTAURANT.hero.focus, filter: "brightness(1.06) saturate(1.05)" }} />
        {/* Dishio fades to black at the bottom; here it fades to light. */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 h-[74%] bg-gradient-to-t from-[#F7F4EE] via-[#F7F4EE]/92 to-transparent" aria-hidden />
      </div>

      <div className="relative flex min-h-[100svh] flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6">
          <motion.div variants={rise} custom={0} initial="hidden" animate="show" className="flex items-center gap-2 rounded-full bg-white/85 px-3.5 py-2 text-[13px] text-[#1238B8] shadow-[0_8px_24px_-10px_rgba(14,44,147,0.45)] backdrop-blur-md">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#E50064" aria-hidden><path d="M12 2l2.9 6.6 7.1.7-5.4 4.8 1.6 7L12 17.3 5.8 21l1.6-7L2 9.3l7.1-.7z" /></svg>
            <span className="font-semibold">{RESTAURANT.rating.toFixed(1)}</span>
            <span className="text-[#0E2C93]/60">({RESTAURANT.reviews.toLocaleString("en-US")})</span>
          </motion.div>
          <motion.div variants={rise} custom={0} initial="hidden" animate="show" className="flex items-center gap-2">
            <a href={RESTAURANT.menuUrl} className={pill} aria-label="View menu">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden><path d="M7 3v18M4 3v5a3 3 0 006 0V3M17 3c-2 1-3 3.5-3 7 0 1.5 1 2.5 3 2.5V21" /></svg>
            </a>
            <button type="button" className={pill} aria-label="Save">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden><path d="M6 3h12v18l-6-4-6 4z" /></svg>
            </button>
            <button type="button" className={pill} aria-label="Share" onClick={() => navigator.share?.({ title: RESTAURANT.name, url: window.location.href }).catch(() => {})}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="M8.2 10.8l7.6-4.6M8.2 13.2l7.6 4.6" /></svg>
            </button>
          </motion.div>
        </div>

        <div className="mt-auto px-5 pb-6 text-center sm:px-8">
          <motion.h1 variants={rise} custom={1} initial="hidden" animate="show" className="text-[40px] font-bold leading-[1.02] tracking-[-0.02em] text-[#1238B8] drop-shadow-[0_2px_16px_rgba(255,255,255,0.9)] sm:text-[56px]">
            {RESTAURANT.name}
          </motion.h1>
          <motion.p variants={rise} custom={2} initial="hidden" animate="show" className="mt-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#0E2C93]/80 sm:text-[12px]">
            {RESTAURANT.neighborhood} · {RESTAURANT.cuisine} · {RESTAURANT.priceTier}
          </motion.p>
          <motion.div variants={rise} custom={3} initial="hidden" animate="show" className="mx-auto mt-6 w-full max-w-[420px]">
            <button
              type="button"
              onClick={() => onReserve(prefill)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#E50064] py-[18px] text-[16px] font-semibold text-white shadow-[0_18px_40px_-14px_rgba(229,0,100,0.7)] transition-all hover:-translate-y-0.5 hover:bg-[#C40056]"
            >
              Reserve a Table
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M6 3l5 5-5 5" /></svg>
            </button>
            <p className="mt-3 flex items-center justify-center gap-2 text-[12px] text-[#0E2C93]/70">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#1238B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 8.5l3 3 7-7" /></svg>
              {RESTAURANT.cancellation}
            </p>
          </motion.div>

          <div className="k-snap -mx-5 mt-8 flex gap-3 overflow-x-auto px-5 pb-1 sm:-mx-8 sm:px-8 lg:mx-auto lg:max-w-[1200px] lg:justify-center">
            {SPACES.map((s, i) => (
              <motion.button
                key={s.id}
                type="button"
                onClick={() => onSpace(s.id, prefill)}
                variants={rise}
                custom={3.5 + i * 0.5}
                initial="hidden"
                animate="show"
                className="group relative aspect-[4/3] w-[58vw] max-w-[230px] shrink-0 overflow-hidden rounded-2xl text-left shadow-[0_18px_40px_-24px_rgba(14,44,147,0.6)] sm:w-[220px]"
              >
                <img src={s.img} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" aria-hidden />
                <span className="absolute bottom-3 left-3 text-[15px] font-semibold text-white">{s.name}</span>
              </motion.button>
            ))}
          </div>
          <p className="mt-6 text-[12px] text-[#0E2C93]/60">
            Powered by{" "}
            <a href={DISHIO.url} target="_blank" rel="noopener noreferrer" className="font-medium text-[#1238B8]">
              {DISHIO.name}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
