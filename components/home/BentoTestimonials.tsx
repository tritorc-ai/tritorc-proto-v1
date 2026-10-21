"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Quote, Users, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BentoQuote {
  quote: string;
  author: string;
}

function useCountUp(target: number, duration: number = 1400, start: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    let frameId: number;

    const step = (now: number) => {
      if (!startTime) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      // Smooth deceleration curve
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * target));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration, start]);

  return count;
}

/** Dark "What clients say" & impact panel: auto-scrolls every 1.5s, stats slide first */
export function BentoTestimonials({ items }: { items: BentoQuote[] }) {
  const [i, setI] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  // Total slides: Slide 0 (Stats), Slide 1 (First Testimonials), Slide 2 (Second Testimonials)
  const totalSlides = 3;
  const go = (d: number) => setI((a) => (a + d + totalSlides) % totalSlides);

  // Auto-scroll every 1.5 seconds (1500ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setI((prev) => (prev + 1) % totalSlides);
    }, 1500);

    return () => clearInterval(timer);
  }, [totalSlides]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Animate stats as soon as the section scrolls into view
  const customersCount = useCountUp(100, 1400, inView);
  const servicesCount = useCountUp(120, 1400, inView);

  // Testimonial quote sets
  const quoteSlides = [
    [
      items[0] || {
        quote: "From refineries to remote pipelines, our tools perform where it matters most.",
        author: "Field Operations, Oil & Gas Sector",
      },
      items[1] || {
        quote: "Reliable service and world-class support.",
        author: "Maintenance Head, Power Sector",
      },
    ],
    [
      items[1] || {
        quote: "Reliable service and world-class support.",
        author: "Maintenance Head, Power Sector",
      },
      items[2] || {
        quote: "Behind the bolts of India's first vertical-lift sea bridge.",
        author: "The New Pamban Bridge, India",
      },
    ],
  ];

  return (
    <section
      ref={sectionRef}
      className="rounded-[32px] bg-[#111112] p-5 text-white shadow-[0_14px_30px_-16px_rgba(0,0,0,0.6)]"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-bold tracking-tight">
          {i === 0 ? "Proven Track Record" : "What clients say"}
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(-1)}
            className="press flex h-8 w-8 items-center justify-center rounded-full border border-white/20 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={14} />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(1)}
            className="press flex h-8 w-8 items-center justify-center rounded-full border border-white/20 hover:bg-white/10 transition-colors"
          >
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <div className="mt-4">
        {/* Slide 0: Animated Stats (First Slide) */}
        {i === 0 ? (
          <div className="grid grid-cols-2 gap-3 transition-opacity duration-300 items-stretch">
            {/* Stat 1: 100+ Happy Customers */}
            <div className="flex h-[185px] w-full flex-col justify-between rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center justify-between">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e11d24] text-white">
                  <Users size={13} />
                </span>
                <span className="text-[9.5px] font-mono uppercase tracking-wider text-white/40">
                  Global
                </span>
              </div>
              <div className="my-auto py-1">
                <div className="text-[34px] sm:text-[38px] font-extrabold leading-none tracking-tight text-white font-mono">
                  {customersCount}+
                </div>
                <div className="mt-1.5 text-[12.5px] font-semibold text-white/95">
                  Happy Customers
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-white/55">
                <span className="h-px w-5 shrink-0 bg-[#e11d24]" />
                <span className="line-clamp-1">Across 30+ countries</span>
              </div>
            </div>

            {/* Stat 2: 120+ Services Provided */}
            <div className="flex h-[185px] w-full flex-col justify-between rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center justify-between">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e11d24] text-white">
                  <Wrench size={13} />
                </span>
                <span className="text-[9.5px] font-mono uppercase tracking-wider text-white/40">
                  Operations
                </span>
              </div>
              <div className="my-auto py-1">
                <div className="text-[34px] sm:text-[38px] font-extrabold leading-none tracking-tight text-white font-mono">
                  {servicesCount}+
                </div>
                <div className="mt-1.5 text-[12.5px] font-semibold text-white/95">
                  Services Provided
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-white/55">
                <span className="h-px w-5 shrink-0 bg-[#e11d24]" />
                <span className="line-clamp-1">Zero downtime delivery</span>
              </div>
            </div>
          </div>
        ) : (
          /* Slide 1 & 2: Testimonials Quotes */
          <div className="grid grid-cols-2 gap-3 transition-opacity duration-300 items-stretch">
            {quoteSlides[i - 1].map((t, idx) => (
              <figure
                key={`${i}-${idx}`}
                className="flex h-[185px] w-full flex-col justify-between rounded-[22px] border border-white/10 bg-white/[0.04] p-4"
              >
                <div>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e11d24] text-white">
                    <Quote size={12} fill="currentColor" />
                  </span>
                  <blockquote className="mt-3 text-[12.5px] font-medium leading-snug text-white/95">
                    {t.quote}
                  </blockquote>
                </div>
                <figcaption className="mt-3 flex items-center gap-2 text-[10px] text-white/55">
                  <span className="h-px w-5 shrink-0 bg-[#e11d24]" />
                  <span className="line-clamp-2">{t.author}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Dots (3 dots) */}
      <div className="mt-4 flex items-center justify-center gap-1.5">
        {[0, 1, 2].map((d) => (
          <button
            key={d}
            type="button"
            aria-label={`Show slide ${d + 1}`}
            onClick={() => setI(d)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              d === i ? "w-4 bg-white" : "w-1.5 bg-white/30",
            )}
          />
        ))}
      </div>
    </section>
  );
}
