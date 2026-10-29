"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * One hero slide: a photo with the headline drawn live in the app font (so the
 * whole home page uses a single typeface). The last line is set in grey.
 */
export interface BentoSlide {
  image: string;
  /** CSS object-position for the photo inside the frame. */
  imagePosition?: string;
  /** Small caps line above the headline (optional). */
  eyebrow?: string;
  /** Headline lines; the last one is grey. */
  lines: string[];
  /** Which side of the photo the headline sits on (put it over the quiet part of the picture). */
  side: "left" | "right";
  /** Makes the whole slide tappable (optional). */
  href?: string;
}

interface HeroLink {
  href: string;
  label: string;
}

/** Every slide shares this 16:9 frame, so the card never changes height. */
const FRAME_RATIO = "aspect-[165/100] md:aspect-[2/1] lg:aspect-[5/2]";

/**
 * Hero card: one 16:9 frame. The buttons and dots sit on the photo in a fixed
 * overlay, so they stay visible and working whichever slide is showing. No
 * fades or gradients: photos are fully opaque and slides swap instantly.
 */
export function BentoHero({
  slides,
  primary,
  secondary,
}: {
  slides: BentoSlide[];
  primary: HeroLink;
  secondary: HeroLink;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % slides.length), 5000);
    return () => clearTimeout(t);
  }, [active, slides.length]);

  return (
    <div className="overflow-hidden rounded-[26px] sm:rounded-[28px] bg-[#f5f5f4] border border-black/5 shadow-xs">
      <div className={cn("relative overflow-hidden", FRAME_RATIO)}>
        {slides.map((s, i) => {
          const shown = i === active;
          return (
            <div
              key={`${s.image}-${i}`}
              aria-hidden={!shown}
              className={cn("absolute inset-0", shown ? "opacity-100" : "pointer-events-none opacity-0")}
            >
              <Image
                src={s.image}
                alt=""
                fill
                priority={i === 0}
                sizes="(max-width: 448px) 100vw, (max-width: 1024px) 92vw, 1100px"
                className="object-cover"
                style={{ objectPosition: s.imagePosition ?? "center" }}
              />

              {s.href && (
                <Link
                  href={s.href}
                  aria-label={s.lines.join(" ")}
                  tabIndex={shown ? 0 : -1}
                  className="press absolute inset-0 z-10"
                />
              )}
              <div
                className={cn(
                  "pointer-events-none relative z-10 flex h-full flex-col p-4 sm:p-4.5 md:p-8",
                  s.side === "right" ? "items-end text-right" : "items-start text-left",
                )}
              >
                {s.eyebrow && (
                  <div
                    className={cn(
                      "flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-neutral-500",
                      s.side === "right" && "justify-end",
                    )}
                  >
                    {s.side === "right" && <span className="h-[1px] w-12 bg-neutral-400" />}
                    {s.eyebrow}
                    {s.side === "left" && <span className="h-[1px] w-12 bg-neutral-400" />}
                  </div>
                )}
                <h1 className="mt-1.5 text-[27px] font-bold leading-[1.05] tracking-[-0.025em] text-[#0f0f10] sm:text-[29px] md:text-[44px] lg:text-[52px]">
                  {s.lines.map((line, li) => (
                    <span key={li} className={cn("block", li === s.lines.length - 1 && "text-[#6b6b70]")}>
                      {line}
                    </span>
                  ))}
                </h1>
              </div>
            </div>
          );
        })}

        {/* Fixed controls on top of the photo: same buttons and dots on every slide, bottom-left */}
        <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-start gap-2 p-3 md:gap-3 md:p-6">
          <div className="flex items-center gap-2">
            <Link
              href={primary.href}
              className="press inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#1a1a1c]/90 px-3.5 text-[12px] font-semibold text-white md:h-11 md:px-5 md:text-[14px] shadow-[0_8px_22px_-10px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-md"
            >
              {primary.label}
              <ArrowRight size={12} />
            </Link>
            <Link
              href={secondary.href}
              className="press inline-flex h-9 items-center justify-center whitespace-nowrap rounded-full bg-white/60 px-3.5 text-[12px] font-semibold text-[#0f0f10] md:h-11 md:px-5 md:text-[14px] shadow-[0_8px_22px_-10px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-md"
            >
              {secondary.label}
            </Link>
          </div>

          <div className="flex items-center rounded-full bg-black/25 px-1.5 backdrop-blur-md">
            {slides.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                aria-label={`Show slide ${dotIdx + 1}`}
                aria-current={dotIdx === active}
                onClick={() => setActive(dotIdx)}
                className="flex h-5 w-3 items-center justify-center"
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-colors duration-300",
                    dotIdx === active ? "bg-white" : "bg-white/55 hover:bg-white/80",
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
