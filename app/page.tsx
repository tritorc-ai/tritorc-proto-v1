import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { getBrand, getImageUrls, getProducts, getServices, getTestimonials } from "@/lib/strapi";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ClientVoices, ProductShowcase, ServiceShowcase, UpcomingEvents } from "@/components/home/sections";

// Home is a short, image-led introduction: hero → products → services →
// contact. Everything detailed (credentials, case studies, industries,
// journey, the full catalogue) lives behind the bottom-nav tabs.

const FEATURED_PRODUCTS = [
  "tsl-20",
  "btl-19",
  "wbt-series",
  "pipe-cold-cutting-beveling-machines",
  "flange-facing-machines",
  "tube-expanders",
];
// Carousel-only image overrides (cut-out shots shown whole, not cropped).
const CAROUSEL_IMAGES: Record<string, { src: string; contain?: boolean }> = {
  "btl-19": { src: "/products/btl-9-bolt-tensioner.webp", contain: true },
};

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
  const [brand, services, products, testimonials, images] = await Promise.all([
    getBrand(),
    getServices(),
    getProducts(),
    getTestimonials(),
    getImageUrls(),
  ]);

  const productCards = FEATURED_PRODUCTS.map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .map((p) => ({
      href: `/products/${p.slug}`,
      title: p.name,
      kicker: p.series,
      body: p.tagline,
      image: CAROUSEL_IMAGES[p.slug]?.src ?? p.directImageUrl ?? (p.heroImageKey ? images[p.heroImageKey] : undefined),
      contain: CAROUSEL_IMAGES[p.slug]?.contain,
    }));

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
        <Link
          href="/library"
          aria-label="Search the library"
          className="press flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur"
        >
          <Search size={18} />
        </Link>
      </header>

      <HeroCarousel slides={slides} />

      <div className="space-y-9 px-5 pt-8">
        <UpcomingEvents />
        <ProductShowcase products={productCards} />
        <ServiceShowcase services={serviceCards} />
      </div>

      {/* Dark finale: a soft fade into pure black just above "What clients say",
          then solid black to the bottom (it also runs under the nav padding). */}
      <div
        className="relative mt-28 bg-black"
        style={{
          marginBottom: "calc(-1 * (88px + env(safe-area-inset-bottom, 0px)))",
          paddingBottom: "calc(88px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0"
          style={{
            top: -220,
            height: 221, // 1px overlap so there is never a seam with the black below
            // Eased (smoothstep-like) ramp: no visible start or end edge.
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.012) 10%, rgba(0,0,0,0.05) 22%, rgba(0,0,0,0.13) 34%, rgba(0,0,0,0.27) 46%, rgba(0,0,0,0.45) 58%, rgba(0,0,0,0.65) 70%, rgba(0,0,0,0.82) 81%, rgba(0,0,0,0.94) 91%, rgba(0,0,0,0.99) 97%, #000 100%)",
          }}
        />
        <div className="relative space-y-9 px-5 pb-8 pt-2">
          <ClientVoices items={testimonials} images={images} />
        </div>
      </div>
    </div>
  );
}
