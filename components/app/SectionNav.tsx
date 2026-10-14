"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface SectionNavItem {
  id: string;
  label: string;
}

/**
 * Sticky chip bar that jumps between sections of a long page and highlights
 * the one currently in view (scroll-spy). Sections must carry the matching
 * `id` and a `scroll-mt-*` offset that clears this bar.
 */
export function SectionNav({
  items,
  variant = "default",
}: {
  items: SectionNavItem[];
  /** "copper" is the squared ivory/copper style used on the Products page. */
  variant?: "default" | "copper";
}) {
  const copper = variant === "copper";
  const [active, setActive] = useState(items[0]?.id);
  const barRef = useRef<HTMLDivElement>(null);

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

  // Keep the active chip visible inside the horizontally scrolling bar.
  useEffect(() => {
    const chip = barRef.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    const bar = barRef.current;
    if (chip && bar) {
      bar.scrollTo({ left: chip.offsetLeft - bar.clientWidth / 2 + chip.clientWidth / 2, behavior: "smooth" });
    }
  }, [active]);

  return (
    <div className={cn("sticky top-0 z-30 -mx-5 px-5 py-2.5 backdrop-blur", copper ? "border-b border-cu/20 bg-ivory/90" : "bg-(--app-bg)/90")}>
      <div ref={barRef} className="no-scrollbar flex gap-2 overflow-x-auto">
        {items.map((it) => (
          <a
            key={it.id}
            data-id={it.id}
            href={`#${it.id}`}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById(it.id);
              if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: "smooth" });
            }}
            className={cn(
              "press shrink-0 px-4 py-2 text-[13px] font-medium transition-colors duration-300",
              copper
                ? cn("rounded-[3px] border", active === it.id ? "border-cu bg-cu text-white" : "border-cu/35 text-ink hover:border-cu")
                : cn("rounded-full", active === it.id ? "bg-brand-dark text-white" : "bg-white text-brand-dark")
            )}
          >
            {it.label}
          </a>
        ))}
      </div>
    </div>
  );
}
