"use client";

import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";

// In-app PDF reader: pages are drawn to <canvas> with pdf.js, so it looks the same on every
// phone/tablet/browser (no built-in PDF plugin or external viewer needed) and each page is
// only rendered once it scrolls near the screen, which keeps big catalogues light.

async function openDocument(url: string) {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
  return pdfjs.getDocument({ url });
}

function Page({ doc, number, width }: { doc: PDFDocumentProxy; number: number; width: number }) {
  const holder = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ratio, setRatio] = useState(1.414);
  const [near, setNear] = useState(number <= 2);

  useEffect(() => {
    if (near || !holder.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "800px 0px" });
    io.observe(holder.current);
    return () => io.disconnect();
  }, [near]);

  useEffect(() => {
    if (!near || !width) return;
    let task: { cancel: () => void } | undefined;
    let dead = false;
    doc.getPage(number).then((page) => {
      if (dead || !canvas.current) return;
      const base = page.getViewport({ scale: 1 });
      const scale = (width / base.width) * Math.min(window.devicePixelRatio || 1, 2);
      const viewport = page.getViewport({ scale });
      const el = canvas.current;
      el.width = viewport.width;
      el.height = viewport.height;
      setRatio(base.height / base.width);
      const render = page.render({ canvas: el, viewport });
      task = render;
      render.promise.catch(() => {});
    });
    return () => {
      dead = true;
      task?.cancel();
    };
  }, [near, doc, number, width]);

  return (
    <div ref={holder} className="mx-auto mb-2 bg-white shadow-sm" style={{ width, height: width * ratio }}>
      <canvas ref={canvas} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

export function PdfPages({ url }: { url: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [width, setWidth] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let dead = false;
    let task: { promise: Promise<PDFDocumentProxy>; destroy: () => Promise<void> } | null = null;
    openDocument(url)
      .then((t) => {
        task = t;
        if (dead) return t.destroy();
        return t.promise.then((d) => !dead && setDoc(d));
      })
      .catch(() => !dead && setFailed(true));
    return () => {
      dead = true;
      task?.destroy();
    };
  }, [url]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setWidth(Math.min(el.clientWidth - 16, 900));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={box} className="flex-1 overflow-y-auto bg-[#e7e7e6] p-2">
      {failed ? (
        <p className="p-6 text-center text-[13px] text-neutral-600">
          This file could not be shown here. Use the download button above.
        </p>
      ) : !doc ? (
        <p className="p-6 text-center text-[13px] text-neutral-600">Loading…</p>
      ) : (
        Array.from({ length: doc.numPages }, (_, i) => <Page key={i} doc={doc} number={i + 1} width={width} />)
      )}
    </div>
  );
}
