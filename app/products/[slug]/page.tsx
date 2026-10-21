import { notFound } from "next/navigation";
import { getCatalogueUrl, getImageUrls, getMediaByCaption, getProduct, getVideoUrls } from "@/lib/strapi";
import { ProductDetailView } from "@/components/app/ProductDetailView";
import type { ImageKey } from "@/lib/mock/images";
import type { VideoKey } from "@/lib/mock/videos";
import type { ProductMediaAsset } from "@/lib/mock/content";

// Real, verified multi-shot product photography we found for these two
// specific products (see the visual audit) — layered on top of the mock
// `media: []` in content.ts without needing to touch that static data.
// Kept as a fallback: the caption convention below (product:<slug>:...) is
// the scalable path going forward — this hardcoded map only still matters
// for products nobody has captioned yet.
const EXTRA_GALLERY_KEYS: Record<string, ImageKey[]> = {
  "tsl-20": ["productTorqueHero", "impactBg", "torqueGallery3"],
  "btl-19": ["productTensionerHero", "libraryBtlPhoto", "btlGallery2", "btlGallery3", "btlGallery4"],
};

// Real product-overview videos found in the Media Library for these
// specific products — additive on top of whatever photo media resolves
// above (no video caption convention exists yet, so there's no conflict).
const EXTRA_VIDEO_KEYS: Record<string, VideoKey[]> = {
  "btl-19": ["prodBtl"],
  "pipe-cold-cutting-beveling-machines": ["prodPipeCutting"],
  "tube-pipe-beveling-machine": ["prodTubeBeveling"],
  "tube-removal-tools": ["prodTubeRemoval"],
};

export default async function ProductDetailPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const [product, images, videos, captionMedia] = await Promise.all([
    getProduct(slug),
    getImageUrls(),
    getVideoUrls(),
    getMediaByCaption(`product:${slug}`),
  ]);
  if (!product) notFound();

  const extraKeys = EXTRA_GALLERY_KEYS[slug] ?? [];
  const fallbackMedia: ProductMediaAsset[] = extraKeys
    .map((key, i) => {
      const url = images[key];
      if (!url) return null;
      return { id: `${slug}-gallery-${i}`, kind: "photo", context: "product", url } as ProductMediaAsset;
    })
    .filter((m): m is ProductMediaAsset => m !== null);

  // caption convention: product:<slug>:hero | thumbnail | gallery:product | gallery:in-use
  let captionHeroUrl: string | undefined;
  const captionMediaAssets: ProductMediaAsset[] = [];
  captionMedia.forEach((m, i) => {
    if (m.suffix === "hero") {
      captionHeroUrl = m.url;
    } else if (m.suffix === "gallery:product") {
      captionMediaAssets.push({ id: `${slug}-caption-${i}`, kind: "photo", context: "product", url: m.url });
    } else if (m.suffix === "gallery:in-use") {
      captionMediaAssets.push({ id: `${slug}-caption-${i}`, kind: "photo", context: "in-use", url: m.url });
    }
    // "thumbnail" is used by the Products listing page, not the detail page.
  });

  const combinedPhotoMedia =
    captionMediaAssets.length > 0
      ? [...product.media, ...captionMediaAssets]
      : fallbackMedia.length > 0
        ? [...product.media, ...fallbackMedia]
        : product.media;

  const videoKeys = EXTRA_VIDEO_KEYS[slug] ?? [];
  const videoMedia: ProductMediaAsset[] = videoKeys
    .map((key, i) => {
      const url = videos[key];
      if (!url) return null;
      return { id: `${slug}-video-${i}`, kind: "video", context: "product", url } as ProductMediaAsset;
    })
    .filter((m): m is ProductMediaAsset => m !== null);

  const combinedMedia = [...combinedPhotoMedia, ...videoMedia];

  // Products are opened straight from the Products page, so Back returns there.
  const backHref = "/products";

  const catalogueUrl = product.catalogue ? await getCatalogueUrl(product.catalogue.title) : undefined;
  const productWithMedia = {
    ...product,
    media: combinedMedia,
    catalogue:
      product.catalogue && catalogueUrl ? { ...product.catalogue, url: catalogueUrl } : product.catalogue,
  };

  return (
    <ProductDetailView
      product={productWithMedia}
      backHref={backHref}
      heroImageUrl={
        captionHeroUrl ??
        product.directImageUrl ??
        (product.heroImageKey ? images[product.heroImageKey] : undefined)
      }
    />
  );
}
