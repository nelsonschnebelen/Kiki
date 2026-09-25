import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ADDONS, OCCASIONS, PARTY_SIZES, RESTAURANT, TABLES, TIMES, ZONES, type Table } from "./config";
import { Button, Chip, Field, Meander, Petals, StepTitle, fmtDate, fmtTime, money } from "./ui";

/* ---------------------------------------------------------------------------
 * Shared state
 * ------------------------------------------------------------------------- */
export interface Booking {
  phone: string;
  partySize: number | "11+" | null;
  date: string | null;
  time: string | null;
  tableId: string | null;
  name: string;
  email: string;
  occasion: string;
  notes: string;
  addons: Record<string, number>;
  card: { number: string; expiry: string; cvc: string; name: string };
  id?: string;
}

export const EMPTY: Booking = { phone: "", partySize: null, date: null, time: null, tableId: null, name: "", email: "", occasion: "None", notes: "", addons: {}, card: { number: "", expiry: "", cvc: "", name: "" } };

interface StepProps { b: Booking; set: (patch: Partial<Booking>) => void; next: () => void }

const formatPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

/* ---------------------------------------------------------------------------
 * 1 · Phone
 * ------------------------------------------------------------------------- */
export function PhoneStep({ b, set, next }: StepProps) {
  const ok = b.phone.replace(/\D/g, "").length >= 10;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (ok) next();
      }}
      className="space-y-7"
    >
      <StepTitle script="First things first" title="Let's start with your phone" subtitle="We'll text you a confirmation. If you've booked with us before, we'll recognize you and skip ahead." />
      <div className="flex overflow-hidden rounded-[16px] border border-[#1238B8]/18 bg-white/80 focus-within:border-[#E50064] focus-within:shadow-[0_0_0_4px_rgba(229,0,100,0.12)]">
        <span className="flex items-center gap-2 border-r border-[#1238B8]/12 px-4 text-[14px] text-[#1238B8]">
          <span aria-hidden>🇺🇸</span>
          <span className="font-semibold">+1</span>
        </span>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="(555) 123-4567"
          value={b.phone}
          onChange={(e) => set({ phone: formatPhone(e.target.value) })}
          aria-label="Phone number"
          className="k-display w-full bg-transparent px-4 py-4 text-[20px] tracking-[0.04em] text-[#1238B8] outline-none placeholder:text-[#0E2C93]/30"
        />
      </div>
      <p className="-mt-3 text-center text-[11px] text-[#0E2C93]/55">We’ll text you a confirmation. No spam, ever.</p>
      <Button full arrow type="submit" disabled={!ok}>
        Continue
      </Button>
      <p className="text-center text-[11px] leading-relaxed text-[#0E2C93]/55">Already booked with us? You’ll be recognized automatically.</p>
    </form>
  );
}

/* ---------------------------------------------------------------------------
 * 2 · Party, date, time, table
 * ------------------------------------------------------------------------- */
const nextDays = (n: number) => {
  const out: { iso: string; day: string; date: string; month: string }[] = [];
  const d = new Date();
  for (let i = 0; i < n; i++) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
    const iso = `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
    out.push({ iso, day: i === 0 ? "Today" : i === 1 ? "Tomorrow" : x.toLocaleDateString("en-US", { weekday: "short" }), date: String(x.getDate()), month: x.toLocaleDateString("en-US", { month: "short" }) });
  }
  return out;
};

export function WhenStep({ b, set, next }: StepProps) {
  const days = useMemo(() => nextDays(14), []);
  const [plan, setPlan] = useState(false);
  const table = TABLES.find((t) => t.id === b.tableId);
  const large = b.partySize === "11+";
  const ready = !!b.partySize && !!b.date && !!b.time && (large || !!b.tableId);
  const weekend = b.date ? [0, 6].includes(new Date(b.date + "T12:00:00").getDay()) : false;

  return (
    <div className="space-y-8">
      <StepTitle script="Your night, your way" title="When are we expecting you?" />

      <section>
        <p className="k-label">Party size</p>
        <div className="flex flex-wrap gap-2">
          {PARTY_SIZES.map((n) => (
            <Chip key={String(n)} on={b.partySize === n} onClick={() => set({ partySize: n, tableId: null })} className="min-w-[48px]">
              {n}
            </Chip>
          ))}
        </div>
        {large && <p className="mt-3 text-[12px] leading-relaxed text-[#E50064]">Parties of 11 or more go straight to our events team — we’ll take your details and they’ll reply within a day.</p>}
      </section>

      <section>
        <p className="k-label">Date</p>
        <div className="k-snap -mx-6 flex gap-2.5 overflow-x-auto px-6 pb-2">
          {days.map((d) => {
            const on = b.date === d.iso;
            return (
              <button
                key={d.iso}
                type="button"
                onClick={() => set({ date: d.iso, time: null, tableId: null })}
                aria-pressed={on}
                className={`flex h-[92px] w-[82px] shrink-0 flex-col items-center justify-center rounded-[16px] border transition-all duration-300 ${on ? "border-[#E50064] bg-[#E50064] text-white shadow-[0_16px_34px_-14px_rgba(229,0,100,0.7)]" : "border-[#1238B8]/18 bg-white/75 text-[#1238B8] hover:-translate-y-0.5 hover:border-[#1238B8]"}`}
              >
                <span className={`text-[10px] uppercase tracking-[0.2em] ${on ? "text-white/80" : "text-[#0E2C93]/55"}`}>{d.day}</span>
                <span className="k-display mt-1 text-[26px] leading-none">{d.date}</span>
                <span className={`mt-1 text-[10px] uppercase tracking-[0.2em] ${on ? "text-white/80" : "text-[#0E2C93]/55"}`}>{d.month}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <p className="k-label">Time</p>
        {!b.date ? (
          <p className="text-[13px] text-[#0E2C93]/55">Pick a date to see times.</p>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="k-script mb-2 text-[20px] leading-none text-[#E50064]">{weekend ? "Brunch & lunch" : "Lunch"}</p>
              <div className="flex flex-wrap gap-2">
                {TIMES.lunch.map((t) => (
                  <Chip key={t} on={b.time === t} onClick={() => set({ time: t })} className="!text-[14px]">
                    {fmtTime(t)}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <p className="k-script mb-2 text-[20px] leading-none text-[#E50064]">Dinner into dancing</p>
              <div className="flex flex-wrap gap-2">
                {TIMES.dinner.map((t, i) => (
                  <Chip key={t} on={b.time === t} disabled={weekend && (i === 4 || i === 6)} onClick={() => set({ time: t })} className="!text-[14px]">
                    {fmtTime(t)}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {!large && (
        <section>
          <p className="k-label">Seating</p>
          <button
            type="button"
            onClick={() => setPlan(true)}
            disabled={!b.partySize || !b.date || !b.time}
            className="flex w-full items-center gap-4 rounded-[16px] border border-[#1238B8]/18 bg-white/75 p-4 text-left transition-all duration-300 hover:border-[#1238B8] disabled:opacity-40"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#E50064]/10 text-[#E50064]" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18M9 10v10" /></svg>
            </span>
            <span className="flex-1">
              <span className="k-display block text-[17px] uppercase tracking-[0.08em] text-[#1238B8]">{table ? table.label : "Choose your table"}</span>
              <span className="block text-[11px] text-[#0E2C93]/60">{table ? `${table.zone} · seats ${table.seats} · tap to change` : "View the floor plan"}</span>
            </span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#1238B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M6 3l5 5-5 5" /></svg>
          </button>
        </section>
      )}

      <Button full arrow disabled={!ready} onClick={next}>
        Continue
      </Button>

      <FloorPlan open={plan} onClose={() => setPlan(false)} partySize={typeof b.partySize === "number" ? b.partySize : 2} current={b.tableId} onConfirm={(id) => { set({ tableId: id }); setPlan(false); }} />
    </div>
  );
}

/* Floor plan: the river along the top, the terrace on the water, then the rooms. */
function FloorPlan({ open, onClose, partySize, current, onConfirm }: { open: boolean; onClose: () => void; partySize: number; current: string | null; onConfirm: (id: string) => void }) {
  const [zone, setZone] = useState("Terrace");
  const [sel, setSel] = useState<string | null>(current);
  useEffect(() => {
    if (open) setSel(current);
  }, [open, current]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, onClose]);

  const fits = (t: Table) => t.seats >= partySize && t.seats <= Math.max(partySize + 2, 4) * 2;
  const chosen = TABLES.find((t) => t.id === sel);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
          <div className="absolute inset-0 bg-[#0E2C93]/40 backdrop-blur-[3px]" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Choose your table"
            className="k-glass relative flex max-h-[92svh] w-full max-w-[520px] flex-col overflow-hidden rounded-t-[26px] !bg-white/90 sm:rounded-[26px]"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start justify-between px-6 pt-6">
              <div>
                <p className="k-script text-[22px] leading-none text-[#E50064]">Pick your spot</p>
                <h3 className="k-display mt-1 text-[22px] uppercase tracking-[0.1em] text-[#1238B8]">Choose your table</h3>
                <p className="mt-1 text-[11px] text-[#0E2C93]/60">Showing tables for {partySize} {partySize === 1 ? "guest" : "guests"}</p>
              </div>
              <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full text-[#1238B8] hover:bg-[#1238B8]/8" aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden><path d="M3 3l10 10M13 3L3 13" /></svg>
              </button>
            </div>

            <div className="k-snap mt-4 flex gap-2 overflow-x-auto px-6 pb-1">
              {ZONES.map((z) => (
                <Chip key={z} on={zone === z} onClick={() => setZone(z)} className="!min-h-[36px] !text-[13px]">
                  {z}
                </Chip>
              ))}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-2 pt-3">
              <svg viewBox="0 0 400 520" className="w-full" role="group" aria-label="Floor plan">
                {/* The river */}
                <defs>
                  <linearGradient id="k-river" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#1238B8" stopOpacity="0.28" />
                    <stop offset="1" stopColor="#1238B8" stopOpacity="0.06" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="400" height="70" fill="url(#k-river)" />
                {[0, 1, 2].map((i) => (
                  <path key={i} d={`M-10 ${22 + i * 16} q25 -8 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0`} fill="none" stroke="#1238B8" strokeOpacity={0.35 - i * 0.08} strokeWidth="1.2" />
                ))}
                <text x="200" y="48" textAnchor="middle" fontSize="9" letterSpacing="4" fill="#1238B8" fillOpacity="0.7" fontFamily="var(--k-sans)">THE MIAMI RIVER</text>
                {/* Bougainvillea columns along the water */}
                {[20, 120, 220, 320, 380].map((x) => (
                  <g key={x}>
                    <rect x={x - 3} y="78" width="6" height="26" rx="2" fill="#1238B8" fillOpacity="0.55" />
                    <circle cx={x} cy="80" r="9" fill="#E50064" fillOpacity="0.55" />
                    <circle cx={x + 6} cy="86" r="5" fill="#E50064" fillOpacity="0.4" />
                  </g>
                ))}
                {/* Room labels */}
                <text x="14" y="288" fontSize="9" letterSpacing="3" fill="#1238B8" fillOpacity="0.6" fontFamily="var(--k-sans)">DINING ROOM</text>
                <text x="306" y="288" fontSize="9" letterSpacing="3" fill="#1238B8" fillOpacity="0.6" fontFamily="var(--k-sans)">BAR</text>
                <line x1="290" y1="296" x2="290" y2="424" stroke="#1238B8" strokeOpacity="0.15" />
                <line x1="14" y1="430" x2="386" y2="430" stroke="#1238B8" strokeOpacity="0.15" strokeDasharray="3 4" />
                <text x="14" y="448" fontSize="9" letterSpacing="3" fill="#1238B8" fillOpacity="0.6" fontFamily="var(--k-sans)">PATIO</text>
                <text x="14" y="112" fontSize="9" letterSpacing="3" fill="#1238B8" fillOpacity="0.6" fontFamily="var(--k-sans)">TERRACE</text>

                {TABLES.map((t) => {
                  const on = sel === t.id;
                  const dim = t.zone !== zone;
                  const taken = !!t.taken || !fits(t);
                  const fill = on ? "#E50064" : taken ? "#E8E0D2" : "#FFFFFF";
                  const stroke = on ? "#E50064" : taken ? "#C9BDA8" : "#1238B8";
                  const w = t.shape === "rect" ? (t.seats >= 8 ? 200 : 46) : 0;
                  return (
                    <g
                      key={t.id}
                      className="k-table"
                      data-taken={taken}
                      opacity={dim ? 0.28 : 1}
                      onClick={() => !taken && setSel(t.id)}
                      role="button"
                      aria-pressed={on}
                      aria-label={`${t.label}, seats ${t.seats}${taken ? ", unavailable" : ""}`}
                      tabIndex={taken || dim ? -1 : 0}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && !taken && setSel(t.id)}
                    >
                      {t.shape === "round" ? (
                        <circle cx={t.x} cy={t.y} r={t.seats >= 6 ? 20 : 16} fill={fill} stroke={stroke} strokeWidth="1.4" />
                      ) : (
                        <rect x={t.x - w / 2} y={t.y - 14} width={w} height="28" rx="6" fill={fill} stroke={stroke} strokeWidth="1.4" />
                      )}
                      {/* Chairs */}
                      {Array.from({ length: Math.min(t.seats, t.shape === "rect" && t.seats >= 8 ? 12 : 6) }).map((_, i, arr) => {
                        if (t.shape === "rect") {
                          const per = Math.ceil(arr.length / 2);
                          const side = i < per ? -1 : 1;
                          const k = i % per;
                          const cx = t.x - w / 2 + ((k + 0.5) * w) / per;
                          return <circle key={i} cx={cx} cy={t.y + side * 22} r="3.2" fill={on ? "#E50064" : "#1238B8"} fillOpacity={taken ? 0.25 : 0.55} />;
                        }
                        const a = (i / arr.length) * Math.PI * 2 - Math.PI / 2;
                        const rr = (t.seats >= 6 ? 20 : 16) + 7;
                        return <circle key={i} cx={t.x + Math.cos(a) * rr} cy={t.y + Math.sin(a) * rr} r="3.2" fill={on ? "#E50064" : "#1238B8"} fillOpacity={taken ? 0.25 : 0.55} />;
                      })}
                      <text x={t.x} y={t.y + 3.5} textAnchor="middle" fontSize="9" fontWeight="600" fill={on ? "#fff" : taken ? "#A99C86" : "#1238B8"} fontFamily="var(--k-sans)">
                        {t.id}
                      </text>
                    </g>
                  );
                })}
              </svg>
              <div className="mt-1 flex items-center justify-center gap-5 text-[10px] uppercase tracking-[0.2em] text-[#0E2C93]/60">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#E50064]" /> Selected</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full border border-[#1238B8] bg-white" /> Available</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#E8E0D2]" /> Taken</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-[#1238B8]/12 px-6 py-4">
              <p className="k-display text-[15px] uppercase tracking-[0.08em] text-[#1238B8]">{chosen ? `${chosen.label} · ${chosen.zone}` : <span className="text-[#0E2C93]/50">Select a table</span>}</p>
              <Button disabled={!sel} onClick={() => sel && onConfirm(sel)} className="!px-6 !py-3.5 !text-[11px]">
                Confirm
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------------------------------------------------------------------
 * 3 · Details
 * ------------------------------------------------------------------------- */
export function DetailsStep({ b, set, next }: StepProps) {
  const ok = b.name.trim().length > 1 && /.+@.+\..+/.test(b.email);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (ok) next();
      }}
      className="space-y-7"
    >
      <StepTitle script="Nice to meet you" title="A few details" subtitle="So we know who to look after, and where to send the confirmation." />
      <div className="rounded-[16px] border border-[#1238B8]/14 bg-white/60 px-4 py-3 text-[12px] text-[#0E2C93]/70">
        <span className="k-label !mb-0.5 !text-[9px]">Phone</span>
        <span className="k-display text-[16px] text-[#1238B8]">+1 {b.phone}</span>
        <span className="ml-2 rounded-full bg-[#E50064]/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#E50064]">Verified</span>
      </div>
      <Field label="Full name">
        <input className="k-field" autoComplete="name" placeholder="Jane Doe" value={b.name} onChange={(e) => set({ name: e.target.value })} required />
      </Field>
      <Field label="Email">
        <input className="k-field" type="email" autoComplete="email" inputMode="email" placeholder="jane@example.com" value={b.email} onChange={(e) => set({ email: e.target.value })} required />
      </Field>
      <div>
        <p className="k-label">Occasion</p>
        <div className="flex flex-wrap gap-2">
          {OCCASIONS.map((o) => (
            <Chip key={o} on={b.occasion === o} onClick={() => set({ occasion: o })} className="!text-[14px]">
              {o}
            </Chip>
          ))}
        </div>
      </div>
      <Field label="Special requests">
        <textarea className="k-field !text-[15px] !font-[var(--k-sans)] !tracking-normal" rows={3} placeholder="Allergies, seating preferences, anything else..." value={b.notes} onChange={(e) => set({ notes: e.target.value })} />
      </Field>
      <Button full arrow type="submit" disabled={!ok}>
        Continue to add-ons
      </Button>
    </form>
  );
}

/* ---------------------------------------------------------------------------
 * 4 · Add-ons
 * ------------------------------------------------------------------------- */
export function AddOnsStep({ b, set, next }: StepProps) {
  const total = ADDONS.reduce((s, a) => s + (b.addons[a.id] || 0) * a.price, 0);
  const bump = (id: string, d: number) => {
    const max = id === "valet" ? 1 : 9;
    const q = Math.min(max, Math.max(0, (b.addons[id] || 0) + d));
    const addons = { ...b.addons, [id]: q };
    if (!q) delete addons[id];
    set({ addons });
  };
  return (
    <div className="space-y-7">
      <StepTitle script="A little something extra" title="Enhance your evening" subtitle="Optional touches to make your reservation extra special." />
      <ul className="space-y-3">
        {ADDONS.map((a, i) => {
          const q = b.addons[a.id] || 0;
          return (
            <motion.li
              key={a.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className={`flex items-center gap-3 overflow-hidden rounded-[18px] border bg-white/75 p-3 pr-3 transition-colors duration-300 ${q ? "border-[#E50064]" : "border-[#1238B8]/14"}`}
            >
              <div className="relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-[12px]">
                <img src={a.img} alt="" className="h-full w-full object-cover" />
                <span className="absolute bottom-1 left-1 rounded-full bg-white/90 px-1.5 text-[13px] leading-[20px]" aria-hidden>{a.icon}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="k-display text-[15px] uppercase leading-tight tracking-[0.03em] text-[#1238B8]">{a.title}</p>
                <p className="mt-1 text-[11.5px] leading-snug text-[#0E2C93]/65">{a.desc}</p>
                <p className="mt-1.5 text-[12px] font-semibold text-[#E50064]">{money(a.price)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {q > 0 ? (
                  <>
                    <button type="button" onClick={() => bump(a.id, -1)} aria-label={`Remove ${a.title}`} className="grid h-8 w-8 place-items-center rounded-full border border-[#1238B8]/25 text-[#1238B8] hover:border-[#1238B8]">−</button>
                    <span className="k-display w-6 text-center text-[16px] text-[#1238B8]">{q}</span>
                    <button type="button" onClick={() => bump(a.id, 1)} aria-label={`Add another ${a.title}`} className="grid h-8 w-8 place-items-center rounded-full bg-[#E50064] text-white shadow-[0_8px_18px_-8px_rgba(229,0,100,0.8)]" disabled={a.id === "valet"}>+</button>
                  </>
                ) : (
                  <button type="button" onClick={() => bump(a.id, 1)} className="grid h-9 w-9 place-items-center rounded-full border border-[#E50064] text-[#E50064] transition-all hover:bg-[#E50064] hover:text-white" aria-label={`Add ${a.title}`}>
                    +
                  </button>
                )}
              </div>
            </motion.li>
          );
        })}
      </ul>
      <div className="flex items-center justify-between border-t border-[#1238B8]/12 pt-4">
        <span className="k-label !mb-0">Add-ons total</span>
        <span className="k-display text-[22px] text-[#1238B8]">{money(total)}</span>
      </div>
      <Button full arrow onClick={next}>
        {total ? "Continue" : "Skip add-ons"}
      </Button>
      <p className="-mt-3 text-center text-[11px] text-[#0E2C93]/55">You can always add extras later from your reservation page.</p>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * 5 · Payment (demo: nothing is sent anywhere)
 * ------------------------------------------------------------------------- */
const brandOf = (n: string) => (/^4/.test(n) ? "Visa" : /^(5[1-5]|2[2-7])/.test(n) ? "Mastercard" : /^3[47]/.test(n) ? "Amex" : /^6/.test(n) ? "Discover" : "");

export function PaymentStep({ b, set, next }: StepProps) {
  const total = ADDONS.reduce((s, a) => s + (b.addons[a.id] || 0) * a.price, 0);
  const digits = b.card.number.replace(/\D/g, "");
  const ok = digits.length >= 15 && /^\d{2}\/\d{2}$/.test(b.card.expiry) && b.card.cvc.length >= 3 && b.card.name.trim().length > 1;
  const card = (patch: Partial<Booking["card"]>) => set({ card: { ...b.card, ...patch } });
  const table = TABLES.find((t) => t.id === b.tableId);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (ok) next();
      }}
      className="space-y-7"
    >
      <StepTitle script="Almost there" title="Hold your table" subtitle={total ? `Add-ons (${money(total)}) are charged now. Your card is otherwise only used if you don't show.` : "No charge today. Your card is only used if you don't show."} />

      <div className="rounded-[18px] border border-[#1238B8]/14 bg-white/60 p-4">
        <p className="k-script text-[20px] leading-none text-[#E50064]">Your reservation</p>
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[13px] text-[#1238B8]">
          <dt className="text-[#0E2C93]/55">Date</dt><dd className="k-display text-right">{b.date ? fmtDate(b.date, { weekday: "short", month: "short", day: "numeric" }) : "—"}</dd>
          <dt className="text-[#0E2C93]/55">Time</dt><dd className="k-display text-right">{b.time ? fmtTime(b.time) : "—"}</dd>
          <dt className="text-[#0E2C93]/55">Guests</dt><dd className="k-display text-right">{b.partySize}</dd>
          <dt className="text-[#0E2C93]/55">Table</dt><dd className="k-display text-right">{table ? `${table.label}` : "Events team"}</dd>
        </dl>
      </div>

      <Field label={<span className="flex items-center justify-between">Card number {brandOf(digits) && <span className="text-[#E50064]">{brandOf(digits)}</span>}</span>}>
        <input className="k-field" inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" value={b.card.number} onChange={(e) => card({ number: e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim() })} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Expires">
          <input className="k-field" inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" value={b.card.expiry} onChange={(e) => { const d = e.target.value.replace(/\D/g, "").slice(0, 4); card({ expiry: d.length < 3 ? d : `${d.slice(0, 2)}/${d.slice(2)}` }); }} />
        </Field>
        <Field label="CVC">
          <input className="k-field" inputMode="numeric" autoComplete="cc-csc" placeholder="123" value={b.card.cvc} onChange={(e) => card({ cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })} />
        </Field>
      </div>
      <Field label="Name on card">
        <input className="k-field" autoComplete="cc-name" placeholder={b.name || "Jane Doe"} value={b.card.name} onChange={(e) => card({ name: e.target.value })} />
      </Field>

      <Button full arrow type="submit" disabled={!ok}>
        Confirm reservation
      </Button>
      <p className="-mt-3 flex items-center justify-center gap-2 text-[11px] text-[#0E2C93]/55">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E50064" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 018 0v3" /></svg>
        {RESTAURANT.cancellation}. Secured by Dishio.
      </p>
    </form>
  );
}

/* ---------------------------------------------------------------------------
 * 6 · Confirmed
 * ------------------------------------------------------------------------- */
export function ConfirmedStep({ b, onDone }: { b: Booking; onDone: () => void }) {
  const table = TABLES.find((t) => t.id === b.tableId);
  const extras = ADDONS.filter((a) => b.addons[a.id]);
  const ics = () => {
    if (!b.date || !b.time) return;
    const start = b.date.replace(/-/g, "") + "T" + b.time.replace(":", "") + "00";
    const [h, m] = b.time.split(":").map(Number);
    const end = b.date.replace(/-/g, "") + "T" + String(h + 2).padStart(2, "0") + String(m).padStart(2, "0") + "00";
    const body = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Dishio//KIKI//EN", "BEGIN:VEVENT", `UID:${b.id}@dishio`, `DTSTART:${start}`, `DTEND:${end}`, `SUMMARY:Dinner at ${RESTAURANT.name}`, `LOCATION:${RESTAURANT.address}`, `DESCRIPTION:Table for ${b.partySize}${table ? ` · ${table.label}` : ""}. ${RESTAURANT.cancellation}.`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const url = URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "kiki-reservation.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative space-y-7 text-center">
      <Petals count={8} seed={21} className="!fixed" />
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#E50064] text-white shadow-[0_20px_44px_-14px_rgba(229,0,100,0.8)]">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12.5l4.5 4.5L19 7" /></svg>
      </motion.div>
      <div>
        <p className="k-script text-[30px] leading-none text-[#E50064]">See you on the river ♡</p>
        <h2 className="k-display mt-2 text-[32px] uppercase leading-[1.05] tracking-[0.08em] text-[#1238B8]">Reservation confirmed</h2>
        <p className="mx-auto mt-3 max-w-[34ch] text-[13px] leading-relaxed text-[#0E2C93]/70">We’ve texted the details to +1 {b.phone}. We’ll send a reminder 24 hours before.</p>
        <Meander units={4} className="mx-auto mt-5 text-[#1238B8]/60" />
      </div>

      <div className="rounded-[20px] border border-[#1238B8]/14 bg-white/70 p-5 text-left">
        <p className="k-script text-[22px] leading-none text-[#E50064]">{b.time ? fmtTime(b.time) : ""}</p>
        <p className="k-display mt-1 text-[22px] uppercase leading-tight tracking-[0.06em] text-[#1238B8]">{b.date ? fmtDate(b.date) : ""}</p>
        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[13px] text-[#1238B8]">
          <dt className="text-[#0E2C93]/55">Guest</dt><dd className="k-display">{b.name}</dd>
          <dt className="text-[#0E2C93]/55">Party</dt><dd className="k-display">{b.partySize} {b.partySize === 1 ? "guest" : "guests"}</dd>
          <dt className="text-[#0E2C93]/55">Table</dt><dd className="k-display">{table ? `${table.label} · ${table.zone}` : "Our events team will be in touch"}</dd>
          {b.occasion !== "None" && (<><dt className="text-[#0E2C93]/55">Occasion</dt><dd className="k-display">{b.occasion}</dd></>)}
          {extras.length > 0 && (<><dt className="text-[#0E2C93]/55">Add-ons</dt><dd className="k-display">{extras.map((a) => `${a.title}${b.addons[a.id] > 1 ? ` ×${b.addons[a.id]}` : ""}`).join(", ")}</dd></>)}
          <dt className="text-[#0E2C93]/55">Ref</dt><dd className="font-mono text-[12px] uppercase tracking-[0.2em] text-[#0E2C93]/70">{b.id}</dd>
        </dl>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button full onClick={ics}>
          Add to calendar
        </Button>
        <a href={RESTAURANT.menuUrl} className="k-btn k-btn-ghost w-full">
          Browse the menu
        </a>
      </div>
      <button type="button" onClick={onDone} className="k-link text-[11px] uppercase tracking-[0.3em] text-[#1238B8]/70">
        Back to start
      </button>
    </div>
  );
}
