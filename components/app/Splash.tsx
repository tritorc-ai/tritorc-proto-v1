"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Curtain-rise intro. A full-screen graphite curtain covers the app; the
 * Tritorc wordmark fades in on it, then the curtain lifts upward to reveal
 * the home screen underneath. The whole sequence is CSS-driven (see
 * `.splash-*` in globals.css) so it plays correctly even before React
 * hydrates; React only unmounts the finished overlay. Once per session.
 */
export function Splash() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 2300);
    return () => clearTimeout(t);
  }, []);

  if (done) return null;

  return (
    <div aria-hidden className="splash-curtain pointer-events-none fixed inset-0 z-[100] overflow-hidden bg-[#121212]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(214,49,47,0.22),transparent_62%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-linear-to-r from-brand-red to-brand-red-bright" />
      <div className="relative flex h-full items-center justify-center">
        <div className="splash-logo flex flex-col items-center gap-4">
          <Image src="/brand/tritorc-logo.png" alt="" width={224} height={30} priority className="h-auto w-56" />
          <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">
            Bolting · Machining · Integrity
          </div>
        </div>
      </div>
    </div>
  );
}
