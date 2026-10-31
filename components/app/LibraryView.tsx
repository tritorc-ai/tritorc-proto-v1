"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Grid2x2, Grid3x3, Play, Search } from "lucide-react";
import type { LibraryAsset } from "@/lib/mock/content";
import { cn } from "@/lib/utils";
import { MediaPreviewModal } from "./MediaPreviewModal";
import { PdfThumbnail } from "./PdfThumbnail";

const TYPES = ["All", "Catalogue", "Video", "Photo"] as const;
type TypeFilter = (typeof TYPES)[number];

type LibraryAssetWithImage = LibraryAsset & { imageUrl?: string };

export function LibraryView({ assets }: { assets: LibraryAssetWithImage[] }) {
  const [search, setSearch] = useState("");
  // Opens on Catalogue (the thing people come here for); on All if there are no catalogues, so it is never empty.
  const [typeFilter, setTypeFilter] = useState<TypeFilter>(() =>
    assets.some((a) => a.type === "Catalogue") ? "Catalogue" : "All",
  );
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  // Photos are shown like a phone gallery; on a phone the user can switch between 3 and 2 per row.
  const [photoCols, setPhotoCols] = useState<2 | 3>(3);

  const results = useMemo(() => {
    return assets.filter((a) => {
      if (typeFilter !== "All" && a.type !== typeFilter) return false;
      if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [assets, search, typeFilter]);

  const typeCounts = useMemo(() => {
    const counts: Record<TypeFilter, number> = { All: assets.length, Catalogue: 0, Video: 0, Photo: 0 };
    for (const a of assets) counts[a.type] += 1;
    return counts;
  }, [assets]);

  function canPreviewAsset(a: LibraryAssetWithImage) {
    if (a.youtubeId) return true;
    return a.type === "Catalogue" ? !!a.fileUrl && a.fileUrl !== "#" : !!(a.fileUrl || a.imageUrl);
  }

  // Catalogues stay as named cards; videos are big bare pictures (no file names) and photos a gallery of bare
  // pictures below them. `ordered` is the order on screen, so swiping through the viewer follows what the user sees.
  const cards = useMemo(() => results.filter((a) => a.type === "Catalogue"), [results]);
  const videos = useMemo(() => results.filter((a) => a.type === "Video"), [results]);
  const photos = useMemo(() => results.filter((a) => a.type === "Photo"), [results]);
  const ordered = useMemo(() => [...cards, ...videos, ...photos], [cards, videos, photos]);

  // Swiping/arrow-keying through the preview modal moves within this same
  // filtered, previewable subset — not the full `results` list, so it never
  // lands on a disabled tile with nothing to show.
  const previewableResults = useMemo(() => ordered.filter(canPreviewAsset), [ordered]);

  return (
    <div className="px-5 pb-6 tablet:px-8 tablet-lg:px-10">
      {/* Search */}
      <label className="relative block">
        <span className="sr-only">Search the library</span>
        <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/40" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by product, series, or keyword"
          className="w-full rounded-full border border-black/8 bg-white py-3.5 pl-11 pr-5 text-[14px] text-brand-dark outline-none placeholder:text-black/40 focus:border-black/40"
        />
      </label>

      {/* Type chips */}
      <div role="group" aria-label="Filter by type" className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 tablet:mx-0 tablet:flex-wrap tablet:px-0">
        {TYPES.map((t) => {
          const active = t === typeFilter;
          return (
            <button
              key={t}
              type="button"
              aria-pressed={active}
              onClick={() => setTypeFilter(t)}
              className={cn(
                "press shrink-0 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors duration-200",
                active ? "border-black bg-black text-white" : "border-black/10 bg-white text-black/75"
              )}
            >
              {t}
              <span className={cn("ml-1.5 text-[11px] font-medium", active ? "text-white/60" : "text-black/40")}>
                {typeCounts[t]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mb-3 mt-5 text-[12.5px] text-black/50" aria-live="polite">
        {results.length} {results.length === 1 ? "item" : "items"}
      </div>

      {/* Results: catalogues as named cards */}
      <div className="grid grid-cols-2 gap-3 tablet:grid-cols-3 tablet:gap-4 tablet-lg:grid-cols-4">
        {cards.map((a) => {
          const canPreview = canPreviewAsset(a);
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => canPreview && setPreviewIndex(previewableResults.indexOf(a))}
              disabled={!canPreview}
              className={cn(
                "press flex flex-col overflow-hidden rounded-[22px] bg-white text-left",
                !canPreview && "cursor-default"
              )}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#ececec]">
                {a.imageUrl ? (
                  <>
                    <Image src={a.imageUrl} alt="" fill sizes="64px" aria-hidden className="scale-125 object-cover opacity-70 blur-2xl" />
                    <Image src={a.imageUrl} alt="" fill sizes="(max-width: 448px) 45vw, (max-width: 1024px) 30vw, 260px" className="object-contain" />
                  </>
                ) : (
                  <PdfThumbnail title={a.title} />
                )}
                <div className="absolute left-2 top-2 rounded-full bg-black/80 px-2 py-0.5 text-[10px] font-semibold text-white">
                  {a.type}
                </div>
                {canPreview && (
                  <div className="absolute bottom-2 right-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-black">
                    Preview
                  </div>
                )}
              </div>
              <div className="px-3 pb-3.5 pt-2.5">
                <div className="line-clamp-2 text-[13px] font-semibold leading-tight text-brand-dark">{a.title}</div>
                <div className="mt-1 line-clamp-1 text-[11.5px] leading-snug text-black/50">{a.categoryLabel}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Videos: big 16:9 pictures with a play button and no file names (the name stays in the screen-reader
          label). One tap opens that video in the player, which plays one video at a time. */}
      {videos.length > 0 && (
        <section aria-label="Videos" className={cn(cards.length > 0 && "mt-7")}>
          {cards.length > 0 && <h2 className="mb-2.5 text-[15px] font-semibold text-brand-dark">Videos</h2>}
          <div className="grid grid-cols-1 gap-3 tablet:grid-cols-2 tablet:gap-4 tablet-lg:grid-cols-3">
            {videos.map((a) => {
              const canPreview = canPreviewAsset(a);
              return (
                <button
                  key={a.id}
                  type="button"
                  aria-label={`Play ${a.title}`}
                  onClick={() => canPreview && setPreviewIndex(previewableResults.indexOf(a))}
                  disabled={!canPreview}
                  className={cn(
                    "press group relative block aspect-video overflow-hidden rounded-[22px] bg-[#1c1c1e] shadow-[0_8px_24px_-8px_rgba(0,0,0,.35)] ring-1 ring-black/5",
                    !canPreview && "cursor-default",
                  )}
                >
                  {a.imageUrl ? (
                    <Image
                      src={a.imageUrl}
                      alt=""
                      fill
                      sizes="(max-width: 448px) 100vw, (max-width: 1024px) 45vw, 360px"
                      className="object-cover transition-transform duration-500 group-active:scale-[1.04]"
                    />
                  ) : (
                    <div className="h-full w-full bg-[repeating-linear-gradient(135deg,#2a2a2c_0px,#2a2a2c_9px,#222224_9px,#222224_18px)]" />
                  )}
                  {/* Soft shade top and bottom so the play button reads on any picture */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/15" />
                  {canPreview && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/25 shadow-[0_6px_20px_rgba(0,0,0,.35)] ring-1 ring-white/60 backdrop-blur-md transition-transform duration-200 group-active:scale-95">
                        <Play size={22} className="translate-x-0.5 text-white" fill="currentColor" />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Photos: a gallery like the phone's own. Square tiles, hairline gaps, edge to edge on a phone, and no
          file names (they stay in the screen-reader label and in the viewer's header). */}
      {photos.length > 0 && (
        <section aria-label="Photos" className={cn(cards.length > 0 && "mt-7")}>
          <div className="mb-2.5 flex items-center justify-between">
            {cards.length > 0 ? (
              <h2 className="text-[15px] font-semibold text-brand-dark">Photos</h2>
            ) : (
              <span />
            )}
            <div role="group" aria-label="Photos per row" className="flex rounded-full bg-black/[0.06] p-0.5 tablet:hidden">
              {([3, 2] as const).map((n) => {
                const Icon = n === 3 ? Grid3x3 : Grid2x2;
                return (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={photoCols === n}
                    aria-label={`${n} photos per row`}
                    onClick={() => setPhotoCols(n)}
                    className={cn(
                      "flex h-7 w-9 items-center justify-center rounded-full transition-colors",
                      photoCols === n ? "bg-white text-brand-dark shadow-sm" : "text-black/45",
                    )}
                  >
                    <Icon size={15} strokeWidth={2} />
                  </button>
                );
              })}
            </div>
          </div>
          <div
            className={cn(
              "-mx-5 grid gap-[2px] tablet:mx-0 tablet:grid-cols-5 tablet-lg:grid-cols-7",
              photoCols === 3 ? "grid-cols-3" : "grid-cols-2",
            )}
          >
            {photos.map((a) => {
              const canPreview = canPreviewAsset(a);
              return (
                <button
                  key={a.id}
                  type="button"
                  aria-label={a.title}
                  onClick={() => canPreview && setPreviewIndex(previewableResults.indexOf(a))}
                  disabled={!canPreview}
                  className="press relative block aspect-square overflow-hidden bg-[#e4e4e4] active:opacity-80"
                >
                  {a.imageUrl ? (
                    <Image
                      src={a.imageUrl}
                      alt=""
                      fill
                      sizes={photoCols === 3 ? "(max-width: 448px) 34vw, 200px" : "(max-width: 448px) 51vw, 200px"}
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-[repeating-linear-gradient(135deg,#efefef_0px,#efefef_9px,#e4e4e4_9px,#e4e4e4_18px)]" />
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {previewIndex !== null && (
        <MediaPreviewModal
          items={previewableResults}
          initialIndex={previewIndex}
          onClose={() => setPreviewIndex(null)}
        />
      )}

      {results.length === 0 && (
        <div className="rounded-[22px] bg-white px-5 py-10 text-center text-[13.5px] text-black/55">
          No results. Try a different search or filter.
        </div>
      )}
    </div>
  );
}
