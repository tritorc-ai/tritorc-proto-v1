"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import type { LibraryAsset } from "@/lib/mock/content";
import { cn } from "@/lib/utils";
import { MediaPreviewModal } from "./MediaPreviewModal";
import { PdfThumbnail } from "./PdfThumbnail";

const TYPES = ["All", "Catalogue", "Video", "Photo"] as const;
type TypeFilter = (typeof TYPES)[number];

const TYPE_COLORS: Record<Exclude<TypeFilter, "All">, string> = {
  Catalogue: "#d6312f",
  Video: "#7c3aed",
  Photo: "#2563eb",
};

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

  function canPreviewAsset(a: LibraryAssetWithImage) {
    return a.type === "Catalogue" ? !!a.fileUrl && a.fileUrl !== "#" : !!(a.fileUrl || a.imageUrl);
  }

  // Swiping/arrow-keying through the preview modal moves within this same
  // filtered, previewable subset — not the full `results` list, so it never
  // lands on a disabled tile with nothing to show.
  const previewableResults = useMemo(() => results.filter(canPreviewAsset), [results]);

  return (
    <div className="px-5 pb-6">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by product, series, or keyword..."
        className="mt-3.5 w-full rounded-full border-0 bg-white px-5 py-3.5 text-[14px] text-brand-dark shadow-[0_1px_2px_rgba(0,0,0,.03),0_6px_14px_rgba(0,0,0,.05)] outline-none"
      />

      <div className="mt-3.5 rounded-[26px] bg-white p-3.5">
        <div className="flex gap-1.5 pb-2.5">
          {TYPES.map((t) => {
            const active = t === typeFilter;
            const color = t === "All" ? "#171717" : TYPE_COLORS[t];
            return (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-[10px] px-1 py-2 text-[11px] font-semibold"
                )}
                style={
                  active
                    ? { background: color, color: "#fff", border: `1px solid ${color}` }
                    : { background: `${color}14`, color, border: `1px solid ${color}33` }
                }
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: active ? "#fff" : color }} />
                {t}
              </button>
            );
          })}
        </div>
        <div className="mb-1.5 h-px bg-black/6" />
        <div className="mb-1.5 pt-1 font-mono text-[10.5px] font-semibold uppercase tracking-wider text-neutral-400">
          Category
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-black/12 bg-white px-3 py-2.75 text-[13px] font-semibold text-brand-dark"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {results.map((a) => {
          const color = TYPE_COLORS[a.type];
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
              <div className="relative h-24 overflow-hidden">
                {a.imageUrl ? (
                  <Image src={a.imageUrl} alt="" fill sizes="50vw" className="object-cover" />
                ) : a.type === "Catalogue" ? (
                  <PdfThumbnail title={a.title} />
                ) : (
                  <div className="h-full w-full bg-[repeating-linear-gradient(135deg,#eef0f2_0px,#eef0f2_9px,#e3e7ea_9px,#e3e7ea_18px)]" />
                )}
                {a.type === "Video" && canPreview && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/85">
                      <Play size={13} className="translate-x-0.5 text-brand-dark" fill="currentColor" />
                    </div>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-0.5" style={{ background: color }} />
                <div
                  className="absolute left-1.5 top-1.5 rounded-[2px] px-1.5 py-0.5 font-mono text-[9px] font-bold text-white"
                  style={{ background: color }}
                >
                  {a.type}
                </div>
                {canPreview && a.type !== "Video" && (
                  <div className="absolute bottom-1.5 right-1.5 rounded-[2px] bg-black/55 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                    Preview
                  </div>
                )}
              </div>
              <div className="px-2.5 py-2.25">
                <div className="text-[11.5px] font-semibold leading-tight text-brand-dark">
                  {a.title}
                </div>
                <div className="mt-0.75 text-[10.5px] leading-snug text-brand-text-secondary">
                  {a.categoryLabel}
                </div>
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
        <div className="py-10 text-center text-[13px] text-brand-text-secondary">
          No results. Try a different search or filter.
        </div>
      )}
    </div>
  );
}
