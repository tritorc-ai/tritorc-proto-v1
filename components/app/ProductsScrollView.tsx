"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/mock/content";

export interface ScrollSection {
  name: string;
  color: string;
  products: (Product & { imageUrl?: string })[];
}

// A few product types share one real photo (no dedicated shot exists for
// each specific sub-item in the media library — verified by direct search).
// Rather than show the exact same crop stacked back-to-back, each repeat
// of the same image gets a different zoom/pan so the cards read as
// distinct compositions of the same real, accurate photo.
const CROP_VARIANTS = [
  { objectPosition: "50% 50%", scale: 1 },
  { objectPosition: "20% 30%", scale: 1.6 },
  { objectPosition: "80% 70%", scale: 1.5 },
  { objectPosition: "70% 20%", scale: 1.7 },
];

export function ProductsScrollView({ sections }: { sections: ScrollSection[] }) {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Measured, not guessed: the page header's height varies with viewport
  // width (its subtitle can wrap to a 2nd line on narrow screens), so a
  // hardcoded pixel offset silently drifts out of sync and either overlaps
  // the header or leaves a gap. Measure the real header height at runtime.
  const [topOffset, setTopOffset] = useState(122);

  useEffect(() => {
    function measure() {
      const header = document.querySelector<HTMLElement>(".sticky.top-0");
      setTopOffset(Math.round(header?.getBoundingClientRect().height ?? 122));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const totalProducts = useMemo(
    () => sections.reduce((sum, s) => sum + s.products.length, 0),
    [sections]
  );

  useEffect(() => {
    // Two independent sticky headers handing off to one another always
    // leaves a brief window where neither is definitively "the" active one
    // (one has just released, the next hasn't reached its own lock point
    // yet) — mathematically each one's own position tracks perfectly, but
    // the handoff between two separate elements still reads as unstable.
    // A single persistent header avoids that entirely: only one element
    // ever exists, so there's nothing to hand off between.
    //
    // IntersectionObserver (not a scroll+setTimeout poll) drives which
    // section is "active" here — it's event-driven off the browser's own
    // layout/paint pipeline, the same one position:sticky itself uses, so
    // it can't be starved by JS timer throttling the way a polled listener
    // can. Multiple thresholds just give it plenty of chances to refire as
    // each section crosses the viewport; the actual index is still decided
    // by the same reliable position check every time it fires.
    function updateActiveSection() {
      let newIndex = 0;
      for (let i = 0; i < sectionRefs.current.length; i++) {
        const el = sectionRefs.current[i];
        if (!el) continue;
        if (el.getBoundingClientRect().top <= topOffset + 1) {
          newIndex = i;
        }
      }
      setActiveIndex(newIndex);
    }

    const observer = new IntersectionObserver(updateActiveSection, {
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1],
    });
    for (const el of sectionRefs.current) {
      if (el) observer.observe(el);
    }
    updateActiveSection();
    return () => observer.disconnect();
  }, [sections, topOffset]);

  function scrollToSection(i: number) {
    sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const active = sections[activeIndex];

  return (
    <div className="relative">
      {/* Single persistent sticky category header — see the effect above
          for why this reads more stable than per-section sticky headers. */}
      <div
        className="sticky z-10 -mx-5 mb-3 bg-brand-surface px-5 py-2"
        style={{ top: topOffset }}
      >
        <div
          key={activeIndex}
          className="flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <div className="h-6 w-1 shrink-0 rounded-sm" style={{ background: active?.color }} />
          <div className="text-[19px] font-bold leading-tight text-brand-dark">{active?.name}</div>
        </div>
      </div>

      {/* Color-coded scroll rail */}
      <div className="fixed right-1.5 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-[3px]">
        {sections.map((s, i) => {
          const heightPx = Math.max(14, (s.products.length / totalProducts) * 220);
          const isActive = i === activeIndex;
          return (
            <button
              key={s.name}
              aria-label={`Jump to ${s.name}`}
              onClick={() => scrollToSection(i)}
              className="rounded-full transition-all"
              style={{
                width: isActive ? 6 : 4,
                height: heightPx,
                background: s.color,
                opacity: isActive ? 1 : 0.35,
              }}
            />
          );
        })}
      </div>

      {sections.map((section, i) => (
        <div
          key={section.name}
          ref={(el) => {
            sectionRefs.current[i] = el;
          }}
          className="mt-7 first:mt-0"
          style={{ scrollMarginTop: topOffset }}
        >
          <div className="grid grid-cols-2 gap-3">
            {(() => {
              const seenCount = new Map<string, number>();
              return section.products.map((p) => {
                let variant = CROP_VARIANTS[0];
                if (p.imageUrl) {
                  const count = seenCount.get(p.imageUrl) ?? 0;
                  seenCount.set(p.imageUrl, count + 1);
                  variant = CROP_VARIANTS[count % CROP_VARIANTS.length];
                }
                return (
                  <Link
                    key={p.slug}
                    href={`/products/${p.slug}`}
                    className="flex flex-col overflow-hidden rounded-2xl border border-black/6 bg-white shadow-[0_1px_2px_rgba(0,0,0,.03),0_8px_18px_rgba(0,0,0,.06)]"
                  >
                    <div className="relative aspect-square w-full overflow-hidden bg-brand-surface">
                      {p.imageUrl ? (
                        <Image
                          src={p.imageUrl}
                          alt=""
                          fill
                          sizes="50vw"
                          className="object-cover"
                          style={{
                            objectPosition: variant.objectPosition,
                            transform: `scale(${variant.scale})`,
                          }}
                        />
                      ) : (
                        <div className="h-full w-full bg-[repeating-linear-gradient(135deg,#eef0f2_0px,#eef0f2_8px,#e3e7ea_8px,#e3e7ea_16px)]" />
                      )}
                      <div className="absolute inset-x-0 bottom-0 h-1" style={{ background: section.color }} />
                    </div>
                    <div className="flex flex-1 flex-col gap-1.5 p-3">
                      <div className="text-[13px] font-semibold leading-snug text-brand-dark">
                        {p.name}
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="font-mono text-[11px] text-brand-text-secondary">
                          {p.series}
                        </div>
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-surface text-brand-red">
                          ›
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              });
            })()}
          </div>
        </div>
      ))}
    </div>
  );
}
