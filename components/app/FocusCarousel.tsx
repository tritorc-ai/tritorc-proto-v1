"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import { Dots } from "@/components/app/Carousel";
import { cn } from "@/lib/utils";

const SLIDE_MS = 1000; // time one card takes to glide into the centre
const STEP = 86; // neighbour spacing, as % of a card's own width
const SWIPE_PX = 40;

/**
 * Centre-focus ("coverflow") carousel. The active card sits in the middle at
 * full size; its neighbours are smaller and peek in from each side. Auto-
 * advances, loops seamlessly, and can be swiped or tapped.
 */
export function FocusCarousel({
  children,
  autoPlay = 2600,
  className,
  label,
}: {
  children: React.ReactNode;
  /** Time between moves in ms (the move itself takes SLIDE_MS). */
  autoPlay?: number;
  className?: string;
  label?: string;
}) {
  const items = Children.toArray(children);
  const n = items.length;
  const [pos, setPos] = useState({ active: 0, prev: 0 });
  const active = pos.active;

  const wrapRef = useRef<HTMLDivElement>(null);
  const pausedUntil = useRef(0);
  const visible = useRef(true);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const swiped = useRef(false); // true just after a drag, so its click is ignored

  const go = useCallback(
    (to: number) => setPos((p) => ({ active: ((to % n) + n) % n, prev: p.active })),
    [n]
  );
  const pause = useCallback(() => {
    pausedUntil.current = Date.now() + 6000;
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || n < 2) return;
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    const timer = setInterval(() => {
      if (!visible.current || document.hidden || Date.now() < pausedUntil.current) return;
      setPos((p) => ({ active: (p.active + 1) % n, prev: p.active }));
    }, autoPlay);
    return () => {
      clearInterval(timer);
      io.disconnect();
    };
  }, [autoPlay, n]);

  // Signed distance from the active slide, wrapped to [-n/2, n/2) so the
  // loop is seamless.
  const offsetOf = (i: number, a: number) => {
    const half = Math.floor(n / 2);
    return ((((i - a + half) % n) + n) % n) - half;
  };

  return (
    <div className={cn("relative", className)}>
      <div
        ref={wrapRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        className="relative -mx-5 aspect-[10/9] touch-pan-y select-none overflow-hidden"
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, moved: false };
          pause();
        }}
        onPointerMove={(e) => {
          if (drag.current && Math.abs(e.clientX - drag.current.x) > 8) drag.current.moved = true;
        }}
        onPointerUp={(e) => {
          const d = drag.current;
          drag.current = null;
          if (!d) return;
          const dx = e.clientX - d.x;
          if (d.moved) {
            swiped.current = true;
            setTimeout(() => (swiped.current = false), 80);
          }
          if (Math.abs(dx) > SWIPE_PX) go(active + (dx < 0 ? 1 : -1));
        }}
        onPointerCancel={() => (drag.current = null)}
        onClickCapture={(e) => {
          // A swipe must not count as a tap on the card underneath.
          if (swiped.current) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        {items.map((child, i) => {
          const o = offsetOf(i, active);
          const jumped = Math.abs(o - offsetOf(i, pos.prev)) > 1; // wrapped round the back
          const near = Math.abs(o) <= 1;
          return (
            <div
              key={i}
              aria-hidden={o !== 0}
              className="absolute inset-y-0 left-1/2 w-[72%] motion-reduce:!duration-300"
              style={{
                transform: `translateX(calc(-50% + ${o * STEP}%)) scale(${o === 0 ? 1 : 0.84})`,
                opacity: o === 0 ? 1 : near ? 0.7 : 0,
                zIndex: 10 - Math.abs(o),
                pointerEvents: near ? "auto" : "none",
                transition: jumped
                  ? "none"
                  : `transform ${SLIDE_MS}ms cubic-bezier(0.45, 0, 0.15, 1), opacity ${SLIDE_MS}ms ease`,
              }}
              onClickCapture={(e) => {
                // Tapping a neighbour brings it to the centre instead of opening it.
                if (o !== 0) {
                  e.preventDefault();
                  e.stopPropagation();
                  pause();
                  go(i);
                }
              }}
            >
              {child}
            </div>
          );
        })}
      </div>
      <Dots count={n} active={active} className="mt-3" />
    </div>
  );
}
