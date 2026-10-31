import "server-only";

// ---------------------------------------------------------------------------
// Single seam between this app and Strapi (cms.tritorc.com).
//
// Catalogues are wired to the live CMS (see getCatalogues below). Everything
// else (stats, case studies, certifications, journey, services, products,
// testimonials) still returns mock data — those don't have populated Strapi
// content types yet, so wiring them now would just replace real placeholder
// copy with empty results. Each is a one-function swap when their content
// types are ready.
// ---------------------------------------------------------------------------

import { strapiFetch } from "./strapiClient";
import { IMAGE_NAMES, type ImageKey } from "./mock/images";
import { IMAGE_FALLBACK_URLS } from "./mock/imageFallbacks";
import { VIDEO_NAMES, type VideoKey } from "./mock/videos";
import { getYoutubeLibraryAssets } from "./youtubeVideos";
import {
  CASE_STUDIES,
  CERTIFICATIONS,
  CORE_VALUES,
  GLOBAL_OFFICES,
  IMPACT_STATS,
  JOURNEY,
  LIBRARY_MEDIA_ASSETS,
  PRODUCTS,
  PRODUCT_LIST,
  SERVICES,
  SERVICE_CATEGORIES,
  SERVICE_SECTIONS,
  TESTIMONIALS,
  BRAND,
  type ProductListSection,
  type CaseStudy,
  type Certification,
  type CoreValue,
  type GlobalOffice,
  type ImpactStat,
  type JourneyMilestone,
  type LibraryAsset,
  type Product,
  type Service,
  type ServiceCategory,
  type ServiceSection,
  type Testimonial,
} from "./mock/content";
import { CONTACT } from "./mock/appContent";
import { EVENTS, type TritorcEvent } from "./mock/events";
import {
  COMPANY_PAGE,
  FOUNDER,
  HOME_PAGE,
  type CompanyPageContent,
  type FounderContent,
  type HomePageContent,
} from "./mock/siteContent";

export interface StrapiMediaFile {
  id: number;
  name: string;
  url: string;
  size: number; // KB, matches Strapi's convention
  mime: string;
  caption: string | null;
  updatedAt: string;
  formats?: { thumbnail?: { url: string } } | null;
}

// Mirrors the 18 real catalogues confirmed in the Strapi Media Library,
// tagged per the caption convention documented in the build plan.
const MOCK_CATALOGUES: StrapiMediaFile[] = [
  "Bolting & Machining Solutions Cata (IND) APAC",
  "Cement Industry Cata",
  "Company Profile (Final)",
  "Hot Tapping Cata",
  "In Situ Machining Catalogue",
  "Mining Cata",
  "Mining Leaflet",
  "Oil & Gas Leaflet - A5 FINAL (Domestic)",
  "On-Site Machining (Service)",
  "Overview of Tritorc Manufacturing Facility",
  "Pipeline Process Services",
  "Product Leaflet",
  "Sockets Catalogue Revised",
  "Testimonial Book_",
  "Tube Tool Catalogue Final",
  "Waterjet Cutting",
  "Wind Power Cata",
  "Wind Turbine Leaflet",
].map((name, i) => ({
  id: i + 1,
  name: `${name}.pdf`,
  url: "#",
  size: 5000 + i * 137,
  mime: "application/pdf",
  caption: "catalogue",
  updatedAt: "2026-08-04T07:12:00.000Z",
}));

function resolveMediaUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  const baseUrl = process.env.STRAPI_API_URL?.replace(/\/+$/, "") ?? "";
  return `${baseUrl}${url}`;
}

/**
 * Fetches the entire Media Library in one request. Classification into
 * Catalogue/Photo/Video is done by MIME type (reliable, automatic — no
 * manual caption tagging required), so anything an editor uploads to Strapi
 * shows up here without needing a naming convention to be followed correctly.
 *
 * Single request with a high pageSize rather than a real pagination loop —
 * fine for a media library in the hundreds of files; revisit if it grows
 * into the thousands.
 */
async function fetchAllMediaFiles(): Promise<StrapiMediaFile[] | null> {
  return strapiFetch<StrapiMediaFile[]>("/api/upload/files", {
    "pagination[pageSize]": "1000",
    sort: "updatedAt:desc",
  });
}

export async function getCatalogues(): Promise<StrapiMediaFile[]> {
  const files = await fetchAllMediaFiles();

  // Network/config failure (Strapi unreachable, missing env) -> fall back to
  // mock so the app still renders something. A successful-but-empty result
  // (no PDFs uploaded yet) is returned as-is — that's real, current CMS
  // state, and the Library/Catalogue screens already have an empty-state UI.
  if (files === null) return MOCK_CATALOGUES;

  return files
    .filter((f) => f.mime === "application/pdf")
    .map((f) => ({
      id: f.id,
      name: f.name,
      url: resolveMediaUrl(f.url),
      size: f.size,
      mime: f.mime,
      caption: f.caption,
      updatedAt: f.updatedAt,
    }));
}

// Maps the catalogue titles used in lib/mock/content.ts (Product.catalogue,
// Company page) to their real Strapi Media Library filename, where the two
// diverge — most already match verbatim.
const CATALOGUE_REAL_NAMES: Record<string, string> = {
  "Bolting & Machining Solutions Catalogue": "Bolting Solutions Cata - USA (July 2026)",
  "Wind Power Catalogue": "Wind Power Cata for Europe (Modified)",
  "Hot Tapping Cata": "Hot Tapping Cata 2025 (Both)",
  "In Situ Machining Catalogue": "In Situ Machining Catalogue - 2026 (A4)",
  "Tube Tool Catalogue Final": "A5 - Tube Tools (Madhav T) Extracted",
  "Company Profile (Final)": "Company Profile 2026 New Layout (FZC)",
};

/**
 * Resolves a mock catalogue title (e.g. Product.catalogue.title) to its real
 * Strapi PDF URL. Returns undefined if Strapi is unreachable or no matching
 * file exists yet — callers keep the "#" placeholder in that case.
 *
 * Queries Strapi for just this one filename instead of pulling the entire
 * (up to 1000-file) Media Library — this used to run on every single
 * Product/Service/Company page load and was the single biggest cause of slow
 * navigation in the app.
 */
export async function getCatalogueUrl(title: string): Promise<string | undefined> {
  const targetName = (CATALOGUE_REAL_NAMES[title] ?? title).trim();

  const files = await strapiFetch<StrapiMediaFile[]>("/api/upload/files", {
    "filters[name][$containsi]": targetName,
    "filters[mime][$eq]": "application/pdf",
    "pagination[pageSize]": "10",
  });
  if (files === null) return undefined;

  const match = files.find((f) => stripExtension(f.name).trim().toLowerCase() === targetName.toLowerCase());
  return match ? resolveMediaUrl(match.url) : undefined;
}

export interface CaptionMediaAsset {
  url: string;
  /** The part of the caption after the prefix, e.g. "hero", "gallery:in-use". */
  suffix: string;
}

/**
 * Resolves media by caption convention instead of a hardcoded filename map —
 * this is what lets new Product/Service photos show up correctly without a
 * code change or redeploy. Whoever uploads to Strapi tags a file's caption
 * as `product:<slug>:hero`, `product:<slug>:thumbnail`,
 * `product:<slug>:gallery:product`, `product:<slug>:gallery:in-use` (or the
 * `service:<slug>:...` equivalents, with `overview` instead of `product` for
 * the gallery) — this queries Strapi for everything starting with
 * `<entityType>:<slug>:`, live, each time the page loads.
 *
 * Returns [] if Strapi is unreachable or nothing is tagged yet — callers
 * fall back to the existing curated `lib/mock/images.ts` lookups in that
 * case, so nothing already working breaks while this convention is adopted.
 */
export async function getMediaByCaption(prefix: string): Promise<CaptionMediaAsset[]> {
  const files = await strapiFetch<StrapiMediaFile[]>("/api/upload/files", {
    "filters[caption][$containsi]": prefix,
    "pagination[pageSize]": "50",
  });
  if (files === null) return [];

  const normalizedPrefix = prefix.trim().toLowerCase();
  return files
    .map((f) => {
      const caption = f.caption?.trim().toLowerCase() ?? "";
      if (!caption.startsWith(normalizedPrefix)) return null;
      const suffix = caption.slice(normalizedPrefix.length).replace(/^:/, "");
      return { url: resolveMediaUrl(f.url), suffix };
    })
    .filter((a): a is CaptionMediaAsset => a !== null);
}

/**
 * Bulk version of the thumbnail half of the caption convention, for listing
 * pages (Products/Services grids) — one query for every `<entityType>:<slug>:thumbnail`
 * caption instead of one network call per product/service. Returns a map of
 * slug -> resolved URL; callers fall back to the existing curated image for
 * any slug missing from the map.
 */
export async function getThumbnailMap(
  entityType: "product" | "service"
): Promise<Record<string, string>> {
  const files = await strapiFetch<StrapiMediaFile[]>("/api/upload/files", {
    "filters[caption][$containsi]": ":thumbnail",
    "pagination[pageSize]": "100",
  });
  if (files === null) return {};

  const prefix = `${entityType}:`;
  const map: Record<string, string> = {};
  for (const f of files) {
    const caption = f.caption?.trim().toLowerCase() ?? "";
    if (!caption.startsWith(prefix) || !caption.endsWith(":thumbnail")) continue;
    const slug = caption.slice(prefix.length, -":thumbnail".length);
    if (slug) map[slug] = resolveMediaUrl(f.url);
  }
  return map;
}

/**
 * Resolves a curated set of real Media Library images (matched by filename,
 * see lib/mock/images.ts) to their live S3 URLs in one bulk request. Returns
 * an empty map on failure — callers keep their existing placeholder UI for
 * any key that doesn't resolve, exactly like the official site's fallback
 * pattern.
 */
export async function getImageUrls(): Promise<Partial<Record<ImageKey, string>>> {
  const names = Object.values(IMAGE_NAMES);
  const params: Record<string, string> = { "pagination[pageSize]": "100" };
  names.forEach((name, i) => {
    params[`filters[name][$in][${i}]`] = name;
  });

  const files = await strapiFetch<{ name: string; url: string }[]>(
    "/api/upload/files",
    params
  );
  if (files === null) return { ...IMAGE_FALLBACK_URLS };

  const urlByName = new Map(files.map((f) => [f.name, resolveMediaUrl(f.url)]));
  const result: Partial<Record<ImageKey, string>> = { ...IMAGE_FALLBACK_URLS };
  for (const [key, name] of Object.entries(IMAGE_NAMES) as [ImageKey, string][]) {
    const url = urlByName.get(name);
    if (url) result[key] = url;
  }
  return result;
}

/**
 * Video counterpart of getImageUrls() — resolves the curated VIDEO_NAMES map
 * (lib/mock/videos.ts) to live URLs in one bulk request. Returns an empty
 * map on failure, same fallback contract as getImageUrls().
 */
export async function getVideoUrls(): Promise<Partial<Record<VideoKey, string>>> {
  const names = Object.values(VIDEO_NAMES);
  const params: Record<string, string> = { "pagination[pageSize]": "100" };
  names.forEach((name, i) => {
    params[`filters[name][$in][${i}]`] = name;
  });

  const files = await strapiFetch<{ name: string; url: string }[]>(
    "/api/upload/files",
    params
  );
  if (files === null) return {};

  const urlByName = new Map(files.map((f) => [f.name, resolveMediaUrl(f.url)]));
  const result: Partial<Record<VideoKey, string>> = {};
  for (const [key, name] of Object.entries(VIDEO_NAMES) as [VideoKey, string][]) {
    const url = urlByName.get(name);
    if (url) result[key] = url;
  }
  return result;
}

// ---------------------------------------------------------------------------
// Everything below reads the Tritorc Strapi and falls back to the built-in
// content (lib/mock/*) when Strapi is unreachable, errors, or has no entries.
// ---------------------------------------------------------------------------

type StrapiMedia = { url: string; caption?: string | null } | null | undefined;

/** Absolute URL of an uploaded Strapi image, if there is one. */
function mediaUrl(m: StrapiMedia): string | undefined {
  return m?.url ? resolveMediaUrl(m.url) : undefined;
}

/** A Strapi collection in `order` order, or null on failure/empty so callers fall back. */
async function strapiRows<T>(path: string, params: Record<string, string> = {}): Promise<T[] | null> {
  const res = await strapiFetch<{ data: T[] }>(path, { sort: "order:asc", "pagination[pageSize]": "200", ...params });
  return res && Array.isArray(res.data) && res.data.length > 0 ? res.data : null;
}

/** A Strapi single type, or null on failure / not created yet. */
async function strapiSingle<T>(path: string, params: Record<string, string> = {}): Promise<T | null> {
  const res = await strapiFetch<{ data: T | null }>(path, params);
  return res?.data ?? null;
}

export async function getImpactStats(): Promise<ImpactStat[]> {
  const rows = await strapiRows<ImpactStat>("/api/impact-stats");
  return rows ? rows.map((r) => ({ value: r.value, label: r.label })) : IMPACT_STATS;
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const rows = await strapiRows<CaseStudy & { directImageUrl?: string | null }>("/api/case-studies");
  if (!rows) return CASE_STUDIES;
  return rows.map((r) => ({
    slug: r.slug,
    name: r.name,
    stat: r.stat,
    statLabel: r.statLabel,
    meta: r.meta,
    imageKey: CASE_STUDIES.find((c) => c.slug === r.slug)?.imageKey,
    directImageUrl: r.directImageUrl ?? CASE_STUDIES.find((c) => c.slug === r.slug)?.directImageUrl,
  }));
}

export async function getCertifications(): Promise<Certification[]> {
  const rows = await strapiRows<Certification>("/api/certifications");
  return rows ? rows.map((r) => ({ code: r.code, name: r.name, description: r.description })) : CERTIFICATIONS;
}

export async function getCoreValues(): Promise<CoreValue[]> {
  const rows = await strapiRows<CoreValue>("/api/core-values");
  return rows ? rows.map((r) => ({ name: r.name, description: r.description })) : CORE_VALUES;
}

export async function getGlobalOffices(): Promise<GlobalOffice[]> {
  const rows = await strapiRows<GlobalOffice>("/api/global-offices");
  return rows ? rows.map((r) => ({ city: r.city, country: r.country })) : GLOBAL_OFFICES;
}

export async function getJourney(): Promise<JourneyMilestone[]> {
  const rows = await strapiRows<JourneyMilestone>("/api/journey-milestones");
  return rows ? rows.map((r) => ({ year: r.year, label: r.label })) : JOURNEY;
}

// ---- Home page, founder message, company page, contact ----------------------

interface StrapiHomePage {
  heroSlides?: {
    image?: StrapiMedia; imageUrl?: string | null; imagePosition?: string | null; eyebrow?: string | null;
    lines?: unknown; side?: "left" | "right" | null; href?: string | null;
  }[] | null;
  primaryCtaLabel?: string | null; primaryCtaHref?: string | null;
  secondaryCtaLabel?: string | null; secondaryCtaHref?: string | null;
  caseTiles?: {
    title: string; note?: string | null; image?: StrapiMedia; imageUrl?: string | null;
    imagePosition?: string | null; alt?: string | null; href?: string | null;
  }[] | null;
  quotes?: { quote: string; author: string }[] | null;
}

export async function getHomePage(): Promise<HomePageContent> {
  const d = await strapiSingle<StrapiHomePage>("/api/home-page", {
    "populate[heroSlides][populate][0]": "image",
    "populate[caseTiles][populate][0]": "image",
    "populate[quotes]": "true",
  });
  if (!d) return HOME_PAGE;
  return {
    heroSlides: d.heroSlides?.length
      ? d.heroSlides.map((s, i) => ({
          image: mediaUrl(s.image) ?? s.imageUrl ?? HOME_PAGE.heroSlides[i]?.image ?? "",
          imagePosition: s.imagePosition ?? undefined,
          eyebrow: s.eyebrow ?? undefined,
          lines: Array.isArray(s.lines) ? s.lines.map(String) : (HOME_PAGE.heroSlides[i]?.lines ?? []),
          side: s.side ?? "right",
          href: s.href ?? undefined,
        }))
      : HOME_PAGE.heroSlides,
    primary: {
      label: d.primaryCtaLabel ?? HOME_PAGE.primary.label,
      href: d.primaryCtaHref ?? HOME_PAGE.primary.href,
    },
    secondary: {
      label: d.secondaryCtaLabel ?? HOME_PAGE.secondary.label,
      href: d.secondaryCtaHref ?? HOME_PAGE.secondary.href,
    },
    caseTiles: d.caseTiles?.length
      ? d.caseTiles.map((t, i) => ({
          title: t.title,
          note: t.note ?? "",
          image: mediaUrl(t.image) ?? t.imageUrl ?? HOME_PAGE.caseTiles[i]?.image ?? "",
          pos: t.imagePosition ?? "50% 50%",
          alt: t.alt ?? "",
          href: t.href ?? "/notifications",
        }))
      : HOME_PAGE.caseTiles,
    quotes: d.quotes?.length ? d.quotes.map((q) => ({ quote: q.quote, author: q.author })) : HOME_PAGE.quotes,
  };
}

export async function getFounderMessage(): Promise<FounderContent> {
  const d = await strapiSingle<{
    name: string; role?: string | null; message: string; photo?: StrapiMedia; photoUrl?: string | null;
  }>("/api/founder-message", { "populate[photo]": "true" });
  if (!d) return FOUNDER;
  return {
    name: d.name,
    role: d.role ?? "",
    message: d.message,
    photo: mediaUrl(d.photo) ?? d.photoUrl ?? undefined,
  };
}

// The five photos the first Strapi seed put in the Company slideshow (files taken out of the app on 2026-10-31 when
// the supplied photos replaced them). A Strapi filled from that seed still lists them (the seed script only adds and
// updates), so they are skipped here and the built-in photos show until someone replaces the slides in the Strapi
// admin. A photo uploaded there, or any other picture set there, still shows.
const OLD_COMPANY_SLIDES = new Set([
  "/company/slide-1-tube-bundle.jpg",
  "/company/slide-2-onsite-machining.jpg",
  "/company/slide-3-offshore.webp",
  "/company/slide-4-sharjah.jpg",
  "/company/slide-5-wellhead.jpg",
]);

export async function getCompanyPage(): Promise<CompanyPageContent> {
  const d = await strapiSingle<{
    overviewText?: string | null; overviewLines?: unknown;
    slides?: { image?: StrapiMedia; imageUrl?: string | null; position?: string | null }[] | null;
    stats?: { value: string; label: string }[] | null;
    certificationBadges?: { title: string; note?: string | null; image?: StrapiMedia; imageUrl?: string | null; alt?: string | null }[] | null;
    vision?: string | null; mission?: string | null;
    profileTitle?: string | null; profileMeta?: string | null;
  }>("/api/company-page", {
    "populate[slides][populate][0]": "image",
    "populate[stats]": "true",
    "populate[certificationBadges][populate][0]": "image",
  });
  if (!d) return COMPANY_PAGE;
  const slides = (d.slides ?? [])
    .map((s, i) => {
      const src = mediaUrl(s.image) ?? s.imageUrl ?? COMPANY_PAGE.slides[i]?.src ?? "";
      return {
        src,
        position: s.position ?? "50% 50%",
        // The caption of an uploaded photo (Strapi Media Library > the photo > Caption) is shown over it
        // while it is on screen; a built-in photo keeps the caption written for it in siteContent.ts.
        caption: s.image?.caption?.trim() || COMPANY_PAGE.slides.find((b) => b.src === src)?.caption,
      };
    })
    .filter((s) => s.src && !OLD_COMPANY_SLIDES.has(s.src));
  return {
    overviewText: d.overviewText ?? COMPANY_PAGE.overviewText,
    overviewLines:
      Array.isArray(d.overviewLines) && d.overviewLines.length ? d.overviewLines.map(String) : COMPANY_PAGE.overviewLines,
    slides: slides.length ? slides : COMPANY_PAGE.slides,
    stats: d.stats?.length ? d.stats.map((s) => ({ value: s.value, label: s.label })) : COMPANY_PAGE.stats,
    certifications: d.certificationBadges?.length
      ? d.certificationBadges.map((c, i) => ({
          title: c.title,
          note: c.note ?? "",
          image: mediaUrl(c.image) ?? c.imageUrl ?? COMPANY_PAGE.certifications[i]?.image ?? "",
          alt: c.alt ?? c.title,
        }))
      : COMPANY_PAGE.certifications,
    vision: d.vision ?? COMPANY_PAGE.vision,
    mission: d.mission ?? COMPANY_PAGE.mission,
    profileTitle: d.profileTitle ?? COMPANY_PAGE.profileTitle,
    profileMeta: d.profileMeta ?? COMPANY_PAGE.profileMeta,
  };
}

export interface SiteContact {
  email: string;
  phoneIndia: string;
  phoneIndiaHref: string;
  phoneUsa: string;
  phoneUsaHref: string;
  website: string;
  contactPage: string;
  social: { label: string; href: string }[];
}

export async function getSiteContact(): Promise<SiteContact> {
  const fallback: SiteContact = { ...CONTACT, social: CONTACT.social.map((s) => ({ ...s })) };
  const d = await strapiSingle<Partial<SiteContact>>("/api/site-contact", { "populate[social]": "true" });
  if (!d) return fallback;
  return {
    email: d.email ?? fallback.email,
    phoneIndia: d.phoneIndia ?? fallback.phoneIndia,
    phoneIndiaHref: d.phoneIndiaHref ?? fallback.phoneIndiaHref,
    phoneUsa: d.phoneUsa ?? fallback.phoneUsa,
    phoneUsaHref: d.phoneUsaHref ?? fallback.phoneUsaHref,
    website: d.website ?? fallback.website,
    contactPage: d.contactPage ?? fallback.contactPage,
    social: d.social?.length ? d.social.map((s) => ({ label: s.label, href: s.href })) : fallback.social,
  };
}

// ---- Events ---------------------------------------------------------------------

interface StrapiEvent {
  slug: string; title: string; eventStatus?: "upcoming" | "past" | null; category?: string | null;
  featured?: boolean | null; dateLabel?: string | null; start?: string | null; schedule?: string | null;
  venue?: string | null; city?: string | null; hall?: string | null; booth?: string | null;
  image?: StrapiMedia; imageUrl?: string | null; intro?: string | null; about?: unknown; sourceUrl?: string | null;
  stats?: { value: string; label: string }[] | null;
  highlights?: { title: string; body?: string | null }[] | null;
  hours?: { day: string; hours: string }[] | null;
}

/** All events, newest first (same order as the built-in list). */
export async function getEvents(): Promise<TritorcEvent[]> {
  const res = await strapiFetch<{ data: StrapiEvent[] }>("/api/events", {
    "populate[image]": "true",
    "populate[stats]": "true",
    "populate[highlights]": "true",
    "populate[hours]": "true",
    sort: "start:desc",
    "pagination[pageSize]": "100",
  });
  if (!res || !Array.isArray(res.data) || res.data.length === 0) return EVENTS;
  return res.data.map((e) => ({
    slug: e.slug,
    title: e.title,
    category: (e.category ?? "Exhibition") as TritorcEvent["category"],
    status: e.eventStatus ?? "upcoming",
    featured: e.featured ?? undefined,
    dateLabel: e.dateLabel ?? "",
    start: e.start ?? "",
    schedule: e.schedule ?? "",
    venue: e.venue ?? "",
    city: e.city ?? "",
    hall: e.hall ?? undefined,
    booth: e.booth ?? undefined,
    // tritorc.com took its /exhibition pictures down, and a Strapi filled from the older seed data still points at
    // them: those links are ignored and the app's own picture for that event (if any) is used instead.
    image:
      mediaUrl(e.image) ??
      (e.imageUrl && !/^https?:\/\/(www\.)?tritorc\.com\/exhibition\//i.test(e.imageUrl) ? e.imageUrl : undefined) ??
      EVENTS.find((b) => b.slug === e.slug)?.image ??
      "",
    intro: e.intro ?? "",
    about: Array.isArray(e.about) ? e.about.map(String) : [],
    stats: (e.stats ?? []).map((s) => ({ value: s.value, label: s.label })),
    highlights: (e.highlights ?? []).map((h) => ({ title: h.title, body: h.body ?? "" })),
    hours: e.hours?.length ? e.hours.map((h) => ({ day: h.day, hours: h.hours })) : undefined,
    sourceUrl: e.sourceUrl ?? "",
  }));
}

export async function getEvent(slug: string): Promise<TritorcEvent | undefined> {
  return (await getEvents()).find((e) => e.slug === slug);
}

// ---------------------------------------------------------------------------
// Products and services come from the Tritorc Strapi (collection types
// "product", "service", "product-section", "service-section"). Every getter
// falls back to the built-in sample content in lib/mock/content.ts when Strapi
// is unreachable, errors, or has no entries yet, so the app never renders empty.
// Photos are still resolved separately (captions / file names, see above); the
// mock `imageKey`s are kept as a fallback so existing photos keep working.
// ---------------------------------------------------------------------------

interface StrapiProduct {
  slug: string;
  name: string;
  series?: string | null;
  tagline?: string | null;
  specs?: { label: string; value: string }[] | null;
  directImageUrl?: string | null;
  catalogueTitle?: string | null;
  category?: { name: string } | null;
}

interface StrapiService {
  slug: string;
  name: string;
  category?: string | null;
  tagline?: string | null;
  description?: string | null;
  directImageUrl?: string | null;
  catalogueTitle?: string | null;
}

const MOCK_PRODUCTS_BY_SLUG = new Map(PRODUCTS.map((p) => [p.slug, p]));
const MOCK_SERVICES_BY_SLUG = new Map(SERVICES.map((s) => [s.slug, s]));

type Catalogue = { title: string; meta: string; url: string };

/**
 * Strapi only stores the catalogue's title. When it matches the sample entry,
 * keep that entry's subtitle ("10.9 MB · Updated ...") and link, so cards look
 * the same whether the data came from Strapi or the built-in sample content.
 */
function toCatalogue(title?: string | null, mock?: Catalogue | null): Catalogue | null {
  if (!title) return null;
  const same = mock && mock.title === title;
  return { title, meta: same ? mock.meta : "", url: same ? mock.url : "#" };
}

export async function getProducts(): Promise<Product[]> {
  const res = await strapiFetch<{ data: StrapiProduct[] }>("/api/products", {
    "populate[specs]": "true",
    "populate[category]": "true",
    sort: "order:asc",
    "pagination[pageSize]": "200",
  });
  if (!res || !Array.isArray(res.data) || res.data.length === 0) return PRODUCTS;
  return res.data.map((p) => {
    const mock = MOCK_PRODUCTS_BY_SLUG.get(p.slug);
    return {
      slug: p.slug,
      name: p.name,
      series: p.series ?? mock?.series ?? "",
      category: p.category?.name ?? mock?.category ?? "",
      tagline: p.tagline ?? mock?.tagline ?? "",
      specs: (p.specs ?? []).map((s) => ({ label: s.label, value: s.value })),
      media: [],
      catalogue: toCatalogue(p.catalogueTitle, mock?.catalogue) ?? mock?.catalogue ?? null,
      heroImageKey: mock?.heroImageKey,
      directImageUrl: p.directImageUrl ?? mock?.directImageUrl,
    };
  });
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.slug === slug);
}

/** The sections and cards shown on the Products page, in order. */
export async function getProductList(): Promise<ProductListSection[]> {
  const res = await strapiFetch<{
    data: { name: string; products?: { slug: string; name: string; listingTitle?: string | null; listingSeries?: string | null; series?: string | null }[] }[];
  }>("/api/product-sections", {
    sort: "order:asc",
    "populate[products][sort]": "order:asc",
    "populate[products][fields][0]": "slug",
    "populate[products][fields][1]": "name",
    "populate[products][fields][2]": "listingTitle",
    "populate[products][fields][3]": "listingSeries",
    "populate[products][fields][4]": "series",
  });
  if (!res || !Array.isArray(res.data) || res.data.every((s) => !s.products?.length)) return PRODUCT_LIST;
  return res.data
    .filter((s) => s.products && s.products.length > 0)
    .map((s) => ({
      name: s.name,
      items: (s.products ?? []).map((p) => ({
        slug: p.slug,
        title: p.listingTitle ?? p.name,
        series: p.listingSeries ?? p.series ?? "",
      })),
    }));
}

function mapService(s: StrapiService): Service {
  const mock = MOCK_SERVICES_BY_SLUG.get(s.slug);
  return {
    slug: s.slug,
    name: s.name,
    category: s.category ?? mock?.category ?? s.name,
    tagline: s.tagline ?? mock?.tagline ?? "",
    description: s.description ?? mock?.description ?? "",
    imageKey: mock?.imageKey,
    directImageUrl: s.directImageUrl ?? mock?.directImageUrl,
    media: [],
    catalogue: toCatalogue(s.catalogueTitle, mock?.catalogue) ?? mock?.catalogue ?? null,
  };
}

// Services taken out of the app on 2026-10-31 (manager's list: only services with a photo stay). A Strapi that was
// filled from the older seed data still holds them (the seed script only adds and updates, it never deletes), so
// they are skipped here until someone deletes them in the Strapi admin. A service added in Strapi later still shows.
const REMOVED_SERVICE_SLUGS = new Set([
  "dewatering-dry-air-flushing",
  "hydro-testing-services",
  "nitrogen-helium-leak-testing",
  "pneumatic-testing",
  "calibration-services",
  "dry-rental",
]);
const REMOVED_SERVICE_CATEGORIES = new Set([
  "Dewatering & Dry Air Flushing Services",
  "Hydro Testing Services",
  "Nitrogen Helium Leak Testing Services",
  "Pneumatic Testing",
  "Calibration Services",
  "Dry Rental",
]);

export async function getServices(): Promise<Service[]> {
  const res = await strapiFetch<{ data: StrapiService[] }>("/api/services", {
    sort: "order:asc",
    "pagination[pageSize]": "200",
  });
  if (!res || !Array.isArray(res.data) || res.data.length === 0) return SERVICES;
  const kept = res.data.filter((s) => !REMOVED_SERVICE_SLUGS.has(s.slug));
  return (kept.length > 0 ? kept : res.data).map(mapService);
}

export async function getService(slug: string): Promise<Service | undefined> {
  return (await getServices()).find((s) => s.slug === slug);
}

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  return SERVICE_CATEGORIES;
}

/** The six service groups. Each group's `categories` are its services' category names, in order. */
export async function getServiceSections(): Promise<ServiceSection[]> {
  const res = await strapiFetch<{
    data: { name: string; color?: string | null; services?: { category?: string | null; name: string }[] }[];
  }>("/api/service-sections", {
    sort: "order:asc",
    "populate[services][sort]": "order:asc",
    "populate[services][fields][0]": "category",
    "populate[services][fields][1]": "name",
  });
  if (!res || !Array.isArray(res.data) || res.data.every((s) => !s.services?.length)) return SERVICE_SECTIONS;
  const sections: ServiceSection[] = res.data
    .map((s) => ({
      name: s.name,
      color: s.color ?? "#171717",
      // drop the services that were removed from the app (see REMOVED_SERVICE_CATEGORIES)
      categories: (s.services ?? []).map((sv) => sv.category ?? sv.name).filter((c) => !REMOVED_SERVICE_CATEGORIES.has(c)),
    }))
    .filter((s) => s.categories.length > 0); // a group left empty (e.g. "Tool Calibration Services") disappears

  // A service the app lists in a group that the Strapi does not have it in yet (Onsite Controlled Bolting took
  // Calibration's place in a new "Controlled Bolting Services" group) is added to that group, creating it if needed.
  const placed = new Set(sections.flatMap((s) => s.categories));
  for (const builtIn of SERVICE_SECTIONS) {
    for (const category of builtIn.categories) {
      if (placed.has(category)) continue;
      const home = sections.find((s) => s.name === builtIn.name);
      if (home) home.categories.push(category);
      else sections.push({ name: builtIn.name, color: builtIn.color, categories: [category] });
      placed.add(category);
    }
  }
  return sections;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const rows = await strapiRows<{ quote: string; author: string }>("/api/testimonials");
  if (!rows) return TESTIMONIALS;
  return rows.map((r, i) => ({
    quote: r.quote,
    author: r.author,
    imageKey: (TESTIMONIALS.find((t) => t.author === r.author) ?? TESTIMONIALS[i] ?? TESTIMONIALS[0]).imageKey,
  }));
}

export async function getBrand() {
  const d = await strapiSingle<{ quote?: string | null; since?: string | null }>("/api/brand");
  return d ? { quote: d.quote ?? BRAND.quote, since: d.since ?? BRAND.since } : BRAND;
}

function stripExtension(filename: string): string {
  return filename.replace(/\.[a-z0-9]+$/i, "");
}

/**
 * A large chunk of the Media Library is bulk-uploaded product photos with no
 * descriptive name at all — e.g. "product-e813e16585907f463863-e813e16585907f46",
 * just "product-" followed by a random hex string. Those don't showcase any
 * particular project/subject; they read as noise in the default grid. Logos
 * and certification badges aren't project photography either. Real photos
 * (case studies, category heroes, named products) keep readable words in
 * their title and pass through fine. The photos of the Company page slideshow
 * are uploaded as "company-slide-<n>-<subject>" and stay out of the Library.
 */
function isProjectPhoto(title: string): boolean {
  const t = title.toLowerCase();
  const withoutHash = t.replace(/-[a-f0-9]{8,}$/i, "");
  if (/^product(-[a-f0-9]+)+$/.test(withoutHash)) return false;
  if (/(logo|badge|-cert-|footer-)/i.test(t)) return false;
  if (t.startsWith("company-slide-")) return false;
  return true;
}

/**
 * The Library screen searches/filters across every catalogue, photo, and
 * video in the Media Library — classified automatically by MIME type, so
 * anything a content editor uploads to Strapi shows up here immediately,
 * with no manual tagging step required.
 */
export async function getLibraryAssets(): Promise<LibraryAsset[]> {
  const files = await fetchAllMediaFiles();

  // Strapi unreachable -> fall back to the full mock set so the app still
  // renders something in dev / offline. A successful-but-empty result (no
  // media uploaded yet) is returned as-is — that's real CMS state, and the
  // Library screen already has an empty-state UI for it.
  if (files === null) {
    const catalogueAssets: LibraryAsset[] = MOCK_CATALOGUES.map((c) => ({
      id: `catalogue-${c.id}`,
      type: "Catalogue",
      title: stripExtension(c.name),
      categoryLabel: "Catalogues",
      fileUrl: c.url,
    }));
    return [...catalogueAssets, ...getYoutubeLibraryAssets(), ...LIBRARY_MEDIA_ASSETS];
  }

  // Cover pictures of the catalogues ("<pdf name>.thumb.webp", caption "catalogue-thumb")
  // belong on the PDF's card, not in the Photos list.
  const isThumb = (f: StrapiMediaFile) => f.caption?.trim() === "catalogue-thumb";
  const thumbs = new Map<string, string>();
  for (const f of files) {
    if (isThumb(f)) thumbs.set(f.name.replace(/\.thumb\.webp$/i, "").toLowerCase(), resolveMediaUrl(f.url));
  }

  const assets: LibraryAsset[] = [];
  for (const f of files) {
    if (isThumb(f)) continue;
    const caption = f.caption?.trim();
    if (f.mime === "application/pdf") {
      assets.push({
        id: `catalogue-${f.id}`,
        type: "Catalogue",
        title: stripExtension(f.name),
        categoryLabel: caption || "Catalogues",
        directImageUrl: thumbs.get(stripExtension(f.name).toLowerCase()),
        fileUrl: resolveMediaUrl(f.url),
      });
    } else if (f.mime.startsWith("video/")) {
      assets.push({
        id: `video-${f.id}`,
        type: "Video",
        title: stripExtension(f.name),
        categoryLabel: caption || "Videos",
        fileUrl: resolveMediaUrl(f.url),
      });
    } else if (f.mime.startsWith("image/")) {
      const title = stripExtension(f.name);
      if (!isProjectPhoto(title)) continue;
      const thumbUrl = f.formats?.thumbnail?.url ?? f.url;
      assets.push({
        id: `photo-${f.id}`,
        type: "Photo",
        title,
        categoryLabel: caption || "Photos",
        directImageUrl: resolveMediaUrl(thumbUrl),
        fileUrl: resolveMediaUrl(f.url),
      });
    }
    // Anything else (docs, spreadsheets, etc.) isn't a Library asset type.
  }

  // The real Media Library has genuine duplicate uploads (the same file
  // re-uploaded under the same display name — confirmed by manual audit, not
  // a bug in this code). Collapse to one card per (type, title) so the
  // default view shows only distinct assets; files is sorted updatedAt:desc,
  // so the kept copy is always the most recently uploaded one.
  const seen = new Set<string>();
  return [...assets, ...getYoutubeLibraryAssets()].filter((a) => {
    const key = `${a.type}:${a.title.trim().toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
