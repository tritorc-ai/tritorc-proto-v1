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
    <div className="rounded-[22px] bg-[#e4e5e7] p-3.5">
      <div role="tablist" aria-label="Core values" className="flex flex-wrap gap-1.5">
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
              "press rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors duration-200",
              i === active ? "border-black bg-black text-white" : "border-black/10 text-black/60 hover:border-black/30 hover:bg-white/50"
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
        className="mt-3 min-h-[2.4em] text-[13px] leading-snug text-black/65"
      >
        {current.description}
      </p>
    </div>
  );
}
