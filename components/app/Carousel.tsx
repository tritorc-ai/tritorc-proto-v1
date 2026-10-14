"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Ather-style pill pagination: the active dot stretches into a bar. */
export function Dots({
  count,
  active,
  tone = "dark",
  accent,
  className,
}: {
  count: number;
  active: number;
  tone?: "dark" | "light";
  /** Optional colour for the active pill (e.g. a section accent). */
  accent?: string;
  className?: string;
}) {
  if (count < 2) return null;
  return (
    <div className={cn("flex items-center justify-center gap-1.5", className)} aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          style={accent && i === active ? { background: accent } : undefined}
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

/** Index of the slide whose left edge is nearest the track's snap point. */
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
  dotsTone = "dark",
  className,
  trackClassName,
  label,
  autoPlay,
  accent,
  focusScale = false,
}: {
  children: React.ReactNode;
  itemClassName?: string;
  dots?: boolean;
  bleed?: boolean;
  overlayDots?: boolean;
  /** Dot colour when not overlaid: "light" for dark backgrounds. */
  dotsTone?: "dark" | "light";
  className?: string;
  trackClassName?: string;
  label?: string;
  /** Advance every N ms, looping; pauses on touch and while off-screen. */
  autoPlay?: number;
  /** Colour for the active pagination pill. */
  accent?: string;
  /** Ather-style depth: slides ease down in scale/opacity as they move off the snap point. */
  focusScale?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const items = Children.toArray(children);

  const frame = useRef(0);

  const applyFocus = useCallback(() => {
    const el = ref.current;
    if (!el || !focusScale) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const pad = parseFloat(getComputedStyle(el).paddingLeft || "0");
    Array.from(el.children).forEach((child) => {
      const c = child as HTMLElement;
      const offset = c.offsetLeft - el.offsetLeft - pad - el.scrollLeft;
      const t = Math.min(1, Math.abs(offset) / (c.clientWidth || 1));
      const inner = c.firstElementChild as HTMLElement | null;
      if (!inner) return;
      inner.style.transform = `scale(${1 - 0.05 * t})`;
      inner.style.opacity = String(1 - 0.2 * t);
    });
  }, [focusScale]);

  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (focusScale) {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(applyFocus);
    }
    setActive(nearestIndex(el));
  }, [focusScale, applyFocus]);

  useEffect(() => {
    onScroll();
    return () => cancelAnimationFrame(frame.current);
  }, [onScroll]);

  const pausedUntil = useRef(0);
  const visible = useRef(true);

  useEffect(() => {
    const el = ref.current;
    if (!autoPlay || !el || items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pause = () => {
      pausedUntil.current = Date.now() + 7000;
    };
    el.addEventListener("pointerdown", pause);
    el.addEventListener("wheel", pause, { passive: true });
    el.addEventListener("focusin", pause);
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0.5 });
    io.observe(el);

    const timer = setInterval(() => {
      if (!visible.current || document.hidden || Date.now() < pausedUntil.current) return;
      const next = (nearestIndex(el) + 1) % items.length;
      const child = el.children[next] as HTMLElement | undefined;
      if (!child) return;
      const pad = parseFloat(getComputedStyle(el).paddingLeft || "0");
      el.scrollTo({ left: child.offsetLeft - el.offsetLeft - pad, behavior: "smooth" });
    }, autoPlay);

    return () => {
      clearInterval(timer);
      io.disconnect();
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("wheel", pause);
      el.removeEventListener("focusin", pause);
    };
  }, [autoPlay, items.length]);

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
            {focusScale ? (
              <div className="h-full origin-left transition-[transform,opacity] duration-150 ease-out will-change-transform">
                {child}
              </div>
            ) : (
              child
            )}
          </div>
        ))}
      </div>
      {dots && (
        <Dots
          count={items.length}
          active={active}
          accent={accent}
          tone={overlayDots ? "light" : dotsTone}
          className={overlayDots ? "absolute inset-x-0 bottom-4" : "mt-3"}
        />
      )}
    </div>
  );
}
