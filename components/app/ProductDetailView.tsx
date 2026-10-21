"use client";

import type { Product } from "@/lib/mock/content";
import { DetailSheetView } from "./DetailSheetView";

export function ProductDetailView({
  product,
  heroImageUrl,
  backHref = "/products",
}: {
  product: Product;
  heroImageUrl?: string;
  backHref?: string;
}) {
  return (
    <DetailSheetView
      slug={product.slug}
      name={product.name}
      tagline={product.tagline}
      eyebrow={product.series}
      eyebrowRight={product.category}
      media={product.media}
      specs={product.specs}
      catalogue={product.catalogue}
      heroImageUrl={heroImageUrl}
      backHref={backHref}
    />
  );
}
