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
  intervalMs = 4800,
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
      <div aria-hidden className="min-h-[2.7em]">
        <p key={index} className="animate-[line-in_900ms_ease-out_both] text-[14px] font-medium leading-snug text-white/80 md:text-[20px]">
          {lines[index]}
        </p>
      </div>
      <div aria-hidden className="mt-2.5 flex gap-1">
        {lines.map((_, i) => (
          <span
            key={i}
            className={cn("h-[3px] rounded-full transition-all duration-700", i === index ? "w-4 bg-white/80" : "w-1 bg-white/25")}
          />
        ))}
      </div>
    </div>
  );
}
