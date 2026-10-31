"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronDown, Play, Search } from "lucide-react";
import type { LibraryAsset } from "@/lib/mock/content";
import { cn } from "@/lib/utils";
import { MediaPreviewModal } from "./MediaPreviewModal";
import { PdfThumbnail } from "./PdfThumbnail";

const TYPES = ["All", "Catalogue", "Video", "Photo"] as const;
type TypeFilter = (typeof TYPES)[number];

type LibraryAssetWithImage = LibraryAsset & { imageUrl?: string };

export function LibraryView({ assets }: { assets: LibraryAssetWithImage[] }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");
  const [category, setCategory] = useState("All categories");
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const categories = useMemo(
    () => ["All categories", ...Array.from(new Set(assets.map((a) => a.categoryLabel)))],
    [assets]
  );

  const results = useMemo(() => {
    return assets.filter((a) => {
      if (typeFilter !== "All" && a.type !== typeFilter) return false;
      if (category !== "All categories" && a.categoryLabel !== category) return false;
      if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [assets, search, typeFilter, category]);

  const typeCounts = useMemo(() => {
    const counts: Record<TypeFilter, number> = { All: assets.length, Catalogue: 0, Video: 0, Photo: 0 };
    for (const a of assets) counts[a.type] += 1;
    return counts;
  }, [assets]);

  function canPreviewAsset(a: LibraryAssetWithImage) {
    return a.type === "Catalogue" ? !!a.fileUrl && a.fileUrl !== "#" : !!(a.fileUrl || a.imageUrl);
  }

  // Swiping/arrow-keying through the preview modal moves within this same
  // filtered, previewable subset — not the full `results` list, so it never
  // lands on a disabled tile with nothing to show.
  const previewableResults = useMemo(() => results.filter(canPreviewAsset), [results]);

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

      {/* Category */}
      <label className="relative mt-3 block">
        <span className="sr-only">Category</span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full appearance-none rounded-full border border-black/8 bg-white py-3 pl-5 pr-11 text-[13.5px] font-semibold text-brand-dark outline-none focus:border-black/40"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <ChevronDown size={17} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black/50" />
      </label>

      <div className="mb-3 mt-5 text-[12.5px] text-black/50" aria-live="polite">
        {results.length} {results.length === 1 ? "item" : "items"}
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 gap-3 tablet:grid-cols-3 tablet:gap-4 tablet-lg:grid-cols-4">
        {results.map((a) => {
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
              <div className="relative aspect-[4/3] overflow-hidden">
                {a.imageUrl ? (
                  <Image src={a.imageUrl} alt="" fill sizes="(max-width: 448px) 45vw, (max-width: 1024px) 30vw, 260px" className="object-cover" />
                ) : a.type === "Catalogue" ? (
                  <PdfThumbnail title={a.title} />
                ) : (
                  <div className="h-full w-full bg-[repeating-linear-gradient(135deg,#efefef_0px,#efefef_9px,#e4e4e4_9px,#e4e4e4_18px)]" />
                )}
                {a.type === "Video" && canPreview && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90">
                      <Play size={14} className="translate-x-0.5 text-black" fill="currentColor" />
                    </div>
                  </div>
                )}
                <div className="absolute left-2 top-2 rounded-full bg-black/80 px-2 py-0.5 text-[10px] font-semibold text-white">
                  {a.type}
                </div>
                {canPreview && a.type !== "Video" && (
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
