"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Download, FileText, Info, ListChecks, Play } from "lucide-react";
import type { ProductSpec } from "@/lib/mock/content";
import { MediaPreviewModal, type PreviewableAsset } from "./MediaPreviewModal";
import { PdfPreviewModal } from "./PdfPreviewModal";
import { jakarta } from "@/lib/fonts";
import { HeroVideo } from "./HeroVideo";
import type { HeroVideoSource } from "@/lib/heroVideos";
import { cn } from "@/lib/utils";

/** Header + sheet-handle offset used when expanding the sheet / jumping to a section. */
const HEADER_OFFSET = 72;

/** Same rule as the `tablet:` variant in app/globals.css: a touch screen at least 700px wide and 600px tall. */
const TABLET_QUERY = "(min-width: 700px) and (min-height: 600px) and (pointer: coarse)";

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

export interface DetailMedia {
  id: string;
  kind: "photo" | "video";
  context: "product" | "in-use";
  url: string;
}

/**
 * Shared detail screen for products and services: a hero card behind a
 * rounded information sheet (overview, video, about, specs,
 * catalogue). Optional sections only render when their data exists.
 */
export function DetailSheetView({
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
  /** No longer used (the photo gallery was removed); kept so existing callers still compile. */
  overviewLabel?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [viewer, setViewer] = useState<{ items: PreviewableAsset[]; index: number } | null>(null);
  const [pdfOpen, setPdfOpen] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const heroInnerRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const productPhotos = media.filter((m) => m.kind === "photo" && m.context === "product");
  const videos = media.filter((m) => m.kind === "video");
  const heroImage = heroImageUrl ?? productPhotos[0]?.url;

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
      // Tablet and up: image and details sit side by side, so there is nothing to slide over.
      if (window.matchMedia(TABLET_QUERY).matches) {
        if (inner) {
          inner.style.transform = "";
          inner.style.opacity = "";
        }
        setExpanded(false);
        return;
      }
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
    specs.length > 0 && { id: "pd-specs", label: "Specs", count: `${specs.length}`, icon: ListChecks },
    about && { id: "pd-about", label: "About", count: undefined, icon: Info },
    catalogue && { id: "pd-catalogue", label: "Catalogue", count: undefined, icon: FileText },
  ].filter(Boolean) as { id: string; label: string; count?: string; icon: typeof Info }[];

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
        <div className="pointer-events-none flex items-center gap-3 px-5 pt-safe-header tablet:px-8 tablet-lg:px-10">
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

      {/* Phone: hero pinned behind a sheet that slides up over it. Tablet and up: two columns, the
          hero stays in view on the left while the details scroll on the right. */}
      <div className="tablet:grid tablet:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] tablet:items-start tablet:gap-8 tablet:px-8 tablet-lg:grid-cols-2 tablet-lg:gap-12 tablet-lg:px-10">
      {/* Hero: pinned behind the sheet. */}
      <div ref={heroRef} className="sticky top-0 z-0 h-[calc(100dvh-136px)] min-h-[440px] overflow-hidden bg-(--app-bg) tablet:h-dvh tablet:min-h-0">
        <div ref={heroInnerRef} className="flex h-full flex-col will-change-transform">
          <div className="px-5 pt-safe-header tablet:px-0">
            <div className="h-10" aria-hidden />
            <div className="mt-4">
              <div className="flex items-baseline justify-between gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em]">
                <span className="text-brand-text-secondary">{eyebrow}</span>
                <span className="truncate text-right font-sans text-[12px] font-medium normal-case tracking-normal text-brand-text-secondary">
                  {eyebrowRight}
                </span>
              </div>
              <h1 className="mt-1.5 text-[26px] font-bold leading-[1.1] tracking-[-0.025em] text-brand-dark tablet:text-[32px]">
                {name}
              </h1>
            </div>
          </div>
          {/* Phone: the picture fills the pinned hero. Tablet: a fixed 4:5 box (the shape of the product and
              service photos) so every page shows the picture at the same ratio, whatever the screen height. */}
          <div className="relative mt-1 flex-1 tablet:mt-5 tablet:flex-none">
            {heroImage ? (
              <div className="absolute inset-x-5 bottom-14 top-1 overflow-hidden rounded-[28px] bg-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.2)] tablet:relative tablet:inset-auto tablet:aspect-[4/5] tablet:w-full tablet:max-w-[460px]">
                {heroVideo ? (
                  <HeroVideo src={heroVideo.src} poster={heroVideo.poster ?? heroImage} label={name} />
                ) : (
                  <Image
                    src={heroImage}
                    alt={name}
                    fill
                    priority
                    sizes="(max-width: 448px) 90vw, (max-width: 1024px) 45vw, 560px"
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
        className="relative z-10 -mt-12 min-h-[calc(100dvh-72px)] rounded-t-[34px] bg-(--app-bg) px-5 pb-10 shadow-[0_-18px_40px_-18px_rgba(0,0,0,0.18)] tablet:mt-0 tablet:min-h-0 tablet:rounded-none tablet:px-0 tablet:pb-16 tablet:pt-24 tablet:shadow-none"
      >
        <button
          type="button"
          onClick={toggleSheet}
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse product details" : "Expand product details"}
          className="group mx-auto flex h-9 w-24 items-center justify-center outline-none tablet:hidden"
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
      </div>

      {viewer && <MediaPreviewModal items={viewer.items} initialIndex={viewer.index} onClose={() => setViewer(null)} />}
      {pdfOpen && catalogueUrl && catalogue && (
        <PdfPreviewModal title={catalogue.title} url={catalogueUrl} onClose={() => setPdfOpen(false)} />
      )}
    </div>
  );
}
