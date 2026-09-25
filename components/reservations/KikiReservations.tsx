"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./reservations.css";
import Landing, { type Prefill } from "./Landing";
import LandingLite from "./LandingLite";
import { AddOnsStep, ConfirmedStep, DetailsStep, EMPTY, PaymentStep, PhoneStep, WhenStep, type Booking } from "./steps";
import { Florals, Petals, Stepper, Wordmark } from "./ui";
import { DISHIO, RESTAURANT } from "./config";

const LABELS = ["Your phone", "When & where", "Your details", "Add-ons", "Payment", "Confirmed"];

interface Props {
  /** "kiki": the full KIKI treatment. "lite": Dishio's own system, brighter. */
  variant?: "kiki" | "lite";
  /**
   * "page": standalone, with its own top bar (the demo routes).
   * "embedded": inside the site's header and footer (/reserve).
   * "drawer": the six steps only, inside the site's reservation drawer.
   */
  mode?: "page" | "embedded" | "drawer";
  /** Date, time and party size already chosen elsewhere (booking bar, one-tap nights, URL). */
  prefill?: Partial<Prefill>;
  /** Drawer only: leaving from step one, or finishing. */
  onClose?: () => void;
  /** Lets a wrapper react to the flow (the site header goes solid over the steps). */
  onStepChange?: (step: number) => void;
}

/**
 * Dishio's reservation flow in KIKI's style. Landing, then six steps in a
 * frosted card on stone with petals falling behind. Everything is local
 * state; nothing is sent anywhere.
 */
export default function KikiReservations({ variant = "kiki", mode = "page", prefill, onClose, onStepChange }: Props) {
  const lite = variant === "lite";
  const drawer = mode === "drawer";
  const embedded = mode === "embedded";
  const root = `kiki-rsv${lite ? " theme-lite" : ""}${drawer ? " is-drawer" : ""}${embedded ? " is-embedded" : ""}`;
  const [step, setStep] = useState(drawer ? 1 : 0); // 0 = landing
  const [dir, setDir] = useState(1);
  const [b, setB] = useState<Booking>(() => ({ ...EMPTY, date: prefill?.date ?? null, time: prefill?.time ?? null, partySize: prefill?.partySize ?? null }));
  const set = useCallback((patch: Partial<Booking>) => setB((x) => ({ ...x, ...patch })), []);

  const go = (n: number) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
    onStepChange?.(n);
    if (!drawer) window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const next = () => {
    if (step === 5) set({ id: `KIKI-${Math.random().toString(36).slice(2, 8).toUpperCase()}` });
    go(step + 1);
  };
  const first = drawer ? 1 : 0;
  const back = () => (step <= first ? onClose?.() : go(step - 1));
  const restart = () => {
    setB(EMPTY);
    if (drawer) onClose?.();
    else go(0);
  };
  /* The landing card's date, time and guests carry into the flow. */
  const start = (p: Prefill) => {
    set({ date: p.date, time: p.time, partySize: p.partySize });
    go(1);
  };

  useEffect(() => {
    if (drawer) return;
    document.title = step ? `${LABELS[step - 1]} · Reserve · ${RESTAURANT.name}` : `Reserve a table · ${RESTAURANT.name}`;
  }, [step, drawer]);

  if (step === 0) {
    return (
      <div className={root}>
        {lite ? <LandingLite onReserve={start} onSpace={(_, p) => start(p)} /> : <Landing onReserve={start} onSpace={(_, p) => start(p)} initial={prefill} hideTopBar={embedded} />}
      </div>
    );
  }

  const variants = {
    enter: (d: number) => ({ x: d * 40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d * -40, opacity: 0 }),
  };

  return (
    <div className={`${root} flex flex-col ${drawer ? "min-h-full" : "min-h-[100svh]"}`}>
      {!drawer && <Florals />}
      {!drawer && <Petals count={5} seed={11} className="!fixed" />}

      {/* Top bar: back, wordmark (unless the site's own header is above us). */}
      <header className={`relative z-10 flex items-center justify-between ${drawer ? "px-1 pt-1" : embedded ? "px-5 pt-[92px] sm:px-8 sm:pt-[104px]" : "px-5 pt-5 sm:px-8"}`}>
        <button
          type="button"
          onClick={step === 6 ? restart : back}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/70 text-[#1238B8] transition-colors hover:bg-white"
          aria-label={step === 6 ? "Start over" : step <= first && drawer ? "Close" : "Back"}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M10 3L5 8l5 5" />
          </svg>
        </button>
        {mode === "page" ? (
          <button type="button" onClick={() => go(0)} aria-label="KIKI on the River, start over">
            <Wordmark className="w-[92px]" />
          </button>
        ) : (
          <span />
        )}
        <span className="w-10" aria-hidden />
      </header>

      <div className={`relative z-10 ${drawer ? "mt-3 px-2" : "mt-6 px-6"}`}>
        <Stepper step={step} labels={LABELS} />
      </div>

      <main className={`relative z-10 flex-1 ${drawer ? "px-0 pb-4 pt-5" : "px-4 pb-10 pt-6 sm:px-8"}`}>
        <div className="mx-auto w-full max-w-[520px]">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div key={step} custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className={`k-glass rounded-[26px] ${drawer ? "p-5" : "p-6 sm:p-8"}`}>
              {step === 1 && <PhoneStep b={b} set={set} next={next} />}
              {step === 2 && <WhenStep b={b} set={set} next={next} />}
              {step === 3 && <DetailsStep b={b} set={set} next={next} />}
              {step === 4 && <AddOnsStep b={b} set={set} next={next} />}
              {step === 5 && <PaymentStep b={b} set={set} next={next} />}
              {step === 6 && <ConfirmedStep b={b} onDone={restart} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {!drawer && (
        <footer className="relative z-10 pb-6 text-center text-[10px] uppercase tracking-[0.34em] text-[#0E2C93]/45">
          Powered by{" "}
          <a href={DISHIO.url} target="_blank" rel="noopener noreferrer" className="k-link text-[#1238B8]/70">
            {DISHIO.name}
          </a>
        </footer>
      )}
    </div>
  );
}
