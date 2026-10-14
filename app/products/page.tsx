import { getImageUrls, getProducts, getThumbnailMap } from "@/lib/strapi";
import { PRODUCT_CATEGORIES, PRODUCT_SECTIONS } from "@/lib/mock/content";
import { PageHeader } from "@/components/app/PageHeader";
import { SectionNav } from "@/components/app/SectionNav";
import { slugify } from "@/components/app/ui";
import { ProductSection } from "@/components/products/ProductSection";

export default async function ProductsPage() {
  const [products, images, thumbnails] = await Promise.all([
    getProducts(),
    getImageUrls(),
    getThumbnailMap("product"),
  ]);
  const categoryImage = new Map(PRODUCT_CATEGORIES.map((c) => [c.name, images[c.imageKey]]));

  const sections = PRODUCT_SECTIONS.map((section) => ({
    id: slugify(section.name),
    name: section.name,
    subcategories: section.categories.map((name) => {
      const inCat = products.filter((p) => p.category === name);
      const lead = inCat[0];
      const image =
        (lead && (thumbnails[lead.slug] ?? lead.directImageUrl)) ??
        categoryImage.get(name) ??
        (lead?.heroImageKey ? images[lead.heroImageKey] : undefined);
      return { name, slug: slugify(name), count: inCat.length, image };
    }),
  }));

  return (
    // Warm ivory canvas. It extends under the nav's padding (same trick as the
    // Home panel) so no cooler strip shows behind the fixed bottom bar.
    <div
      className="overflow-x-clip bg-ivory text-ink"
      style={{
        minHeight: "100dvh",
        marginBottom: "calc(-1 * (88px + env(safe-area-inset-bottom, 0px)))",
        paddingBottom: "calc(88px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <PageHeader title="Products" subtitle="The complete Tritorc catalogue" />
      <div className="px-5">
        <SectionNav variant="copper" items={sections.map((s) => ({ id: s.id, label: s.name }))} />
        <div className="space-y-10 pb-8 pt-6">
          {sections.map((section) => (
            <ProductSection key={section.id} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
}
