import { getImageUrls, getLibraryAssets } from "@/lib/strapi";
import { jakarta } from "@/lib/fonts";
import { PageHeader } from "@/components/app/PageHeader";
import { LibraryView } from "@/components/app/LibraryView";

export default async function LibraryPage() {
  const [assets, images] = await Promise.all([getLibraryAssets(), getImageUrls()]);
  const enriched = assets.map((a) => ({
    ...a,
    imageUrl: a.directImageUrl ?? (a.imageKey ? images[a.imageKey] : undefined),
  }));

  return (
    <div className={jakarta.className}>
      <PageHeader title="Library" subtitle="Find any photo, video or catalogue fast" hideLogo />
      <LibraryView assets={enriched} />
    </div>
  );
}
