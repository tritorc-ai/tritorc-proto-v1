import { getImageUrls, getProducts, getThumbnailMap } from "@/lib/strapi";
import { PRODUCT_CATEGORIES, PRODUCT_SECTIONS } from "@/lib/mock/content";
import { PageHeader } from "@/components/app/PageHeader";
import { Carousel } from "@/components/app/Carousel";
import { slugify } from "@/components/app/ui";
import { SubcategoryCard } from "@/components/products/SubcategoryCard";

export default async function ProductsPage() {
  const [products, images, thumbnails] = await Promise.all([
    getProducts(),
    getImageUrls(),
    getThumbnailMap("product"),
  ]);
  const categoryImage = new Map(PRODUCT_CATEGORIES.map((c) => [c.name, images[c.imageKey]]));

  const sections = PRODUCT_SECTIONS.map((section) => ({
    ...section,
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
    <div>
      <PageHeader title="Products" subtitle="The complete Tritorc catalogue" />

      {/* Quick jump between the vertical category sections */}
      <nav aria-label="Product categories" className="no-scrollbar mb-2 flex gap-2 overflow-x-auto px-5 pb-2">
        {sections.map((s) => (
          <a
            key={s.name}
            href={`#${slugify(s.name)}`}
            className="press shrink-0 rounded-full bg-white px-4 py-2 text-[13px] font-medium text-brand-dark"
          >
            {s.name}
          </a>
        ))}
      </nav>

      <div className="space-y-9 px-5 pt-4">
        {sections.map((section) => (
          <section key={section.name} id={slugify(section.name)} className="scroll-mt-4">
            <div className="mb-3.5 flex items-center gap-3">
              <span className="h-7 w-1.5 rounded-full" style={{ background: section.color }} />
              <div>
                <h2 className="text-[24px] font-bold leading-none tracking-[-0.02em] text-brand-dark">
                  {section.name}
                </h2>
                <div className="mt-1 text-[13px] text-brand-text-tertiary">
                  {section.subcategories.length} categories · swipe to browse
                </div>
              </div>
            </div>
            <Carousel label={section.name} itemClassName="w-[68%]">
              {section.subcategories.map((sub) => (
                <SubcategoryCard
                  key={sub.slug}
                  href={`/products/c/${sub.slug}`}
                  name={sub.name}
                  image={sub.image}
                  count={sub.count}
                  accent={section.color}
                />
              ))}
            </Carousel>
          </section>
        ))}
      </div>
    </div>
  );
}
