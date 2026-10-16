import Image from "next/image";
import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { getBrand, getImageUrls, getServices, getTestimonials } from "@/lib/strapi";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ClientVoices, ServiceShowcase, UpcomingEvents } from "@/components/home/sections";

// Home is a short, image-led introduction: hero → event → services →
// contact. Everything detailed (credentials, case studies, industries,
// journey, the full catalogue) lives behind the bottom-nav tabs.

// Carousel-only service renders.
const SERVICE_IMAGES: Record<string, string> = {
  "hot-tapping-line-stopping": "/services/hot-tapping.webp",
  "flange-facing": "/services/flange-facing.webp",
  "onsite-controlled-bolting": "/services/controlled-bolting.webp",
};

const FEATURED_SERVICES = [
  "hot-tapping-line-stopping",
  "flange-facing",
  "onsite-controlled-bolting",
  "hydro-testing-services",
  "retubing-services",
  "pipe-freezing",
];

export default async function HomePage() {
  const [brand, services, testimonials, images] = await Promise.all([
    getBrand(),
    getServices(),
    getTestimonials(),
    getImageUrls(),
  ]);

  const serviceCards = FEATURED_SERVICES.map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => !!s)
    .map((s) => ({
      href: `/services/${s.slug}`,
      title: s.name,
      body: s.tagline,
      image: SERVICE_IMAGES[s.slug] ?? s.directImageUrl ?? (s.imageKey ? images[s.imageKey] : undefined),
    }));

  const slides = [
    {
      title: "Precision bolting, delivered.",
      tagline: brand.since,
      image: images.homeHero,
      primary: { href: "/products", label: "Explore products" },
      secondary: { href: "/services", label: "Our services" },
    },
    {
      title: "Power for wind & energy.",
      tagline: "Foundation bolt tensioning",
      image: images.caseAdani ?? images.catWindTurbine,
      primary: { href: "/products/wbt-series", label: "WBT Series" },
      secondary: { href: "/library", label: "Learn more" },
    },
    {
      title: "Live pipelines. Zero downtime.",
      tagline: "Hot tapping & line stopping",
      image: images.hotTappingOngc ?? images.svcHotTapping,
      primary: { href: "/services/hot-tapping-line-stopping", label: "Explore service" },
      secondary: { href: "/company#case-studies", label: "Case studies" },
    },
  ];

  return (
    <div className="relative">
      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 pt-safe">
        <Image
          src="/brand/tritorc-logo.png"
          alt="Tritorc"
          width={133}
          height={18}
          priority
          className="h-[18px] w-auto brightness-0 invert"
        />
        <div className="flex gap-2">
          <Link
            href="/notifications"
            aria-label="Notifications"
            className="press flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur"
          >
            <Bell size={18} />
          </Link>
          <Link
            href="/library"
            aria-label="Search the library"
            className="press flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur"
          >
            <Search size={18} />
          </Link>
        </div>
      </header>

      <HeroCarousel slides={slides} />

      <div className="space-y-9 px-5 pt-8">
        <UpcomingEvents />
        <ServiceShowcase services={serviceCards} />
      </div>

      {/* Dark panel: a clean black section with rounded top corners that
          simply begins under the services (no gradient). It also runs under
          the nav padding so no light strip shows behind the bottom bar. */}
      <div
        className="relative mt-10 rounded-t-[32px] bg-[#0a0a0b]"
        style={{
          marginBottom: "calc(-1 * (88px + env(safe-area-inset-bottom, 0px)))",
          paddingBottom: "calc(88px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div className="space-y-9 px-5 pb-8 pt-10">
          <ClientVoices items={testimonials} images={images} />
        </div>
      </div>
    </div>
  );
}
