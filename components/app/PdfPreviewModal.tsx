"use client";

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
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/80">
      <div className="flex items-center justify-between gap-2.5 bg-brand-dark px-4 py-3">
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
    </div>
  );
}
