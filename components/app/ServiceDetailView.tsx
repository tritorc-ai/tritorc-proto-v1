"use client";

import { ArrowLeft, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/lib/mock/content";
import { SectionLabel } from "./SectionLabel";
import { ProductCatalogueCard } from "./ProductCatalogueCard";
import { cn } from "@/lib/utils";

export function ServiceDetailView({
  service,
  heroImageUrl,
}: {
  service: Service;
  heroImageUrl?: string;
}) {
  const photos = service.media.filter((m) => m.kind === "photo");
  const video = service.media.find((m) => m.kind === "video");
  const showHeroFallback = photos.length === 0 && heroImageUrl;

  return (
    <div>
      <div className="sticky top-0 z-10 flex items-center gap-2.5 bg-brand-surface px-5 pb-2.5 pt-safe-header">
        <Link href="/services" className="text-brand-dark">
          <ArrowLeft size={20} />
        </Link>
        <div className="font-mono text-xs font-semibold tracking-wide text-brand-text-secondary">
          {service.category.toUpperCase()}
        </div>
      </div>

      <div className="pb-7">
        <div className="px-5 pb-4.5 pt-4">
          <div className="text-[22px] font-bold leading-tight text-brand-dark">{service.name}</div>
          <div className="mt-1.5 text-[13px] leading-relaxed text-brand-text-secondary">
            {service.tagline}
          </div>
        </div>

        <div className="px-5 pb-2 pt-0.5">
          <div className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-neutral-400">
            Photos
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto px-5 pb-2.5 [scrollbar-width:none]">
          {photos.length > 0 ? (
            photos.map((ph) => (
              <Image
                key={ph.id}
                src={ph.url}
                alt={service.name}
                width={ph.portrait ? 110 : 200}
                height={ph.portrait ? 196 : 140}
                className={cn(
                  "shrink-0 rounded-lg bg-white object-contain shadow-[0_6px_16px_rgba(0,0,0,.08)]",
                  ph.portrait ? "h-49 w-27.5" : "h-35 w-50"
                )}
              />
            ))
          ) : showHeroFallback ? (
            <Image
              src={heroImageUrl}
              alt={service.name}
              width={200}
              height={140}
              className="h-35 w-50 shrink-0 rounded-lg object-cover shadow-[0_6px_16px_rgba(0,0,0,.08)]"
            />
          ) : (
            <div className="flex h-35 w-full items-center justify-center rounded-lg bg-brand-surface text-xs text-brand-text-tertiary">
              No photos yet
            </div>
          )}
        </div>

        {video && (
          <>
            <div className="px-5 pb-2 pt-3.5">
              <div className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-neutral-400">
                Video
              </div>
            </div>
            <div className="flex justify-center px-5 pb-1">
              <button className="relative flex h-52 w-full items-center justify-center rounded-lg bg-linear-to-br from-[#1c1c1c] to-[#221a2e] shadow-[0_10px_24px_rgba(0,0,0,.18)]">
                <div className="flex h-13 w-13 items-center justify-center rounded-full bg-white/15 shadow-[0_0_0_6px_rgba(124,58,237,.3)]">
                  <Play size={20} className="translate-x-0.5 text-white" fill="white" />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-0.75 bg-linear-to-r from-[#7c3aed] to-[#a78bfa]" />
              </button>
            </div>
          </>
        )}

        <div className="px-5 pb-1 pt-4.5">
          <SectionLabel>About this service</SectionLabel>
          <div className="rounded-lg border border-black/6 bg-white p-4 text-sm leading-relaxed text-brand-text-secondary shadow-[0_1px_2px_rgba(0,0,0,.03),0_6px_14px_rgba(0,0,0,.05)]">
            {service.description}
          </div>
        </div>

        {service.catalogue && (
          <div className="px-5 pt-4.5">
            <SectionLabel>Catalogue</SectionLabel>
            <ProductCatalogueCard {...service.catalogue} />
          </div>
        )}
      </div>
    </div>
  );
}
