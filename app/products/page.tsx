import { Plus_Jakarta_Sans } from "next/font/google";
import { getImageUrls, getProducts, getThumbnailMap } from "@/lib/strapi";
import { PRODUCT_CATEGORIES, PRODUCT_SECTIONS } from "@/lib/mock/content";
import { PageHeader } from "@/components/app/PageHeader";
import { FocusCarousel } from "@/components/app/FocusCarousel";
import { OverlayCard, SectionHead, slugify } from "@/components/app/ui";
import { SectionNav } from "@/components/app/SectionNav";
import { Reveal } from "@/components/app/Reveal";

const headingFont = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

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
    <div className={headingFont.className}>
      <PageHeader title="Products" hideLogo titleClassName="text-[36px] font-bold" />

      {/* Quick jump between the vertical category sections: sticky, with scroll-spy */}
      {/* One padded wrapper for the bar and the sections so the bar stays sticky across the whole list */}
      <div className="px-5">
        <SectionNav variant="minimal" items={sections.map((s) => ({ id: slugify(s.name), label: s.name }))} />

        <div className="space-y-8 pt-4">
        {sections.map((section) => (
          <Reveal as="section" key={section.name} id={slugify(section.name)} className="scroll-mt-20">
            <SectionHead
              title={section.name}
            />
            <FocusCarousel label={section.name} autoPlay={4000}>
              {section.subcategories.map((sub) => (
                <OverlayCard
                  key={sub.slug}
                  href={`/products/c/${sub.slug}`}
                  title={sub.name}
                  body={`${sub.count} ${sub.count === 1 ? "product" : "products"}`}
                  image={sub.image}
                  cta="Explore"
                  aspect="h-full"
                />
              ))}
            </FocusCarousel>
          </Reveal>
        ))}
        </div>
      </div>
    </div>
  );
}
