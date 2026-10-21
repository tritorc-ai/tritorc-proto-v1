"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";

export interface Slide {
  src: string;
  /** CSS object-position, to keep the subject in frame when cropping. */
  position?: string;
}

const subscribeMotion = (cb: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Full-bleed photo slideshow: each photo dims out while the next one fades in
 * over it, at an unhurried pace. Decorative (aria-hidden). Pauses while the tab
 * is hidden, and shows only the first photo with reduced motion.
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
  );
}
