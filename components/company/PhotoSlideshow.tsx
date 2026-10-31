"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
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
  const reduced = useSyncExternalStore(subscribeMotion, getReducedMotion, () => false);

  useEffect(() => {
    if (reduced || slides.length < 2) return;
    const id = setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % slides.length);
    }, holdMs);
    return () => clearInterval(id);
  }, [reduced, slides.length, holdMs]);

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
              transition: `opacity ${fadeMs}ms ease-in-out`,
            }}
          />
        ))}
      </div>
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
        {slides.length > 1 && !reduced && (
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
