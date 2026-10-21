"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, CalendarDays, ChevronRight } from "lucide-react";
import type { TickerItem } from "@/lib/mock/appContent";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 4000;
const SWIPE_PX = 28;

const POSITIONS = {
  front: { transform: "translateY(0) scale(1)", opacity: 1, zIndex: 30 },
  below: { transform: "translateY(30px) scale(0.95)", opacity: 1, zIndex: 20 },
  above: { transform: "translateY(-30px) scale(0.95)", opacity: 1, zIndex: 20 },
  hidden: { transform: "translateY(0) scale(0.88)", opacity: 0, zIndex: 10 },
} as const;

/**
 * Notification-style deck: the front card sits in the middle with the previous
 * card peeking out above and the next one below. It rolls on a timer, and the
 * user can swipe vertically, tap a peeking card or use the dots.
 */
export function EventTicker({ events }: { events: TickerItem[] }) {
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const count = events.length;
  const startY = useRef<number | null>(null);
  const swiped = useRef(false);

  const step = (dir: 1 | -1) => setActive((a) => (a + dir + count) % count);

  // Restarts whenever the active card changes, so a manual change gets a full
  // interval before the next automatic roll.
  useEffect(() => {
    if (count < 2 || held) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % count), INTERVAL_MS);
    return () => clearTimeout(t);
  }, [active, count, held]);

  const release = (y: number) => {
    if (startY.current !== null) {
      const dy = y - startY.current;
      if (Math.abs(dy) > SWIPE_PX) {
        swiped.current = true;
        step(dy < 0 ? 1 : -1); // swipe up -> next, swipe down -> previous
      }
    }
    startY.current = null;
    setHeld(false);
  };

  return (
    <div>
      <div className="relative">
        <div
          className="grid touch-pan-x px-1 py-9 select-none"
          onPointerDown={(e) => {
            startY.current = e.clientY;
            swiped.current = false;
            setHeld(true);
          }}
          onPointerUp={(e) => release(e.clientY)}
          onPointerCancel={() => {
            startY.current = null;
            setHeld(false);
          }}
          onClickCapture={(e) => {
            if (swiped.current) {
              e.preventDefault();
              e.stopPropagation();
              swiped.current = false;
            }
          }}
        >
          {events.map((e, i) => {
            const offset = (i - active + count) % count;
            const position =
              offset === 0 ? "front" : offset === 1 ? "below" : offset === count - 1 ? "above" : "hidden";
            const front = position === "front";
            const external = e.href.startsWith("http");
            const Icon = e.label === "Upcoming event" ? CalendarDays : Bell;
            return (
              <Link
                key={e.id}
                href={e.href}
                {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                draggable={false}
                aria-hidden={position === "hidden"}
                tabIndex={front ? 0 : -1}
                onClick={(ev) => {
                  if (front) return;
                  ev.preventDefault();
                  setActive(i);
                }}
                style={{ gridArea: "1 / 1", ...POSITIONS[position] }}
                className={cn(
                  "flex items-center justify-between gap-4 rounded-[26px] bg-[#e4e5e7] px-5 py-4 ring-1 ring-white/70",
                  "transition-[transform,opacity,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  front ? "shadow-[0_10px_24px_-8px_rgba(0,0,0,0.22)]" : "shadow-sm",
                  position === "hidden" && "pointer-events-none",
                )}
              >
                <span
                  className={cn(
                    "min-w-0 transition-[opacity,filter] duration-500",
                    !front && "opacity-50 blur-[6px]",
                  )}
                >
                  <span className="flex items-center gap-2 text-[13px] text-brand-text-secondary">
                    <Icon size={15} />
                    {e.label}
                  </span>
                  <span className="mt-1.5 line-clamp-2 block text-[16px] font-semibold leading-snug text-brand-dark">
                    {e.title}
                  </span>
                </span>
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-brand-dark transition-opacity duration-500",
                    !front && "opacity-0",
                  )}
                >
                  <ChevronRight size={18} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
      {count > 1 && (
        <div className="flex items-center justify-center gap-1.5 -mt-3">
          {events.map((e, i) => (
            <button
              key={e.id}
              type="button"
              aria-label={`Show notification ${i + 1} of ${count}`}
              aria-current={i === active}
              onClick={() => setActive(i)}
              className="flex h-4 items-center"
            >
              <span
                className={cn(
                  "h-1 rounded-full transition-all duration-500",
                  i === active ? "w-4 bg-brand-red" : "w-1.5 bg-black/20",
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
