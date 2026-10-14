"use client";

import { useEffect, useState } from "react";
import { anybody, chakraPetch } from "@/lib/fonts";
import { cn } from "@/lib/utils";

/**
 * Startup curtain. A dark curtain covers the app while the TRITORC wordmark
 * fades in, glides up a touch and catches a silver shine; the footer fades in
 * beneath it. Then the curtain lifts over a blank light screen that fades away
 * to reveal the app. The whole sequence is CSS-driven (see `.splash-*` in
 * globals.css) so it plays correctly even before React hydrates; React only
 * unmounts the finished overlay. Once per session; tap to skip.
 */
export function Splash() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 3600);
    return () => clearTimeout(t);
  }, []);

  if (done) return null;

  return (
    <div
      aria-hidden
      onClick={() => setDone(true)}
      className="splash-root fixed inset-0 z-[100] overflow-hidden bg-[#fcfcfc]"
    >
      <div className="splash-curtain absolute inset-0 bg-[#171619]">
        <div className="absolute left-1/2 top-[49%] w-[82%] max-w-[320px] -translate-x-1/2 -translate-y-1/2">
          <div className="splash-glide">
            <div className="splash-logo flex justify-center">
              <span className={cn("splash-wordmark", chakraPetch.className)}>TRITORC</span>
            </div>
          </div>
        </div>

        <div className="splash-footer absolute inset-x-0 bottom-[6.3%] text-center">
          <p className="mb-1 text-[10px] font-normal tracking-wide text-[#a4a3a6]">On-site solution provider</p>
          <div className={cn("flex items-center justify-center gap-1.5 text-[11px] text-white", anybody.className)}>
            <span className="[font-stretch:150%] font-extrabold tracking-[0.12em]">TRITORC</span>
            <span className="[font-stretch:150%] font-extralight tracking-[0.14em] text-zinc-300">EQUIPMENTS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
