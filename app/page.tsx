import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { jakarta } from "@/lib/fonts";
import { FEATURED_CASE_IDS, NOTIFICATIONS } from "@/lib/mock/appContent";
import { BentoHero, type BentoSlide } from "@/components/home/BentoHero";
import { BentoTestimonials, type BentoQuote } from "@/components/home/BentoTestimonials";
import { HomeHeader } from "@/components/home/HomeHeader";
import { FounderMessage } from "@/components/home/FounderMessage";
import { UpcomingEvents } from "@/components/home/sections";

// Two case studies shown as tiles. Facts and links come from the case-study notifications;
// each tile opens the case study itself (the notification's link, in a new tab). The pictures have
// their original lettering erased; the label, title and line are drawn live in the
// app font so every home-page word uses one typeface (`pos` keeps the subject in view).
const CASE_TILES = [
  {
    id: FEATURED_CASE_IDS[0],
    title: "Hot tapping at ONGC NQP",
    note: 'Live 16" pipeline, zero downtime.',
    image: "/images/home/case-hot-tapping-clean.webp",
    pos: "8% 50%",
    alt: "Technician operating a hot tapping machine on a live pipeline at sunset",
  },
  {
    id: FEATURED_CASE_IDS[1],
    title: "SARB leak testing",
    note: 'Nitrogen-helium, 1"–6" piping.',
    image: "/images/home/case-leak-testing-clean.webp",
    pos: "12% 50%",
    alt: "Technician leak testing a flanged pipeline with a pressure gauge at sunset",
  },
].map((t) => {
  const n = NOTIFICATIONS.find((x) => x.id === t.id);
  return { ...t, href: n?.href ?? "/notifications" };
});

export default async function HomePage() {
  // Every slide's headline is live text in the app font; the pictures have had their own lettering erased.
  const heroSlides: BentoSlide[] = [
    {
      image: "/images/home/hero-tsl3.webp",
      imagePosition: "38% center",
      eyebrow: "SINCE 1988",
      lines: ["Precision", "bolting,", "delivered."],
      side: "right",
    },
    {
      image: "/images/home/hero-zero-shutdown-clean.webp",
      imagePosition: "50% 0%",
      lines: ["Zero shutdown", "tapping."],
      side: "left",
      href: "/services/hot-tapping-line-stopping",
    },
    {
      image: "/images/home/hero-precision-bolting-clean.webp",
      imagePosition: "50% 30%",
      lines: ["Precision", "bolting,", "delivered."],
      side: "left",
      href: "/services",
    },
  ];

  const testimonialQuotes: BentoQuote[] = [
    {
      quote: "From refineries to remote pipelines, our tools perform where it matters most.",
      author: "Field Operations, Oil & Gas Sector",
    },
    {
      quote: "Reliable service and world-class support.",
      author: "Maintenance Head, Power Sector",
    },
    {
      quote: "Behind the bolts of India's first vertical-lift sea bridge.",
      author: "The New Pamban Bridge, India",
    },
  ];

  return (
    <div className={`relative min-h-screen bg-[#f3f3f2] px-3.5 pt-safe pb-0 space-y-3 ${jakarta.className}`}>
      {/* Top floating header: wordmark, links, search, menu */}
      <HomeHeader />

      {/* Hero Section */}
      <section aria-label="Hero">
        <BentoHero
          slides={heroSlides}
          primary={{ href: "/products", label: "Explore products" }}
          secondary={{ href: "/services", label: "Our services" }}
        />
      </section>

      {/* Events Carousel replacing Nesaji-Kachchh */}
      <section aria-label="Events and Announcements" className="pt-1">
        <UpcomingEvents />
      </section>

      {/* 2-Column Bento: Flange Fastening & Products */}
      <section aria-label="Case studies" className="grid grid-cols-[1.52fr_1fr] gap-3 sm:gap-3.5">
        {CASE_TILES.map((t, i) => (
          <Link
            key={t.id}
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

      {/* Founder's message. PLACEHOLDER name/role/message: replace with the real ones, and set `photo` (e.g. "/images/home/founder.webp") once the portrait is supplied. */}
      <section aria-label="Founder's message" className="pt-0.5">
        <FounderMessage
          name="Founder Name"
          role="Founder, Tritorc"
          message="Since 1988, we have built Tritorc on one promise: precision you can trust, wherever the job is, keeping your plant safe and on schedule."
        />
      </section>

      {/* Testimonials Bento */}
      <section aria-label="Client Testimonials" className="pt-0.5">
        <BentoTestimonials items={testimonialQuotes} />
      </section>
    </div>
  );
}
