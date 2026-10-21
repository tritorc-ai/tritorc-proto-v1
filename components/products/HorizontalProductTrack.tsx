"use client";

import { Children, useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { modeFeatures, useAnimMode } from "@/components/products/AnimationMode";
import { ScrollProgressIndicator } from "@/components/products/ScrollProgressIndicator";
import { cn } from "@/lib/utils";

/** Seconds a card is held before the row advances one step. */
const ADVANCE_MS = 5000;
/** Inactivity required after any user interaction before auto-advance resumes. */
const RESUME_MS = 8000;
/** Duration of one programmatic glide (consistent regardless of distance). */
const GLIDE_MS = 600;
const DRAG_THRESHOLD = 6;

type Metrics = { progress: number; thumb: number; active: number };

const subscribeMotion = (cb: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Scroll offset that puts card `i` at the track's snap point. */
function offsetOf(el: HTMLElement, i: number): number {
  const child = el.children[i] as HTMLElement | undefined;
  if (!child) return el.scrollLeft;
  const pad = parseFloat(getComputedStyle(el).paddingLeft || "0");
  const max = el.scrollWidth - el.clientWidth;
  return Math.min(Math.max(child.offsetLeft - el.offsetLeft - pad, 0), Math.max(max, 0));
}

/** Index of the card whose left edge is closest to the snap point. */
function nearestIndex(el: HTMLElement): number {
  const max = el.scrollWidth - el.clientWidth;
  if (max > 0 && el.scrollLeft >= max - 4) return el.children.length - 1;
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < el.children.length; i++) {
    const dist = Math.abs(offsetOf(el, i) - el.scrollLeft);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  }
  return best;
}

/**
 * Horizontal, momentum-scrolling track of cards.
 *
 * State model
 *  - `paused`  true from any user interaction until RESUME_MS of inactivity.
 *  - `cycle`   bumps on every advance / resume / visibility change, restarting
 *              both the single advance timer and the timer-bar animation.
 *  - `visible` the row is on screen and the tab is foregrounded.
 *  Auto-advance only ever runs when auto && !paused && visible && motion is
 *  allowed, via exactly one timeout per cycle. At the ends the direction
 *  reverses (ping-pong), so it never sweeps back quickly across the row.
 */
export function HorizontalProductTrack({ children, label }: { children: React.ReactNode; label: string }) {
  const mode = useAnimMode();
  const features = modeFeatures(mode);

  const items = Children.toArray(children);
  const n = items.length;

  const ref = useRef<HTMLDivElement>(null);
  const measureFrame = useRef(0);
  const glideFrame = useRef(0);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const direction = useRef<1 | -1>(1);
  const reducedRef = useRef(false);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const visibleRef = useRef(true);

  const [m, setM] = useState<Metrics>({ progress: 0, thumb: 1, active: 0 });
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [visible, setVisible] = useState(true);
  const reduced = useSyncExternalStore(subscribeMotion, getReducedMotion, () => false);

  /* ---------- metrics (drives the position rail + featured card) ---------- */
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
    cancelAnimationFrame(measureFrame.current);
    measureFrame.current = requestAnimationFrame(measure);
  }, [measure]);

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(measureFrame.current);
    };
  }, [measure]);

  /* ---------- programmatic glide (fixed duration, ease-in-out, no bounce) ---------- */
  const cancelGlide = useCallback(() => {
    cancelAnimationFrame(glideFrame.current);
    glideFrame.current = 0;
    if (ref.current) ref.current.style.scrollSnapType = "";
  }, []);

  const glideTo = useCallback(
    (to: number) => {
      const el = ref.current;
      if (!el) return;
      cancelGlide();
      const from = el.scrollLeft;
      const dist = to - from;
      if (Math.abs(dist) < 2) return;
      if (reducedRef.current) {
        el.scrollLeft = to;
        return;
      }
      el.style.scrollSnapType = "none"; // snapping would fight the animation
      const t0 = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / GLIDE_MS);
        el.scrollLeft = from + dist * easeInOutCubic(t);
        if (t < 1) {
          glideFrame.current = requestAnimationFrame(step);
        } else {
          glideFrame.current = 0;
          el.style.scrollSnapType = "";
        }
      };
      glideFrame.current = requestAnimationFrame(step);
    },
    [cancelGlide]
  );

  const stepBy = useCallback(
    (delta: 1 | -1) => {
      const el = ref.current;
      if (!el) return;
      const target = Math.min(n - 1, Math.max(0, nearestIndex(el) + delta));
      glideTo(offsetOf(el, target));
    },
    [glideTo, n]
  );

  /* ---------- user interaction → pause, resume after inactivity ---------- */
  const interact = useCallback(() => {
    cancelGlide();
    setPaused(true);
    clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      setPaused(false);
      setCycle((c) => c + 1);
    }, RESUME_MS);
  }, [cancelGlide]);

  /* ---------- environment: reduced motion, visibility ---------- */
  useEffect(() => {
    reducedRef.current = reduced;
  }, [reduced]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let inView = true;
    const sync = () => {
      const v = inView && !document.hidden;
      if (v === visibleRef.current) return;
      visibleRef.current = v;
      setVisible(v);
      setCycle((c) => c + 1); // restart timer + bar when (re)entering
    };
    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        sync();
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  /* ---------- the one auto-advance timer ---------- */
  const running = features.auto && !paused && visible && !reduced && n > 1;

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => {
      const el = ref.current;
      if (el) {
        const cur = nearestIndex(el);
        if (cur >= n - 1) direction.current = -1;
        else if (cur <= 0) direction.current = 1;
        glideTo(offsetOf(el, cur + direction.current));
      }
      setCycle((c) => c + 1);
    }, ADVANCE_MS);
    return () => clearTimeout(id);
  }, [running, cycle, n, glideTo]);

  useEffect(
    () => () => {
      cancelGlide();
      clearTimeout(resumeTimer.current);
    },
    [cancelGlide]
  );

  /* ---------- mouse dragging (touch/trackpad use native scrolling) ---------- */
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    interact();
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || e.button !== 0) return;
    drag.current = { x: e.clientX, left: el.scrollLeft, moved: false };
    const move = (ev: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      const dx = ev.clientX - d.x;
      if (!d.moved && Math.abs(dx) > DRAG_THRESHOLD) {
        d.moved = true;
        el.style.scrollSnapType = "none";
        el.style.cursor = "grabbing";
      }
      if (d.moved) el.scrollLeft = d.left - dx;
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      const d = drag.current;
      drag.current = null;
      el.style.cursor = "";
      if (d?.moved) {
        suppressClick.current = true;
        setTimeout(() => (suppressClick.current = false), 0);
        glideTo(offsetOf(el, nearestIndex(el))); // settle on the nearest card
      }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    if (e.target !== e.currentTarget) return; // only when the track itself is focused
    e.preventDefault();
    interact();
    stepBy(e.key === "ArrowRight" ? 1 : -1);
  };

  return (
    <div>
      <div
        ref={ref}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={(e) => e.pointerType === "mouse" && !drag.current && interact()}
        onWheel={interact}
        onFocusCapture={interact}
        onKeyDown={onKeyDown}
        onDragStart={(e) => e.preventDefault()}
        onClickCapture={(e) => {
          if (suppressClick.current) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        className="no-scrollbar -mx-5 flex cursor-grab snap-x snap-mandatory items-stretch gap-3 overflow-x-auto overscroll-x-contain scroll-px-5 px-5 pb-1 outline-none focus-visible:ring-2 focus-visible:ring-cu-light focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      >
        {items.map((child, i) => (
          <div
            key={i}
            data-active={features.emphasis && i === m.active}
            className="group/item w-[78%] shrink-0 snap-start"
          >
            {child}
          </div>
        ))}
      </div>

      {features.timerBar && (
        <div className="mt-3 h-[2px] overflow-hidden rounded-full bg-cu/15" aria-hidden>
          {running && (
            <div
              key={cycle}
              className="h-full origin-left rounded-full bg-cu"
              style={{ animation: `timer-fill ${ADVANCE_MS}ms linear forwards` }}
            />
          )}
        </div>
      )}

      <ScrollProgressIndicator
        className={cn(features.timerBar ? "mt-3" : "mt-4")}
        progress={m.progress}
        thumb={m.thumb}
        index={m.active}
        count={n}
      />
    </div>
  );
}
