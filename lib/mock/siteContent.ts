// Page-level content for the Home and Company screens, the founder's message and the
// contact details. This is the built-in default: lib/strapi.ts reads the same things
// from Strapi (single types home-page, company-page, founder-message, site-contact) and
// falls back to these values when Strapi is unreachable or has nothing yet.
// Images here are local paths in /public; an image uploaded in Strapi takes priority.

import { FEATURED_CASE_IDS, NOTIFICATIONS } from "./appContent";

export interface HeroSlideContent {
  image: string;
  imagePosition?: string;
  eyebrow?: string;
  lines: string[];
  side: "left" | "right";
  href?: string;
}

export interface CaseTileContent {
  title: string;
  note: string;
  image: string;
  pos: string;
  alt: string;
  href: string;
}

export interface QuoteContent {
  quote: string;
  author: string;
}

export interface HomePageContent {
  heroSlides: HeroSlideContent[];
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
  caseTiles: CaseTileContent[];
  quotes: QuoteContent[];
}

export interface FounderContent {
  name: string;
  role: string;
  message: string;
  photo?: string;
}

export interface CompanyPageContent {
  overviewText: string;
  overviewLines: string[];
  slides: { src: string; position: string }[];
  stats: { value: string; label: string }[];
  certifications: { title: string; note: string; image: string; alt: string }[];
  vision: string;
  mission: string;
  profileTitle: string;
  profileMeta: string;
}

// Two case studies shown as tiles on Home. Their links come from the case-study notifications.
const caseHref = (i: number) => NOTIFICATIONS.find((n) => n.id === FEATURED_CASE_IDS[i])?.href ?? "/notifications";

export const HOME_PAGE: HomePageContent = {
  heroSlides: [
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
  ],
  primary: { href: "/products", label: "Explore products" },
  secondary: { href: "/services", label: "Our services" },
  caseTiles: [
    {
      title: "Hot tapping at ONGC NQP",
      note: 'Live 16" pipeline, zero downtime.',
      image: "/images/home/case-hot-tapping-clean.webp",
      pos: "8% 50%",
      alt: "Technician operating a hot tapping machine on a live pipeline at sunset",
      href: caseHref(0),
    },
    {
      title: "SARB leak testing",
      note: 'Nitrogen-helium, 1"–6" piping.',
      image: "/images/home/case-leak-testing-clean.webp",
      pos: "12% 50%",
      alt: "Technician leak testing a flanged pipeline with a pressure gauge at sunset",
      href: caseHref(1),
    },
  ],
  quotes: [
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
  ],
};

// PLACEHOLDER name, role and message: replace them in Strapi (Founder Message) and upload the portrait.
export const FOUNDER: FounderContent = {
  name: "Mr. Naresh P Purswani",
  role: "Founder, Tritorc",
  photo: "/founder/naresh-p-purswani-white.png",
  message:
    "At Tritorc we don't give up easily. We keep going and keep growing. We operate with unshakeable faith and trust.",
};

export const COMPANY_PAGE: CompanyPageContent = {
  overviewText:
    "Tritorc is a trusted authority in controlled bolting, on-site machining, and pipeline integrity solutions — delivering turnkey expertise to industrial teams across 11 countries.",
  // Short facts shown one at a time over the overview photo.
  overviewLines: [
    "Founded in 1989, with more than 35 years of experience.",
    "Offices across India, the UAE, the USA, Algeria, Oman, Canada and Germany.",
    "In-house manufacturing of bolting and machining tools since 2013.",
    "ISO 9001:2015 certified quality management.",
    "500+ projects delivered by 100+ expert engineers.",
    "Live pipelines hot-tapped with zero downtime.",
  ],
  // Photos from tritorc.com (saved in public/company) that fade into one another behind the text.
  slides: [
    { src: "/company/slide-1-tube-bundle.jpg", position: "30% 50%" },
    { src: "/company/slide-2-onsite-machining.jpg", position: "25% 40%" },
    { src: "/company/slide-3-offshore.webp", position: "45% 50%" },
    { src: "/company/slide-4-sharjah.jpg", position: "50% 45%" },
    { src: "/company/slide-5-wellhead.jpg", position: "72% 50%" },
  ],
  stats: [
    { value: "54+", label: "Oil & gas projects" },
    { value: "300+", label: "Turbines installed" },
  ],
  certifications: [
    {
      title: "ISO 9001:2015",
      note: "Certified company",
      image: "/images/certs/iso-9001-2015.webp",
      alt: "ISO 9001:2015 certified company",
    },
    {
      title: "ECITB",
      note: "Approved provider",
      image: "/images/certs/ecitb-approved-provider.webp",
      alt: "ECITB approved provider",
    },
  ],
  vision: "Growth for all, Limits on none.",
  mission: "50X",
  profileTitle: "Company Profile",
  profileMeta: "6.4 MB · Updated Jul 2026",
};
