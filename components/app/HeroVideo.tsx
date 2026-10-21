"use client";

import { useEffect, useRef } from "react";

/**
 * Muted, looping, inline clip that fills its positioned parent. The poster
 * shows until playback starts, and stays if autoplay is blocked or the user
 * prefers reduced motion.
 */
export function HeroVideo({ src, poster, label }: { src: string; poster?: string; label?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // React does not reliably reflect the `muted` attribute, and browsers only
    // autoplay muted video, so set the property before playing.
    v.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.play().catch(() => {
      // autoplay blocked (e.g. data saver): the poster stays visible
    });
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="auto"
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}
