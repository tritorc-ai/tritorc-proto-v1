"use client";

import type { Service } from "@/lib/mock/content";
import { DetailSheetView } from "./DetailSheetView";

export function ServiceDetailView({
  service,
  heroImageUrl,
}: {
  service: Service;
  heroImageUrl?: string;
}) {
  return (
    <DetailSheetView
      slug={service.slug}
      name={service.name}
      tagline={service.tagline}
      eyebrow={service.category.toUpperCase()}
      media={service.media}
      about={service.description ? { title: "About this service", text: service.description } : undefined}
      catalogue={service.catalogue}
      heroImageUrl={heroImageUrl}
      backHref="/services"
      overviewLabel="Overview"
    />
  );
}
