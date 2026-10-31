"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Download, ExternalLink, X } from "lucide-react";
import { PdfPages } from "./PdfPages";

export function PdfPreviewModal({
  title,
  url,
  onClose,
}: {
  title: string;
  url: string;
  onClose: () => void;
}) {
  // The reader is full screen: the page behind must not scroll under it, and Escape closes it.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // Rendered on <body>, not inside the page: whatever transform or stacking context a page wrapper has
  // (its fade-in, for one) then cannot shrink "fixed to the screen" into "fixed to the page", or put the
  // tab bar on top of the reader.
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-50 flex flex-col bg-black/80">
      <div
        className="flex items-center justify-between gap-2.5 bg-brand-dark px-4 pb-3"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)" }}
      >
        <div className="min-w-0 flex-1 truncate text-[13px] font-semibold text-white">{title}</div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white"
          aria-label="Open PDF in new tab"
        >
          <ExternalLink size={15} />
        </a>
        <a
          href={url}
          download
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white"
          aria-label="Download PDF"
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
      <PdfPages url={url} />
    </div>,
    document.body,
  );
}
