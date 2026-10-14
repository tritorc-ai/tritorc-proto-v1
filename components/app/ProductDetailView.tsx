"use client";

import { useState } from "react";
import { ArrowLeft, Play } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/lib/mock/content";
import { Carousel } from "./Carousel";
import { ShowcaseCard } from "@/components/products/ShowcaseCard";
import { SectionLabel } from "./SectionLabel";
import { ProductCatalogueCard } from "./ProductCatalogueCard";
import { cn } from "@/lib/utils";

function ToggleTabs({
  value,
  onChange,
}: {
  value: "product" | "in-use";
  onChange: (v: "product" | "in-use") => void;
}) {
  return (
    <div className="flex rounded-lg bg-[#eceef0] p-0.75">
      {(["product", "in-use"] as const).map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={cn(
            "rounded-md px-3 py-1.5 text-[11px] font-semibold",
            value === v ? "bg-brand-dark text-white" : "text-brand-text-secondary"
          )}
        >
          {v === "product" ? "Product" : "In Use"}
        </button>
      ))}
    </div>
  );
}

export function ProductDetailView({
  product,
  heroImageUrl,
}: {
  product: Product;
  heroImageUrl?: string;
}) {
  const [photoMode, setPhotoMode] = useState<"product" | "in-use">("product");
  const [videoMode, setVideoMode] = useState<"product" | "in-use">("product");

  const photos = product.media.filter((m) => m.kind === "photo" && m.context === photoMode);
  const video = product.media.find((m) => m.kind === "video" && m.context === videoMode);
  const hasAnyVideo = product.media.some((m) => m.kind === "video");
  // No per-product "product" shot tagged yet in Strapi (see build plan's
  // photo:product/in-use content-prep step) — fall back to the product
  // category's hero image rather than an empty state, only for "Product"
  // mode (we don't have a category-level "in use" photo to fall back to).
  const showHeroFallback = photos.length === 0 && photoMode === "product" && heroImageUrl;
  const heroImage =
    heroImageUrl ?? product.media.find((m) => m.kind === "photo" && m.context === "product")?.url;

  return (
    <div>
      <div className="sticky top-0 z-10 flex items-center gap-2.5 bg-brand-surface px-5 pb-2.5 pt-safe-header">
        <Link href="/products" className="text-brand-dark">
          <ArrowLeft size={20} />
        </Link>
        <div className="font-mono text-xs font-semibold tracking-wide text-brand-text-secondary">
          {product.series}
        </div>
      </div>

      <div className="pb-7">
        <div className="px-5 pt-3">
          <ShowcaseCard
            title={product.name}
            body={product.tagline}
            kicker={product.series}
            image={heroImage}
            aspect="aspect-[3/4]"
            fit="cover"
            priority
          />
        </div>

        <div className="flex items-center justify-between px-5 pb-3 pt-7">
          <div>
            <div className="text-[22px] font-bold leading-tight tracking-[-0.02em] text-brand-dark">Gallery</div>
            <div className="mt-0.5 text-[13px] text-brand-text-tertiary">See it from every angle</div>
          </div>
          <ToggleTabs value={photoMode} onChange={setPhotoMode} />
        </div>
        <div className="px-5">
          {photos.length > 0 ? (
            <Carousel key={photoMode} label="Photos" itemClassName="w-[86%]" focusScale>
              {photos.map((ph) => (
                <ShowcaseCard
                  key={ph.id}
                  title={product.name}
                  kicker={photoMode === "product" ? "Product view" : "In use"}
                  image={ph.url}
                  aspect="aspect-[4/5]"
                />
              ))}
            </Carousel>
          ) : showHeroFallback ? (
            <ShowcaseCard title={product.name} kicker="Product view" image={heroImageUrl} aspect="aspect-[4/5]" />
          ) : (
            <div className="flex h-35 w-full items-center justify-center rounded-[22px] bg-white text-xs text-brand-text-tertiary">
              No {photoMode === "product" ? "product" : "in-use"} photos yet
            </div>
          )}
        </div>

        {hasAnyVideo && (
          <>
            <div className="flex items-center justify-between px-5 pb-2 pt-3.5">
              <div className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-neutral-400">
                Video
              </div>
              <ToggleTabs value={videoMode} onChange={setVideoMode} />
            </div>
            <div className="flex justify-center px-5 pb-1">
              {video ? (
                <button className="relative flex h-52 w-full items-center justify-center rounded-lg bg-linear-to-br from-[#1c1c1c] to-[#221a2e] shadow-[0_10px_24px_rgba(0,0,0,.18)]">
                  <div className="flex h-13 w-13 items-center justify-center rounded-full bg-white/15 shadow-[0_0_0_6px_rgba(124,58,237,.3)]">
                    <Play size={20} className="translate-x-0.5 text-white" fill="white" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-0.75 bg-linear-to-r from-[#7c3aed] to-[#a78bfa]" />
                </button>
              ) : (
                <div className="flex h-52 w-full items-center justify-center rounded-lg bg-brand-surface text-xs text-brand-text-tertiary">
                  No {videoMode === "product" ? "product" : "in-use"} video yet
                </div>
              )}
            </div>
          </>
        )}

        {product.specs.length > 0 && (
          <div className="px-5 pb-1 pt-4.5">
            <SectionLabel>Specifications</SectionLabel>
            <div className="flex flex-col overflow-hidden rounded-lg border border-black/6">
              {product.specs.map((sp) => (
                <div
                  key={sp.label}
                  className="flex justify-between border-b border-black/6 bg-white px-3 py-2.5 last:border-b-0"
                >
                  <div className="text-[13px] text-brand-text-secondary">{sp.label}</div>
                  <div className="text-[13px] font-semibold text-brand-red">{sp.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {product.catalogue && (
          <div className="px-5 pt-4.5">
            <SectionLabel>Catalogue</SectionLabel>
            <ProductCatalogueCard {...product.catalogue} />
          </div>
        )}
      </div>
    </div>
  );
}
