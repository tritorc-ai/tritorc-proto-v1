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
import {
  CASE_STUDIES,
  CERTIFICATIONS,
  CORE_VALUES,
  GLOBAL_OFFICES,
  IMPACT_STATS,
  JOURNEY,
  LIBRARY_MEDIA_ASSETS,
  PRODUCTS,
  SERVICES,
  SERVICE_CATEGORIES,
  SERVICE_SECTIONS,
  TESTIMONIALS,
  BRAND,
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
  "Bolting & Machining Solutions Catalogue": "Bolting & Machining Solutions Cata (IND) APAC",
  "Wind Power Catalogue": "Wind Power Cata",
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

export async function getImpactStats(): Promise<ImpactStat[]> {
  return IMPACT_STATS;
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  return CASE_STUDIES;
}

export async function getCertifications(): Promise<Certification[]> {
  return CERTIFICATIONS;
}

export async function getCoreValues(): Promise<CoreValue[]> {
  return CORE_VALUES;
}

export async function getGlobalOffices(): Promise<GlobalOffice[]> {
  return GLOBAL_OFFICES;
}

export async function getJourney(): Promise<JourneyMilestone[]> {
  return JOURNEY;
}

export async function getServices(): Promise<Service[]> {
  return SERVICES;
}

export async function getService(slug: string): Promise<Service | undefined> {
  return SERVICES.find((s) => s.slug === slug);
}

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  return SERVICE_CATEGORIES;
}

export async function getServiceSections(): Promise<ServiceSection[]> {
  return SERVICE_SECTIONS;
}

export async function getProducts(): Promise<Product[]> {
  return PRODUCTS;
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return PRODUCTS.find((p) => p.slug === slug);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return TESTIMONIALS;
}

export async function getBrand() {
  return BRAND;
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
 * their title and pass through fine.
 */
function isProjectPhoto(title: string): boolean {
  const t = title.toLowerCase();
  const withoutHash = t.replace(/-[a-f0-9]{8,}$/i, "");
  if (/^product(-[a-f0-9]+)+$/.test(withoutHash)) return false;
  if (/(logo|badge|-cert-|footer-)/i.test(t)) return false;
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
    return [...catalogueAssets, ...LIBRARY_MEDIA_ASSETS];
  }

  const assets: LibraryAsset[] = [];
  for (const f of files) {
    const caption = f.caption?.trim();
    if (f.mime === "application/pdf") {
      assets.push({
        id: `catalogue-${f.id}`,
        type: "Catalogue",
        title: stripExtension(f.name),
        categoryLabel: caption || "Catalogues",
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
  return assets.filter((a) => {
    const key = `${a.type}:${a.title.trim().toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
