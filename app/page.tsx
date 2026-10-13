import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import {
  getBrand,
  getCaseStudies,
  getCertifications,
  getImageUrls,
  getImpactStats,
  getJourney,
  getProducts,
  getServices,
  getTestimonials,
} from "@/lib/strapi";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import {
  AchievementsBlock,
  CaseStudies,
  CertificationRow,
  ContactCta,
  ContactStrip,
  Eyebrow,
  FieldStories,
  IndustriesBlock,
  Journey,
  NotificationsList,
  ProductShowcase,
  ServiceShowcase,
  SpotlightBlock,
  SupportGrid,
} from "@/components/home/sections";

const FEATURED_PRODUCTS = [
  "tsl-20",
  "btl-19",
  "wbt-series",
  "pipe-cold-cutting-beveling-machines",
  "flange-facing-machines",
  "tube-expanders",
  "heavy-impact-sockets",
];
const FEATURED_SERVICES = [
  "onsite-controlled-bolting",
  "hot-tapping-line-stopping",
  "flange-facing",
  "hydro-testing-services",
  "retubing-services",
  "pipe-freezing",
];

export default async function HomePage() {
  const [brand, stats, caseStudies, certifications, journey, services, products, testimonials, images] =
    await Promise.all([
      getBrand(),
      getImpactStats(),
      getCaseStudies(),
      getCertifications(),
      getJourney(),
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
      image: p.directImageUrl ?? (p.heroImageKey ? images[p.heroImageKey] : undefined),
    }));

  const serviceCards = FEATURED_SERVICES.map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => !!s)
    .map((s) => ({
      href: `/services/${s.slug}`,
      title: s.name,
      body: s.tagline,
      image: s.directImageUrl ?? (s.imageKey ? images[s.imageKey] : undefined),
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
      secondary: { href: "/company", label: "Case studies" },
    },
  ];

  const certs = certifications.map((c) => ({
    ...c,
    imageUrl: c.code === "ISO" ? images.certIso : c.code === "CE" ? images.certCe : undefined,
  }));

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

      {/* ---------- Scroll 1 — Hero & Products ---------- */}
      <section aria-label="Hero and products">
        <HeroCarousel slides={slides} />
        <div className="space-y-10 px-5 pt-8">
          <Eyebrow index={1} label="Discover" />
          <SpotlightBlock
            title="Controlled bolting"
            subtitle="Torque wrenches, tensioners and impact sockets."
            image={images.catTorqueWrenches ?? images.productTorqueHero}
            productHref="/products/tsl-20"
            productName="TSL Series Hydraulic Torque Wrenches"
          />
          <ProductShowcase products={productCards} />
        </div>
      </section>

      {/* ---------- Scroll 2 — Notifications & Services ---------- */}
      <section aria-label="Notifications and services" className="mt-12 space-y-10 px-5">
        <Eyebrow index={2} label="Updates & services" />
        <NotificationsList />
        <ServiceShowcase services={serviceCards} />
        <SupportGrid image={images.svcOnSiteMachining} />
        <ContactStrip />
      </section>

      {/* ---------- Scroll 3 — Achievements & Company ---------- */}
      <section aria-label="Achievements and company" className="mt-12 space-y-10 px-5">
        <Eyebrow index={3} label="Proof & people" />
        <AchievementsBlock stats={stats} image={images.impactBg} />
        <CertificationRow certs={certs} />
        <CaseStudies
          items={caseStudies.map((c) => ({
            ...c,
            imageUrl: c.directImageUrl ?? (c.imageKey ? images[c.imageKey] : undefined),
          }))}
        />
        <FieldStories items={testimonials} images={images} />
        <IndustriesBlock />
        <Journey items={journey} />
        <ContactCta />
      </section>
    </div>
  );
}
