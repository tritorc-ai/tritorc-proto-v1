import { notFound } from "next/navigation";
import { getCatalogueUrl, getImageUrls, getMediaByCaption, getService, getVideoUrls } from "@/lib/strapi";
import { ServiceDetailView } from "@/components/app/ServiceDetailView";
import type { ImageKey } from "@/lib/mock/images";
import type { VideoKey } from "@/lib/mock/videos";
import type { ServiceMediaAsset } from "@/lib/mock/content";

// Real in-use gallery photos found in the Media Library for these specific
// services (see lib/mock/images.ts) — layered on top of the mock `media: []`
// in content.ts without needing to touch that static data, same pattern as
// the Product detail page's EXTRA_GALLERY_KEYS. Kept as a fallback: the
// caption convention below (service:<slug>:...) is the scalable path going
// forward for anything not yet captioned.
const EXTRA_GALLERY_KEYS: Record<string, ImageKey[]> = {
  "hot-tapping-line-stopping": [
    "hotTappingGallery1",
    "hotTappingGallery2",
    "hotTappingGallery3",
    "hotTappingGallery4",
    "hotTappingGallery5",
    "hotTappingOngc",
  ],
  "dry-rental": ["dryRentalEquipment"],
  "lube-oil-flushing-services": ["lubeOilGallery1", "lubeOilGallery2", "lubeOilGallery3"],
  "nitrogen-purging-preservation": [
    "nitrogenPurgingGallery1",
    "nitrogenPurgingGallery2",
    "nitrogenPreservationGallery1",
    "nitrogenPreservationGallery2",
  ],
  "pipe-freezing": [
    "pipeFreezingGallery1",
    "pipeFreezingGallery2",
    "pipeFreezingGallery3",
    "pipeFreezingGallery4",
    "pipeFreezingGallery5",
    "pipeFreezingGallery6",
    "pipeFreezingGallery7",
    "pipeFreezingGallery8",
  ],
};

// Real product-overview videos found in the Media Library for these
// specific services — additive on top of whatever photo media resolves
// above (no video caption convention exists yet, so there's no conflict).
const EXTRA_VIDEO_KEYS: Record<string, VideoKey[]> = {
  "hot-tapping-line-stopping": ["svcHotTapping"],
};

export default async function ServiceDetailPage(props: PageProps<"/services/[slug]">) {
  const { slug } = await props.params;
  const [service, images, videos, captionMedia] = await Promise.all([
    getService(slug),
    getImageUrls(),
    getVideoUrls(),
    getMediaByCaption(`service:${slug}`),
  ]);
  if (!service) notFound();

  const extraKeys = EXTRA_GALLERY_KEYS[slug] ?? [];
  const fallbackMedia: ServiceMediaAsset[] = extraKeys
    .map((key, i) => {
      const url = images[key];
      if (!url) return null;
      return { id: `${slug}-gallery-${i}`, kind: "photo", context: "in-use", url } as ServiceMediaAsset;
    })
    .filter((m): m is ServiceMediaAsset => m !== null);

  // caption convention: service:<slug>:hero | thumbnail | gallery:overview | gallery:in-use
  let captionHeroUrl: string | undefined;
  const captionMediaAssets: ServiceMediaAsset[] = [];
  captionMedia.forEach((m, i) => {
    if (m.suffix === "hero") {
      captionHeroUrl = m.url;
    } else if (m.suffix === "gallery:overview") {
      captionMediaAssets.push({ id: `${slug}-caption-${i}`, kind: "photo", context: "product", url: m.url });
    } else if (m.suffix === "gallery:in-use") {
      captionMediaAssets.push({ id: `${slug}-caption-${i}`, kind: "photo", context: "in-use", url: m.url });
    }
    // "thumbnail" is used by the Services listing page, not the detail page.
  });

  const combinedPhotoMedia =
    captionMediaAssets.length > 0
      ? [...service.media, ...captionMediaAssets]
      : fallbackMedia.length > 0
        ? [...service.media, ...fallbackMedia]
        : service.media;

  const videoKeys = EXTRA_VIDEO_KEYS[slug] ?? [];
  const videoMedia: ServiceMediaAsset[] = videoKeys
    .map((key, i) => {
      const url = videos[key];
      if (!url) return null;
      return { id: `${slug}-video-${i}`, kind: "video", context: "product", url } as ServiceMediaAsset;
    })
    .filter((m): m is ServiceMediaAsset => m !== null);

  const combinedMedia = [...combinedPhotoMedia, ...videoMedia];

  const catalogueUrl = service.catalogue ? await getCatalogueUrl(service.catalogue.title) : undefined;
  const serviceWithMedia = {
    ...service,
    media: combinedMedia,
    catalogue:
      service.catalogue && catalogueUrl ? { ...service.catalogue, url: catalogueUrl } : service.catalogue,
  };

  return (
    <ServiceDetailView
      service={serviceWithMedia}
      heroImageUrl={
        captionHeroUrl ??
        service.directImageUrl ??
        (service.imageKey ? images[service.imageKey] : undefined)
      }
    />
  );
}
