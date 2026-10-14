"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface SectionNavItem {
  id: string;
  label: string;
}

/**
 * Sticky chip bar that jumps between sections of a long page and highlights
 * the one currently in view (scroll-spy). Sections must carry the matching
 * `id` and a `scroll-mt-*` offset that clears this bar.
 *
 * Variants:
 * - "pill" (default): white chips, the active one turns dark.
 * - "minimal": Ather-style tabs. Plain text labels on the page background and a
 *   single dark pill that glides to the active tab. No borders, no extra colour.
 */
export function SectionNav({ items, variant = "pill" }: { items: SectionNavItem[]; variant?: "pill" | "minimal" }) {
  const [active, setActive] = useState(items[0]?.id);
  const barRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    function update() {
      let current = items[0]?.id;
      for (const { id } of items) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.5) current = id;
      }
      setActive(current);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [items]);

  // Keep the active chip visible inside the horizontally scrolling bar, and
  // (minimal variant) move the gliding pill underneath it.
  useLayoutEffect(() => {
    const bar = barRef.current;
    const chip = bar?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!chip || !bar) return;
    bar.scrollTo({ left: chip.offsetLeft - bar.clientWidth / 2 + chip.clientWidth / 2, behavior: "smooth" });
    if (variant === "minimal") setIndicator({ left: chip.offsetLeft, width: chip.offsetWidth });
  }, [active, variant]);

  const minimal = variant === "minimal";

  return (
    <div className="sticky top-0 z-30 -mx-5 bg-(--app-bg)/85 px-5 py-2.5 backdrop-blur-xl">
      <div ref={barRef} className={cn("no-scrollbar relative flex overflow-x-auto", minimal ? "gap-1" : "gap-2")}>
        {minimal && indicator && (
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 rounded-full bg-brand-dark transition-[transform,width] duration-500 ease-(--ease-premium) motion-reduce:transition-none"
            style={{ width: indicator.width, transform: `translateX(${indicator.left}px)` }}
          />
        )}
        {items.map((it) => (
          <a
            key={it.id}
            data-id={it.id}
            href={`#${it.id}`}
            aria-current={active === it.id ? "true" : undefined}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById(it.id);
              if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: "smooth" });
            }}
            className={cn(
              "press relative shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-300",
              minimal
                ? active === it.id
                  ? cn("text-white", !indicator && "bg-brand-dark") // solid until the glider is measured
                  : "text-brand-text-tertiary"
                : active === it.id
                  ? "bg-brand-dark text-white"
                  : "bg-white text-brand-dark"
            )}
          >
            {it.label}
          </a>
        ))}
      </div>
    </div>
  );
}
