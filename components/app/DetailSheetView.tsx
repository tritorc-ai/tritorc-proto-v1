"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Download, FileText, Images, Info, ListChecks, Play } from "lucide-react";
import type { ProductSpec } from "@/lib/mock/content";
import { MediaPreviewModal, type PreviewableAsset } from "./MediaPreviewModal";
import { PdfPreviewModal } from "./PdfPreviewModal";
import { jakarta } from "@/lib/fonts";
import { HeroVideo } from "./HeroVideo";
import type { HeroVideoSource } from "@/lib/heroVideos";
import { cn } from "@/lib/utils";

/** Header + sheet-handle offset used when expanding the sheet / jumping to a section. */
const HEADER_OFFSET = 72;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function SectionTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-3.5">
      <h2 className="text-[26px] font-bold leading-[1.1] tracking-[-0.02em] text-brand-dark">{title}</h2>
      {hint && <p className="mt-1 text-[14px] text-brand-text-tertiary">{hint}</p>}
    </div>
  );
}

function ContextToggle({
  value,
  onChange,
  productLabel,
}: {
  value: "product" | "in-use";
  onChange: (v: "product" | "in-use") => void;
  productLabel: string;
}) {
  return (
    <div role="tablist" aria-label="Photo type" className="flex rounded-full bg-[#e4e5e7] p-0.75">
      {(["product", "in-use"] as const).map((v) => (
        <button
          key={v}
          role="tab"
          aria-selected={value === v}
          onClick={() => onChange(v)}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors duration-300",
            value === v ? "bg-brand-dark text-white" : "text-brand-text-secondary hover:text-brand-dark",
          )}
        >
          {v === "product" ? productLabel : "In use"}
        </button>
      ))}
    </div>
  );
}

function Gallery({
  photos,
  name,
  onOpen,
}: {
  photos: { id: string; url: string }[];
  name: string;
  onOpen: (index: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    const el = track?.children[i] as HTMLElement | undefined;
    if (!track || !el) return;
    track.scrollTo({
      left: el.offsetLeft - (track.clientWidth - el.clientWidth) / 2,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, []);

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    Array.from(track.children).forEach((c, i) => {
      const el = c as HTMLElement;
      const d = Math.abs(el.offsetLeft + el.clientWidth / 2 - center);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActive(best);
  };

  return (
    <div>
      <div className="group/gallery relative">
        <div
          ref={trackRef}
          onScroll={onScroll}
          role="group"
          aria-label={`${name} photos`}
          className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-1 before:block before:w-[calc(10%-12px)] before:shrink-0 after:block after:w-[calc(10%-12px)] after:shrink-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {photos.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onOpen(i)}
              aria-label={`Open photo ${i + 1} of ${photos.length}`}
              className="relative aspect-[4/5] w-[80%] shrink-0 snap-center overflow-hidden rounded-[26px] bg-[#e4e5e7] outline-none transition-transform duration-500 ease-(--ease-premium) focus-visible:ring-2 focus-visible:ring-brand-dark/40 active:scale-[0.985]"
            >
              <Image
                src={p.url}
                alt={`${name}, photo ${i + 1}`}
                fill
                sizes="(max-width: 448px) 84vw, 376px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
        {photos.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => goTo(Math.max(0, active - 1))}
              disabled={active === 0}
              className="absolute left-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-brand-dark shadow-sm backdrop-blur transition-opacity hover:bg-white disabled:opacity-0 md:flex"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => goTo(Math.min(photos.length - 1, active + 1))}
              disabled={active === photos.length - 1}
              className="absolute right-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-brand-dark shadow-sm backdrop-blur transition-opacity hover:bg-white disabled:opacity-0 md:flex"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>
      {photos.length > 1 && (
        <div className="mt-3.5 flex items-center justify-center gap-1.5">
          {photos.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show photo ${i + 1} of ${photos.length}`}
              aria-current={i === active}
              className="flex h-4 items-center"
            >
              <span
                className={cn(
                  "h-1 rounded-full transition-all duration-500 ease-(--ease-premium)",
                  i === active ? "w-5 bg-brand-dark" : "w-1.5 bg-black/20",
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export interface DetailMedia {
  id: string;
  kind: "photo" | "video";
  context: "product" | "in-use";
  url: string;
}

/**
 * Shared detail screen for products and services: a hero card behind a
 * rounded information sheet (overview, gallery, video, about, specs,
 * catalogue). Optional sections only render when their data exists.
 */
export function DetailSheetView({
  slug,
  name,
  tagline,
  eyebrow,
  eyebrowRight,
  media,
  specs = [],
  about,
  catalogue,
  heroImageUrl,
  heroVideo,
  backHref,
  overviewLabel = "Product",
}: {
  slug: string;
  name: string;
  tagline: string;
  eyebrow: string;
  eyebrowRight?: string;
  media: DetailMedia[];
  specs?: ProductSpec[];
  about?: { title: string; text: string };
  catalogue?: { title: string; meta: string; url: string } | null;
  heroImageUrl?: string;
  /** Muted looping clip that plays in the hero instead of the still image. */
  heroVideo?: HeroVideoSource;
  backHref: string;
  /** Name of the non-"in use" photo group in the toggle. */
  overviewLabel?: string;
}) {
  const [photoMode, setPhotoMode] = useState<"product" | "in-use">("product");
  const [expanded, setExpanded] = useState(false);
  const [viewer, setViewer] = useState<{ items: PreviewableAsset[]; index: number } | null>(null);
  const [pdfOpen, setPdfOpen] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const heroInnerRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const productPhotos = media.filter((m) => m.kind === "photo" && m.context === "product");
  const inUsePhotos = media.filter((m) => m.kind === "photo" && m.context === "in-use");
  const videos = media.filter((m) => m.kind === "video");
  const heroImage = heroImageUrl ?? productPhotos[0]?.url;

  // With no tagged product shots, the hero image stands in as the one gallery photo.
  const productGallery =
    productPhotos.length > 0
      ? productPhotos
      : heroImageUrl
        ? [{ id: `${slug}-hero`, url: heroImageUrl }]
        : [];
  const hasToggle = productGallery.length > 0 && inUsePhotos.length > 0;
  const mode = hasToggle ? photoMode : inUsePhotos.length > 0 && productGallery.length === 0 ? "in-use" : "product";
  const photos = mode === "in-use" ? inUsePhotos : productGallery;

  const catalogueUrl = catalogue?.url && catalogue.url !== "#" ? catalogue.url : undefined;

  // Hero eases back and fades as the sheet rises over it; the header title
  // appears once the sheet is (nearly) fully expanded.
  useEffect(() => {
    const reduce = prefersReducedMotion();
    let frame = 0;
    const update = () => {
      frame = 0;
      const hero = heroRef.current;
      const inner = heroInnerRef.current;
      const sheet = sheetRef.current;
      if (!hero || !sheet) return;
      const p = Math.min(1, Math.max(0, 1 - sheet.getBoundingClientRect().top / (hero.offsetHeight * 0.75)));
      if (inner && !reduce) {
        inner.style.transform = `translateY(${p * -28}px) scale(${1 - p * 0.06})`;
        inner.style.opacity = String(1 - p * 0.9);
      }
      setExpanded(p > 0.75);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const behavior: ScrollBehavior = "smooth";
  const scrollOpts = (top: number): ScrollToOptions => ({ top, behavior: prefersReducedMotion() ? "auto" : behavior });

  const toggleSheet = () => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    if (expanded) window.scrollTo(scrollOpts(0));
    else window.scrollTo(scrollOpts(window.scrollY + sheet.getBoundingClientRect().top - HEADER_OFFSET + 8));
  };

  const jumpTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo(scrollOpts(window.scrollY + el.getBoundingClientRect().top - HEADER_OFFSET));
  };

  const shortcuts = [
    photos.length > 0 && { id: "pd-gallery", label: "Photos", count: `${photos.length}`, icon: Images },
    specs.length > 0 && { id: "pd-specs", label: "Specs", count: `${specs.length}`, icon: ListChecks },
    about && { id: "pd-about", label: "About", count: undefined, icon: Info },
    catalogue && { id: "pd-catalogue", label: "Catalogue", count: undefined, icon: FileText },
  ].filter(Boolean) as { id: string; label: string; count?: string; icon: typeof Images }[];

  const openPhoto = (index: number) =>
    setViewer({
      items: photos.map((p, i) => ({ type: "Photo", title: `${name} — photo ${i + 1}`, imageUrl: p.url })),
      index,
    });

  const openVideo = (index: number) =>
    setViewer({
      items: videos.map((v, i) => ({
        type: "Video",
        title: videos.length > 1 ? `${name} — video ${i + 1}` : `${name} — video`,
        fileUrl: v.url,
      })),
      index,
    });

  return (
    <div className={cn("relative", jakarta.className)}>
      {/* Floating header: stays above the sheet while it scrolls. */}
      <div className="sticky top-0 z-30 h-0">
        <div className="pointer-events-none flex items-center gap-3 px-5 pt-safe-header">
          <Link
            href={backHref}
            aria-label="Back"
            className="press pointer-events-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/80 text-brand-dark shadow-[0_2px_10px_rgba(0,0,0,0.08)] backdrop-blur"
          >
            <ArrowLeft size={20} />
          </Link>
          <div
            aria-hidden={!expanded}
            className={cn(
              "min-w-0 truncate rounded-full bg-white/80 px-4 py-2 text-[14px] font-semibold text-brand-dark shadow-[0_2px_10px_rgba(0,0,0,0.08)] backdrop-blur transition-all duration-500 ease-(--ease-premium)",
              expanded ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
            )}
          >
            {name}
          </div>
        </div>
      </div>

      {/* Hero: pinned behind the sheet. */}
      <div ref={heroRef} className="sticky top-0 z-0 h-[calc(100dvh-136px)] min-h-[440px] overflow-hidden bg-(--app-bg)">
        <div ref={heroInnerRef} className="flex h-full flex-col will-change-transform">
          <div className="px-5 pt-safe-header">
            <div className="h-10" aria-hidden />
            <div className="mt-4">
              <div className="flex items-baseline justify-between gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em]">
                <span className="text-brand-text-secondary">{eyebrow}</span>
                <span className="truncate text-right font-sans text-[12px] font-medium normal-case tracking-normal text-brand-text-secondary">
                  {eyebrowRight}
                </span>
              </div>
              <h1 className="mt-1.5 text-[26px] font-bold leading-[1.1] tracking-[-0.025em] text-brand-dark">
                {name}
              </h1>
            </div>
          </div>
          <div className="relative mt-1 flex-1">
            {heroImage ? (
              <div className="absolute inset-x-5 bottom-14 top-1 overflow-hidden rounded-[28px] bg-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.2)]">
                {heroVideo ? (
                  <HeroVideo src={heroVideo.src} poster={heroVideo.poster ?? heroImage} label={name} />
                ) : (
                  <Image
                    src={heroImage}
                    alt={name}
                    fill
                    priority
                    sizes="(max-width: 448px) 90vw, 408px"
                    className={cn(
                      "animate-in fade-in duration-700 ease-(--ease-premium) motion-reduce:animate-none",
                      "object-cover",
                    )}
                  />
                )}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-[13px] text-brand-text-tertiary">
                Product image coming soon
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Information sheet: overlaps the hero; scrolls naturally, tap the handle to expand/collapse. */}
      <div
        ref={sheetRef}
        className="relative z-10 -mt-12 min-h-[calc(100dvh-72px)] rounded-t-[34px] bg-(--app-bg) px-5 pb-10 shadow-[0_-18px_40px_-18px_rgba(0,0,0,0.18)]"
      >
        <button
          type="button"
          onClick={toggleSheet}
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse product details" : "Expand product details"}
          className="group mx-auto flex h-9 w-24 items-center justify-center outline-none"
        >
          <span className="h-1 w-10 rounded-full bg-black/20 transition-all duration-300 group-hover:w-12 group-hover:bg-brand-dark group-focus-visible:bg-brand-dark" />
        </button>

        <section aria-labelledby="pd-overview">
          <h2 id="pd-overview" className="sr-only">
            Overview
          </h2>
          <p className="text-[16px] leading-relaxed text-brand-dark">{tagline}</p>
          {shortcuts.length > 0 && (
            <div className="mt-5 grid gap-2.5" style={{ gridTemplateColumns: `repeat(${shortcuts.length}, minmax(0, 1fr))` }}>
              {shortcuts.map(({ id, label, count, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => jumpTo(id)}
                  className="press flex flex-col items-start gap-5 rounded-[20px] bg-[#e4e5e7] px-3.5 pb-3 pt-3.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-brand-dark/40"
                >
                  <Icon size={19} strokeWidth={1.7} className="text-brand-text-secondary" />
                  <span>
                    <span className="block text-[13.5px] font-semibold text-brand-dark">{label}</span>
                    <span className="block text-[11.5px] text-brand-text-tertiary">{count ?? (id === "pd-catalogue" ? "PDF" : "Read")}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        {photos.length > 0 && (
          <section id="pd-gallery" className="mt-10 scroll-mt-20">
            <div className="mb-3.5 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-[26px] font-bold leading-[1.1] tracking-[-0.02em] text-brand-dark">Gallery</h2>
                <p className="mt-1 text-[14px] text-brand-text-tertiary">See it from every angle</p>
              </div>
              {hasToggle && <ContextToggle value={mode} onChange={setPhotoMode} productLabel={overviewLabel} />}
            </div>
            <Gallery key={mode} photos={photos} name={name} onOpen={openPhoto} />
          </section>
        )}

        {videos.length > 0 && (
          <section id="pd-video" className="mt-10 scroll-mt-20">
            <SectionTitle title="Video" hint="Watch it in action" />
            <div className="space-y-3">
              {videos.map((v, i) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => openVideo(i)}
                  aria-label={`Play ${name} video${videos.length > 1 ? ` ${i + 1}` : ""}`}
                  className="press group relative flex h-48 w-full items-center justify-center overflow-hidden rounded-[26px] bg-graphite outline-none focus-visible:ring-2 focus-visible:ring-brand-dark/40"
                >
                  {heroImage && (
                    <Image
                      src={heroImage}
                      alt=""
                      fill
                      sizes="(max-width: 448px) 100vw, 408px"
                      className="object-cover opacity-40 transition-transform duration-700 ease-(--ease-premium) group-hover:scale-105"
                    />
                  )}
                  <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-brand-dark shadow-lg transition-transform duration-300 group-hover:scale-105">
                    <Play size={20} className="translate-x-0.5" fill="currentColor" />
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {about && (
          <section id="pd-about" className="mt-10 scroll-mt-20">
            <SectionTitle title={about.title} />
            <p className="rounded-[22px] bg-[#e4e5e7] p-4 text-[15px] leading-relaxed text-brand-text-secondary">
              {about.text}
            </p>
          </section>
        )}

        {specs.length > 0 && (
          <section id="pd-specs" className="mt-10 scroll-mt-20">
            <SectionTitle title="Specifications" />
            <dl className="divide-y divide-black/[0.08] overflow-hidden rounded-[22px] bg-[#e4e5e7]">
              {specs.map((sp) => (
                <div key={sp.label} className="flex items-baseline justify-between gap-6 px-4 py-3.5">
                  <dt className="text-[13.5px] text-brand-text-secondary">{sp.label}</dt>
                  <dd className="text-right text-[15px] font-semibold text-brand-dark">{sp.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {catalogue && (
          <section id="pd-catalogue" className="mt-10 scroll-mt-20">
            <SectionTitle title="Catalogue & resources" />
            <div className="flex items-center gap-3.5 rounded-[22px] bg-[#e4e5e7] p-3.5">
              <div className="flex h-14 w-11 shrink-0 items-center justify-center rounded-md bg-graphite">
                <span className="font-mono text-[9px] font-bold tracking-wider text-white/80">PDF</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold leading-tight text-brand-dark">{catalogue.title}</div>
                <div className="mt-1 text-[12px] leading-snug text-brand-text-secondary">
                  {catalogueUrl ? catalogue.meta : "Catalogue not yet available"}
                </div>
              </div>
              {catalogueUrl && (
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPdfOpen(true)}
                    className="press rounded-full bg-brand-dark px-4 py-2 text-[12.5px] font-semibold text-white"
                  >
                    View
                  </button>
                  <a
                    href={catalogueUrl}
                    download
                    aria-label="Download catalogue"
                    className="press flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-dark"
                  >
                    <Download size={15} />
                  </a>
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      {viewer && <MediaPreviewModal items={viewer.items} initialIndex={viewer.index} onClose={() => setViewer(null)} />}
      {pdfOpen && catalogueUrl && catalogue && (
        <PdfPreviewModal title={catalogue.title} url={catalogueUrl} onClose={() => setPdfOpen(false)} />
      )}
    </div>
  );
}
