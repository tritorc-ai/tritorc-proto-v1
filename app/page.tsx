import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bell } from "lucide-react";
import { BentoHero } from "@/components/home/BentoHero";
import { BentoTestimonials, type BentoQuote } from "@/components/home/BentoTestimonials";
import { UpcomingEvents } from "@/components/home/sections";

export default async function HomePage() {
  const heroSlides = [
    {
      eyebrow: "SINCE 1988",
      lines: ["Precision", "bolting,", "delivered."] as [string, string, string],
      image: "/images/home/hero-bolting.jpg",
      primary: { href: "/products", label: "Explore products" },
      secondary: { href: "/services", label: "Our services" },
    },
    {
      eyebrow: "SINCE 1988",
      lines: ["Power for", "wind &", "energy."] as [string, string, string],
      image: "/images/home/hero-bolting.jpg",
      primary: { href: "/products", label: "Explore products" },
      secondary: { href: "/services", label: "Our services" },
    },
    {
      eyebrow: "SINCE 1988",
      lines: ["Zero downtime.", "Bolting,", "delivered."] as [string, string, string],
      image: "/images/home/hero-bolting.jpg",
      primary: { href: "/products", label: "Explore products" },
      secondary: { href: "/services", label: "Our services" },
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
    <div className="relative min-h-screen bg-[#f3f3f2] px-3.5 pt-safe pb-0 space-y-3">
      {/* Top Floating Header */}
      <header className="flex items-center justify-between rounded-full bg-white px-4 py-2.5 shadow-sm border border-black/5">
        <Link href="/" aria-label="Tritorc home" className="press flex items-center">
          <span className="text-[17px] font-black tracking-[-0.03em] text-black">TRITORC</span>
        </Link>

        {/* Notification Bell linking to Events page */}
        <Link
          href="/events"
          aria-label="Events and Notifications"
          className="press relative flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-800 hover:bg-neutral-200 transition-colors"
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#e11d24] ring-2 ring-white" />
        </Link>
      </header>

      {/* Hero Section */}
      <section aria-label="Hero">
        <BentoHero slides={heroSlides} />
      </section>

      {/* Events Carousel replacing Nesaji-Kachchh */}
      <section aria-label="Events and Announcements" className="pt-1">
        <UpcomingEvents />
      </section>

      {/* 2-Column Bento: Flange Fastening & Products */}
      <section aria-label="Services and Products" className="grid grid-cols-2 gap-3 sm:gap-3.5">
        {/* Left: Flange Fastening */}
        <Link
          href="/services/flange-facing"
          className="group relative flex h-[280px] sm:h-[290px] flex-col justify-between overflow-hidden rounded-[32px] bg-[#f7f6f4] border border-black/5 p-5 shadow-xs transition-all hover:shadow-sm"
        >
          {/* Background image & gradient overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <Image
              src="/images/home/flange-fasting.jpg"
              alt="Flange Fastening"
              fill
              sizes="(max-width: 448px) 50vw, 220px"
              className="object-cover object-[70%_center] group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#f7f6f4] via-[#f7f6f4]/90 via-45% to-transparent" />
          </div>

          <div className="relative z-10">
            <div className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-[#4b4b4e]">
              TRITORC SERVICES
            </div>
            <h3 className="mt-2 text-[27px] sm:text-[29px] font-black leading-[0.98] tracking-[-0.035em] text-[#0a0a0b]">
              Flange<br />Fastening
            </h3>
            <p className="mt-3 text-[13.5px] font-medium leading-[1.3] text-[#444447]">
              On-site bolting<br />solutions.
            </p>
          </div>

          <div className="relative z-10 mt-auto">
            <div className="press flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white text-black border border-black/15 shadow-[0_8px_22px_rgba(0,0,0,0.18),0_2px_6px_rgba(0,0,0,0.12)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_10px_28px_rgba(0,0,0,0.24)]">
              <ArrowRight size={18} strokeWidth={2.4} />
            </div>
          </div>
        </Link>

        {/* Right: Products */}
        <Link
          href="/products"
          className="group relative flex h-[280px] sm:h-[290px] flex-col justify-between overflow-hidden rounded-[32px] bg-[#f7f6f4] border border-black/5 p-5 shadow-xs transition-all hover:shadow-sm"
        >
          {/* Background image & gradient overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <Image
              src="/images/home/products-bolt.jpg"
              alt="Industrial Products"
              fill
              sizes="(max-width: 448px) 50vw, 220px"
              className="object-cover object-right group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#f7f6f4] via-[#f7f6f4]/90 via-45% to-transparent" />
          </div>

          <div className="relative z-10">
            <div className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-[#4b4b4e]">
              TRITORC PRODUCTS
            </div>
            <h3 className="mt-2 text-[27px] sm:text-[29px] font-black leading-[0.98] tracking-[-0.035em] text-[#0a0a0b]">
              Products
            </h3>
            <p className="mt-3 text-[13.5px] font-medium leading-[1.3] text-[#444447]">
              Industrial bolting<br />solutions.
            </p>
          </div>

          <div className="relative z-10 mt-auto">
            <div className="press flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white text-black border border-black/15 shadow-[0_8px_22px_rgba(0,0,0,0.18),0_2px_6px_rgba(0,0,0,0.12)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_10px_28px_rgba(0,0,0,0.24)]">
              <ArrowRight size={18} strokeWidth={2.4} />
            </div>
          </div>
        </Link>
      </section>

      {/* Testimonials Bento */}
      <section aria-label="Client Testimonials" className="pt-0.5">
        <BentoTestimonials items={testimonialQuotes} />
      </section>
    </div>
  );
}
