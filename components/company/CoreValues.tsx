"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Compact core-values selector: the five values as chips, with the selected
 * value's description shown beneath. Everything is in one small dark card.
 */
export function CoreValues({ values }: { values: { name: string; description: string }[] }) {
  const [active, setActive] = useState(0);
  const current = values[active];
  if (!current) return null;

  return (
    <div className="rounded-[24px] border border-white/10 bg-linear-to-br from-[#232326] to-[#121214] p-4">
      <div role="tablist" aria-label="Core values" className="flex flex-wrap gap-2">
        {values.map((v, i) => (
          <button
            key={v.name}
            id={`value-tab-${i}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls="value-panel"
            onClick={() => setActive(i)}
            className={cn(
              "press rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors duration-200",
              i === active ? "border-white bg-white text-black" : "border-white/20 text-white/75 hover:border-white/50"
            )}
          >
            {v.name}
          </button>
        ))}
      </div>
      <p
        id="value-panel"
        role="tabpanel"
        aria-labelledby={`value-tab-${active}`}
        className="mt-3.5 min-h-[2.6em] text-[14px] leading-snug text-white/80"
      >
        {current.description}
      </p>
    </div>
  );
}
