import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { jakarta } from "@/lib/fonts";
import { getFounderMessage, getHomePage } from "@/lib/strapi";
import { BentoHero } from "@/components/home/BentoHero";
import { BentoTestimonials } from "@/components/home/BentoTestimonials";
import { HomeHeader } from "@/components/home/HomeHeader";
import { FounderMessage } from "@/components/home/FounderMessage";
import { UpcomingEvents } from "@/components/home/sections";

// Hero slides, case tiles, quotes and the founder's message are edited in Strapi
// (Home Page and Founder Message); lib/mock/siteContent.ts holds the built-in defaults.
// The case-tile pictures have their original lettering erased; the label, title and
// line are drawn live in the app font so every home-page word uses one typeface
// (`pos` keeps the subject in view).

export default async function HomePage() {
  const [home, founder] = await Promise.all([getHomePage(), getFounderMessage()]);

  return (
    <div className={`relative min-h-screen bg-[#f3f3f2] px-3.5 pt-safe pb-0 space-y-3 ${jakarta.className}`}>
      {/* Top floating header: wordmark, links, search, menu */}
      <HomeHeader />

      {/* Hero Section */}
      <section aria-label="Hero">
        <BentoHero slides={home.heroSlides} primary={home.primary} secondary={home.secondary} />
      </section>

      {/* Events Carousel replacing Nesaji-Kachchh */}
      <section aria-label="Events and Announcements" className="pt-1">
        <UpcomingEvents />
      </section>

      {/* 2-Column Bento: Flange Fastening & Products */}
      <section aria-label="Case studies" className="grid grid-cols-[1.52fr_1fr] gap-3 sm:gap-3.5">
        {home.caseTiles.map((t, i) => (
          <Link
            key={`${t.title}-${i}`}
            href={t.href}
            {...(t.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
            className="group relative flex h-[190px] sm:h-[200px] flex-col justify-between overflow-hidden rounded-[28px] bg-[#f7f6f4] border border-black/5 p-4 shadow-xs transition-all hover:shadow-sm"
          >
            <Image
              src={t.image}
              alt=""
              fill
              sizes="(max-width: 448px) 55vw, 240px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              style={{ objectPosition: t.pos }}
            />
            <span className="sr-only">{t.alt}</span>

            {/* Live text in the app's own typeface (the lettering was removed from the pictures) */}
            <div className="relative z-10">
              <div className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[#4b4b4e]">CASE STUDY</div>
              <h3 className="mt-1.5 text-[20px] font-bold leading-[1.05] tracking-[-0.02em] text-[#0a0a0b] [text-shadow:0_0_10px_rgba(247,246,244,0.85)]">
                {t.title}
              </h3>
              <span aria-hidden className="mt-2 block h-px w-7 bg-neutral-500/70" />
              <p className="mt-2 text-[11.5px] font-semibold leading-snug text-[#1c1c1e] [text-shadow:0_0_6px_rgba(247,246,244,0.95),0_0_12px_rgba(247,246,244,0.8)]">
                {t.note}
              </p>
            </div>

            <span
              className={
                i === 0
                  ? "relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#0f0f10] text-white shadow-[0_8px_20px_-8px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-110"
                  : "relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0f0f10] shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-110"
              }
            >
              <ArrowRight size={16} strokeWidth={2.2} />
            </span>
          </Link>
        ))}
      </section>

      {/* Founder's message (edited in Strapi: Founder Message; the name/role/message there start as placeholders) */}
      <section aria-label="Founder's message" className="pt-0.5">
        <FounderMessage name={founder.name} role={founder.role} message={founder.message} photo={founder.photo} />
      </section>

      {/* Testimonials Bento */}
      <section aria-label="Client Testimonials" className="pt-0.5">
        <BentoTestimonials items={home.quotes} />
      </section>
    </div>
  );
}
