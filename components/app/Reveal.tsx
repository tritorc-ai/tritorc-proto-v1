"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Fades and lifts its children in the first time they scroll into view.
 *
 * Content is visible from the first paint: the server HTML carries no hidden
 * state, so a slow script load can never leave a blank page. Only sections that
 * start below the fold are "armed" (hidden) once the script runs, and they ease
 * in when scrolled to. Also visible immediately when reduced motion is requested
 * or IntersectionObserver is unavailable.
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section";
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    // Already on screen at load: leave it visible, no animation, no flash.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    setArmed(true);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      id={id}
      data-armed={armed || undefined}
      data-shown={shown || undefined}
      className={cn("reveal", className)}
    >
      {children}
    </Tag>
  );
}
