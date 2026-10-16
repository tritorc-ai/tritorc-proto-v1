"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { PdfPreviewModal } from "./PdfPreviewModal";

export function ProductCatalogueCard({
  title,
  meta,
  url,
}: {
  title: string;
  meta: string;
  url: string;
}) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const canPreview = !!url && url !== "#";

  return (
    <>
      <button
        type="button"
        onClick={() => canPreview && setPreviewOpen(true)}
        disabled={!canPreview}
        className="flex w-full items-center gap-3 rounded-lg bg-[#e4e5e7] p-3 text-left"
      >
        <div className="flex h-13 w-10.5 shrink-0 items-center justify-center rounded-[3px] bg-brand-dark">
          <span className="font-mono text-[9px] font-bold text-white">PDF</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold leading-tight text-brand-dark">{title}</div>
          <div className="mt-0.5 text-[11.5px] leading-snug text-brand-text-secondary">
            {canPreview ? meta : `${meta} · Not yet available`}
          </div>
        </div>
        {canPreview ? (
          <a
            href={url}
            download
            onClick={(e) => e.stopPropagation()}
            className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full bg-brand-dark text-white"
            aria-label="Download PDF"
          >
            <Download size={14} />
          </a>
        ) : (
          <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full bg-black/10 text-black/30">
            <Download size={14} />
          </div>
        )}
      </button>

      {previewOpen && canPreview && (
        <PdfPreviewModal title={title} url={url} onClose={() => setPreviewOpen(false)} />
      )}
    </>
  );
}
