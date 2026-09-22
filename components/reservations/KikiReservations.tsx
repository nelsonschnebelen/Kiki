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

/**
 * Dishio's reservation flow in KIKI's style. Landing, then six steps in a
 * frosted card on stone with petals falling behind. Everything is local
 * state; nothing is sent anywhere.
 */
/** variant "kiki": the full KIKI treatment. "lite": Dishio's own system, brighter. */
export default function KikiReservations({ variant = "kiki" }: { variant?: "kiki" | "lite" }) {
  const lite = variant === "lite";
  const root = `kiki-rsv${lite ? " theme-lite" : ""}`;
  const [step, setStep] = useState(0); // 0 = landing
  const [dir, setDir] = useState(1);
  const [b, setB] = useState<Booking>(EMPTY);
  const set = useCallback((patch: Partial<Booking>) => setB((x) => ({ ...x, ...patch })), []);

  const go = (n: number) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const next = () => {
    if (step === 5) set({ id: `KIKI-${Math.random().toString(36).slice(2, 8).toUpperCase()}` });
    go(step + 1);
  };
  const back = () => go(step - 1);
  /* The landing card's date, time and guests carry into the flow. */
  const start = (p: Prefill) => {
    set({ date: p.date, time: p.time, partySize: p.partySize });
    go(1);
  };

  useEffect(() => {
    document.title = step ? `${LABELS[step - 1]} · Reserve · ${RESTAURANT.name}` : `Reserve a table · ${RESTAURANT.name}`;
  }, [step]);

  if (step === 0) {
    return (
      <div className={root}>
        {lite ? <LandingLite onReserve={start} onSpace={(_, p) => start(p)} /> : <Landing onReserve={start} onSpace={(_, p) => start(p)} />}
      </div>
    );
  }

  const variants = {
    enter: (d: number) => ({ x: d * 40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d * -40, opacity: 0 }),
  };

  return (
    <div className={`${root} flex min-h-[100svh] flex-col`}>
      <Florals />
      <Petals count={9} seed={11} className="!fixed" />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-5 pt-5 sm:px-8">
        <button
          type="button"
          onClick={step === 6 ? () => go(0) : back}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/70 text-[#1238B8] transition-colors hover:bg-white"
          aria-label={step === 6 ? "Back to start" : "Back"}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M10 3L5 8l5 5" /></svg>
        </button>
        <button type="button" onClick={() => go(0)} aria-label="KIKI on the River, start over">
          <Wordmark className="w-[92px]" />
        </button>
        <span className="w-10" aria-hidden />
      </header>

      <div className="relative z-10 mt-6 px-6">
        <Stepper step={step} labels={LABELS} />
      </div>

      <main className="relative z-10 flex-1 px-4 pb-10 pt-6 sm:px-8">
        <div className="mx-auto w-full max-w-[520px]">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={step}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="k-glass rounded-[26px] p-6 sm:p-8"
            >
              {step === 1 && <PhoneStep b={b} set={set} next={next} />}
              {step === 2 && <WhenStep b={b} set={set} next={next} />}
              {step === 3 && <DetailsStep b={b} set={set} next={next} />}
              {step === 4 && <AddOnsStep b={b} set={set} next={next} />}
              {step === 5 && <PaymentStep b={b} set={set} next={next} />}
              {step === 6 && <ConfirmedStep b={b} onDone={() => { setB(EMPTY); go(0); }} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="relative z-10 pb-6 text-center text-[10px] uppercase tracking-[0.34em] text-[#0E2C93]/45">
        Powered by{" "}
        <a href={DISHIO.url} target="_blank" rel="noopener noreferrer" className="k-link text-[#1238B8]/70">
          {DISHIO.name}
        </a>
      </footer>
    </div>
  );
}
