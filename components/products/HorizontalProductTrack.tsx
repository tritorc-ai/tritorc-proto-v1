"use client";

import { Children, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ScrollProgressIndicator } from "@/components/products/ScrollProgressIndicator";
import { cn } from "@/lib/utils";

type Metrics = { progress: number; thumb: number; active: number };
type Reveal = "visible" | "armed" | "shown";

/** Index of the card whose left edge is closest to the track's snap point. */
function nearestIndex(el: HTMLElement): number {
  const max = el.scrollWidth - el.clientWidth;
  if (max > 0 && el.scrollLeft >= max - 4) return el.children.length - 1;
  const pad = parseFloat(getComputedStyle(el).paddingLeft || "0");
  let best = 0;
  let bestDist = Infinity;
  Array.from(el.children).forEach((child, i) => {
    const dist = Math.abs((child as HTMLElement).offsetLeft - el.offsetLeft - el.scrollLeft - pad);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  });
  return best;
}

/**
 * Native, momentum-scrolling horizontal track with snap points, a partial
 * peek of the next card, a copper progress rail driven by the real scroll
 * position, and a one-time staggered reveal when it first enters the viewport.
 * Cards stay clickable; the track never widens the page.
 */
export function HorizontalProductTrack({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  const items = Children.toArray(children);
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [m, setM] = useState<Metrics>({ progress: 0, thumb: 1, active: 0 });
  const [reveal, setReveal] = useState<Reveal>("visible");

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const next: Metrics = {
      progress: max > 0 ? Math.min(1, Math.max(0, el.scrollLeft / max)) : 0,
      thumb: el.scrollWidth > 0 ? Math.min(1, el.clientWidth / el.scrollWidth) : 1,
      active: nearestIndex(el),
    };
    setM((p) =>
      Math.abs(p.progress - next.progress) < 0.002 && p.thumb === next.thumb && p.active === next.active ? p : next
    );
  }, []);

  const onScroll = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(measure);
  }, [measure]);

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [measure]);

  // One-time reveal. Content is visible by default (SSR / no-JS / reduced
  // motion); once mounted we arm it before paint, then release it when the
  // track scrolls into view so the cards fade up a single time.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setReveal("armed");
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setReveal("shown");
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div>
      <div
        ref={ref}
        onScroll={onScroll}
        role="region"
        aria-label={label}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto overscroll-x-contain scroll-px-5 px-5 pb-1"
      >
        {items.map((child, i) => (
          <div
            key={i}
            data-active={i === m.active}
            className={cn(
              "group/item w-[78%] shrink-0 snap-start",
              reveal === "armed" && "translate-y-4 opacity-0",
              reveal === "shown" && "translate-y-0 opacity-100 transition duration-500 ease-out"
            )}
            style={reveal === "shown" ? { transitionDelay: `${Math.min(i, 4) * 70}ms` } : undefined}
          >
            {child}
          </div>
        ))}
      </div>
      <ScrollProgressIndicator
        className="mt-4"
        progress={m.progress}
        thumb={m.thumb}
        index={m.active}
        count={items.length}
      />
    </div>
  );
}
