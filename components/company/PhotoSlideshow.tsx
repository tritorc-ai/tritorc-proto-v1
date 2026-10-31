"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";

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
 * over it, at an unhurried pace. The photos are decorative (aria-hidden); a
 * photo's caption fades in and out with it. Pauses while the tab is hidden, and
 * shows only the first photo (and its caption) with reduced motion.
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
      {slides.map((s, i) =>
        s.caption ? (
          <p
            key={s.src}
            aria-hidden={i !== index}
            className="pointer-events-none absolute left-4 top-4 z-10 flex max-w-[15.5rem] items-start gap-2 rounded-2xl bg-black/55 px-3 py-2 text-[12.5px] font-semibold leading-snug text-white ring-1 ring-white/15 tablet:left-6 tablet:top-6 tablet:max-w-[calc(100%-3rem)] tablet:gap-2.5 tablet:px-4 tablet:py-2.5 tablet:text-[15px]"
            style={{ opacity: i === index ? 1 : 0, transition: `opacity ${fadeMs}ms ease-in-out` }}
          >
            <span aria-hidden className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red-bright tablet:mt-[7px] tablet:h-2 tablet:w-2" />
            {s.caption}
          </p>
        ) : null,
      )}
    </>
  );
}
