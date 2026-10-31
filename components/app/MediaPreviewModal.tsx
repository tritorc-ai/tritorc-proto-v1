"use client";

import { useEffect, useRef, useState, type TouchEvent } from "react";
import { ChevronLeft, ChevronRight, Download, ExternalLink, X } from "lucide-react";
import { PdfPreviewModal } from "./PdfPreviewModal";
import { PhotoViewer } from "./PhotoViewer";
import { cn } from "@/lib/utils";

export interface PreviewableAsset {
  type: "Catalogue" | "Video" | "Photo";
  title: string;
  fileUrl?: string;
  imageUrl?: string;
  // A YouTube video plays in an embedded YouTube player (iframe) with its normal controls.
  youtubeId?: string;
}

const SWIPE_THRESHOLD_PX = 50;

/** Photo/Video chrome shared with PdfPreviewModal's header, plus an <img>/
 * <video> body. PDFs delegate straight to PdfPreviewModal (Google Docs
 * viewer) rather than duplicating that logic here. Swipe left/right (touch)
 * or Arrow keys (desktop) move between `items` without closing the modal. */
export function MediaPreviewModal({
  items,
  initialIndex,
  onClose,
}: {
  items: PreviewableAsset[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const [playing, setPlaying] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const asset = items[index];
  // Photos move among themselves (Next never jumps from a photo to a catalogue); everything else walks the list.
  const photoIndices = items.flatMap((a, i) => (a.type === "Photo" ? [i] : []));
  const photoPos = photoIndices.indexOf(index); // -1 when this is not a photo
  const isPhoto = photoPos >= 0;
  const canGoPrev = isPhoto ? photoPos > 0 : index > 0;
  const canGoNext = isPhoto ? photoPos < photoIndices.length - 1 : index < items.length - 1;

  function step(dir: 1 | -1, wrap = false) {
    setIndex((i) => {
      const pos = photoIndices.indexOf(i);
      if (pos >= 0) {
        const next = pos + dir;
        if (next >= 0 && next < photoIndices.length) return photoIndices[next];
        return wrap ? photoIndices[(next + photoIndices.length) % photoIndices.length] : i;
      }
      return Math.min(items.length - 1, Math.max(0, i + dir));
    });
  }
  const goPrev = () => step(-1);
  const goNext = () => step(1);

  // Slideshow: while playing on a photo, move to the next one every few seconds (and start over after the last).
  useEffect(() => {
    if (!playing || !isPhoto) return;
    const t = setTimeout(() => step(1, true), 3500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, index, isPhoto]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, index]);

  function onTouchStart(e: TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: TouchEvent) {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return;
    if (dx < 0) goNext();
    else goPrev();
  }

  if (!asset) return null;

  const navArrows = items.length > 1 && (
    <>
      <button
        onClick={goPrev}
        disabled={!canGoPrev}
        aria-label="Previous"
        className={cn(
          "fixed left-2 top-1/2 z-[60] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white",
          !canGoPrev && "pointer-events-none opacity-0"
        )}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={goNext}
        disabled={!canGoNext}
        aria-label="Next"
        className={cn(
          "fixed right-2 top-1/2 z-[60] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white",
          !canGoNext && "pointer-events-none opacity-0"
        )}
      >
        <ChevronRight size={20} />
      </button>
      <div className="fixed left-1/2 top-[70px] z-[60] -translate-x-1/2 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white">
        {index + 1} / {items.length}
      </div>
    </>
  );

  if (asset.type === "Catalogue") {
    if (!asset.fileUrl) return null;
    return (
      <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} className="contents">
        <PdfPreviewModal title={asset.title} url={asset.fileUrl} onClose={onClose} />
        {navArrows}
      </div>
    );
  }

  // YouTube: one embedded player at a time (the key makes a new player, and stops the old one, when swiping to
  // another video). No title in the header, just the buttons.
  if (asset.youtubeId) {
    return (
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="fixed inset-0 z-50 flex flex-col bg-black/95"
      >
        <div className="flex items-center justify-end gap-2.5 px-4 py-3">
          <a
            href={`https://www.youtube.com/watch?v=${asset.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white"
            aria-label="Open video on YouTube"
          >
            <ExternalLink size={15} />
          </a>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white"
            aria-label="Close video"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex flex-1 items-center justify-center px-3 pb-6">
          <div className="aspect-video w-full max-w-[960px] overflow-hidden rounded-2xl bg-black shadow-[0_10px_40px_rgba(0,0,0,.5)]">
            <iframe
              key={asset.youtubeId}
              src={`https://www.youtube-nocookie.com/embed/${asset.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              title={asset.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="h-full w-full border-0"
            />
          </div>
        </div>
        {navArrows}
      </div>
    );
  }

  // Real Strapi photos carry a full-resolution fileUrl separate from the
  // grid's thumbnail; mock/fallback assets only ever have the one imageUrl
  // (already full-size for those), so fall back to it.
  const mediaUrl = asset.fileUrl ?? asset.imageUrl;
  if (!mediaUrl) return null;

  // Photos get their own viewer (navigation, slideshow, zoom, full screen). The key starts each photo at 100%.
  if (asset.type === "Photo") {
    return (
      <PhotoViewer
        key={mediaUrl}
        title={asset.title}
        url={mediaUrl}
        position={photoPos + 1}
        total={photoIndices.length}
        playing={playing}
        onTogglePlay={() => setPlaying((p) => !p)}
        onPrev={goPrev}
        onNext={goNext}
        onClose={onClose}
      />
    );
  }

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="fixed inset-0 z-50 flex flex-col bg-black/90"
    >
      <div className="flex items-center justify-between gap-2.5 bg-brand-dark px-4 py-3">
        <div className="min-w-0 flex-1 truncate text-[13px] font-semibold text-white">{asset.title}</div>
        <a
          href={mediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white"
          aria-label={`Open ${asset.type.toLowerCase()} in new tab`}
        >
          <ExternalLink size={15} />
        </a>
        <a
          href={mediaUrl}
          download
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white"
          aria-label={`Download ${asset.type.toLowerCase()}`}
        >
          <Download size={15} />
        </a>
        <button
          onClick={onClose}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white"
          aria-label="Close preview"
        >
          <X size={16} />
        </button>
      </div>
      <div className="flex flex-1 items-center justify-center overflow-auto p-4">
        <video
          key={mediaUrl}
          src={mediaUrl}
          controls
          autoPlay
          className="max-h-full max-w-full rounded-lg shadow-[0_10px_40px_rgba(0,0,0,.4)]"
        />
      </div>
      {navArrows}
    </div>
  );
}
