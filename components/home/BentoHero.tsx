"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BentoSlide {
  eyebrow: string;
  lines: [string, string, string];
  image: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
}

/** Light hero card: big headline on the left, photo fading in from the right. */
export function BentoHero({ slides }: { slides: BentoSlide[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % slides.length), 5000);
    return () => clearTimeout(t);
  }, [active, slides.length]);

  return (
    <div className="relative h-[255px] sm:h-[265px] overflow-hidden rounded-[26px] sm:rounded-[28px] bg-[#f5f5f4] border border-black/5 shadow-xs">
      {slides.map((s, i) => (
        <div
          key={s.eyebrow + i}
          aria-hidden={i !== active}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === active ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          {/* Right side photo */}
          <div className="absolute inset-y-0 right-0 w-[68%]">
            <Image
              src={s.image}
              alt={s.lines.join(" ")}
              fill
              priority={i === 0}
              sizes="(max-width: 448px) 100vw, 448px"
              className="object-cover object-center"
            />
            {/* Soft gradient fading into background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#f5f5f4] via-[#f5f5f4]/70 to-transparent" />
          </div>

          <div className="relative z-10 flex h-full flex-col justify-between p-4.5 sm:p-5">
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-2 font-mono text-[9px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
                {s.eyebrow}
                <span className="h-[1px] w-12 bg-neutral-300" />
              </div>

              {/* Headline */}
              <h1 className="mt-2 text-[26px] sm:text-[28px] font-extrabold leading-[1.04] tracking-[-0.03em] text-[#0f0f10]">
                {s.lines[0]}
                <br />
                {s.lines[1]}
                <br />
                <span className="text-[#8e8e93]">{s.lines[2]}</span>
              </h1>
            </div>

            <div>
              {/* Buttons */}
              <div className="flex items-center gap-2">
                <Link
                  href={s.primary.href}
                  className="press btn-liquid-glass inline-flex h-[34px] items-center gap-1.5 rounded-full px-4 text-[11px] font-semibold text-white"
                >
                  {s.primary.label}
                  <ArrowRight size={12} />
                </Link>
                <Link
                  href={s.secondary.href}
                  className="press btn-liquid-glass-clear inline-flex h-[34px] items-center justify-center rounded-full px-4 text-[11px] font-semibold text-neutral-900"
                >
                  {s.secondary.label}
                </Link>
              </div>

              {/* Dots */}
              <div className="mt-3 flex items-center gap-1.5">
                {slides.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    aria-label={`Show slide ${dotIdx + 1}`}
                    onClick={() => setActive(dotIdx)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      dotIdx === active ? "w-1.5 bg-[#0f0f10]" : "w-1.5 bg-neutral-300 hover:bg-neutral-400",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
