"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

const subscribeMotion = (cb: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Short lines that take turns on screen, each sliding up into place. The full
 * text stays in the DOM for screen readers, and with reduced motion the lines
 * are listed together instead of rotating.
 */
export function RotatingLines({
  lines,
  fullText,
  intervalMs = 3600,
  className,
}: {
  lines: string[];
  fullText: string;
  intervalMs?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const reduced = useSyncExternalStore(subscribeMotion, getReducedMotion, () => false);

  useEffect(() => {
    if (reduced || lines.length < 2) return;
    const id = setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % lines.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [reduced, lines.length, intervalMs]);

  if (reduced) {
    return <p className={className}>{fullText}</p>;
  }

  return (
    <div className={className}>
      <p className="sr-only">{fullText}</p>
      <div aria-hidden className="min-h-[3.9em]">
        <p key={index} className="animate-[line-in_650ms_cubic-bezier(0.22,1,0.36,1)_both] text-[21px] font-semibold leading-[1.25] tracking-[-0.01em] text-white">
          {lines[index]}
        </p>
      </div>
      <div aria-hidden className="mt-3 flex gap-1.5">
        {lines.map((_, i) => (
          <span
            key={i}
            className={cn("h-1 rounded-full transition-all duration-500", i === index ? "w-6 bg-white" : "w-1.5 bg-white/35")}
          />
        ))}
      </div>
    </div>
  );
}
