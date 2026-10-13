"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Ather-style pill pagination: the active dot stretches into a bar. */
export function Dots({
  count,
  active,
  tone = "dark",
  className,
}: {
  count: number;
  active: number;
  tone?: "dark" | "light";
  className?: string;
}) {
  if (count < 2) return null;
  return (
    <div className={cn("flex items-center justify-center gap-1.5", className)} aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300 ease-out",
            i === active ? "w-5" : "w-1.5",
            tone === "dark"
              ? i === active
                ? "bg-brand-dark"
                : "bg-black/20"
              : i === active
                ? "bg-white"
                : "bg-white/45"
          )}
        />
      ))}
    </div>
  );
}

/**
 * Horizontal snap-scrolling row. `itemClassName` sets each slide's width —
 * anything under 100% leaves the next card partially visible. `bleed` lets
 * the row run edge-to-edge while the first card still aligns with the page
 * gutter.
 */
export function Carousel({
  children,
  itemClassName = "w-[84%]",
  dots = true,
  bleed = true,
  overlayDots = false,
  className,
  trackClassName,
  label,
}: {
  children: React.ReactNode;
  itemClassName?: string;
  dots?: boolean;
  bleed?: boolean;
  overlayDots?: boolean;
  className?: string;
  trackClassName?: string;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const items = Children.toArray(children);

  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 0) return;
    // Last slide can't always reach the snap point; treat the end as final.
    if (el.scrollLeft >= max - 4) {
      setActive(items.length - 1);
      return;
    }
    let best = 0;
    let bestDist = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const c = child as HTMLElement;
      const dist = Math.abs(c.offsetLeft - el.offsetLeft - el.scrollLeft - parseFloat(getComputedStyle(el).paddingLeft || "0"));
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActive(best);
  }, [items.length]);

  useEffect(() => {
    onScroll();
  }, [onScroll]);

  return (
    <div className={cn("relative", className)}>
      <div
        ref={ref}
        onScroll={onScroll}
        role="region"
        aria-label={label}
        className={cn(
          "no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth overscroll-x-contain pb-1",
          bleed ? "-mx-5 scroll-px-5 px-5" : "",
          trackClassName
        )}
      >
        {items.map((child, i) => (
          <div key={i} className={cn("shrink-0 snap-start", itemClassName)}>
            {child}
          </div>
        ))}
      </div>
      {dots && (
        <Dots
          count={items.length}
          active={active}
          tone={overlayDots ? "light" : "dark"}
          className={overlayDots ? "absolute inset-x-0 bottom-4" : "mt-3"}
        />
      )}
    </div>
  );
}
