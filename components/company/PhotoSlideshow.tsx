"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface Slide {
  src: string;
  /** CSS object-position, to keep the subject in frame when cropping. */
  position?: string;
  /** Short line shown over the photo (top left) while it is on screen. */
  caption?: string;
}

const subscribeMotion = (cb: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Full-bleed photo slideshow: each photo dims out while the next one fades in
 * over it, at an unhurried pace. The photos are decorative (aria-hidden); the
 * caption of the photo on screen is shown at the bottom and changes with it.
 * Pauses while the tab is hidden, and shows only the first photo (and its
 * caption) with reduced motion.
 */
export function PhotoSlideshow({
  slides,
  holdMs = 5200,
  fadeMs = 1600,
  sizes,
}: {
  slides: Slide[];
  holdMs?: number;
  fadeMs?: number;
  sizes?: string;
}) {
  const [index, setIndex] = useState(0);
  // a swiped photo changes faster than the unhurried automatic cross-fade
  const [fade, setFade] = useState(fadeMs);
  const [tick, setTick] = useState(0);
  const reduced = useSyncExternalStore(subscribeMotion, getReducedMotion, () => false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Fixed order, one after the other; the timer restarts after every change, so a swipe gets a full hold.
  useEffect(() => {
    if (reduced || slides.length < 2) return;
    const id = setTimeout(() => {
      if (document.hidden) {
        setTick((t) => t + 1); // tab hidden: stay on this photo and look again later
        return;
      }
      setFade(fadeMs);
      setIndex((i) => (i + 1) % slides.length);
    }, holdMs);
    return () => clearTimeout(id);
  }, [index, tick, reduced, slides.length, holdMs, fadeMs]);

  const go = (step: number) => {
    setFade(500);
    setIndex((i) => (i + step + slides.length) % slides.length);
  };

  return (
    <>
      <div aria-hidden className="absolute inset-0 bg-black">
        {slides.map((s, i) => (
          <Image
            key={s.src}
            src={s.src}
            alt=""
            fill
            priority={i === 0}
            sizes={sizes}
            className="object-cover"
            style={{
              objectPosition: s.position,
              opacity: i === index ? 1 : 0,
              transition: `opacity ${fade}ms ease-in-out`,
            }}
          />
        ))}
      </div>
      {/* Swipe left / right (or drag) to change the photo; a vertical swipe still scrolls the page. */}
      {slides.length > 1 && (
        <div
          aria-hidden
          className="absolute inset-0 z-[5] touch-pan-y select-none"
          onPointerDown={(e) => {
            touchStart.current = { x: e.clientX, y: e.clientY };
          }}
          onPointerUp={(e) => {
            const s = touchStart.current;
            touchStart.current = null;
            if (!s) return;
            const dx = e.clientX - s.x;
            const dy = e.clientY - s.y;
            if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
          }}
          onPointerCancel={() => {
            touchStart.current = null;
          }}
        />
      )}
      {/* The caption of the photo on screen, at the bottom; it slides up as the next photo starts to fade in. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-5 tablet:p-8">
        <div className="min-h-[2.7em]">
          <p
            key={index}
            className="animate-[line-in_900ms_ease-out_both] text-[14px] font-medium leading-snug text-white/80 tablet:text-[20px]"
          >
            {slides[index]?.caption}
          </p>
        </div>
        {slides.length > 1 && (
          <div aria-hidden className="mt-2.5 flex gap-1">
            {slides.map((s, i) => (
              <span
                key={s.src}
                className={cn("h-[3px] rounded-full transition-all duration-700", i === index ? "w-4 bg-white/80" : "w-1 bg-white/25")}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
