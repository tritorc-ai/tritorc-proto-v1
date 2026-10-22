import { jakarta } from "@/lib/fonts";
import { getImageUrls, getProducts, getThumbnailMap } from "@/lib/strapi";
import { PRODUCT_LIST } from "@/lib/mock/content";
import { PageHeader } from "@/components/app/PageHeader";
import { FocusCarousel } from "@/components/app/FocusCarousel";
import { OverlayCard, SectionHead, slugify } from "@/components/app/ui";
import { SectionNav } from "@/components/app/SectionNav";
import { Reveal } from "@/components/app/Reveal";


export default async function ProductsPage() {
  const [products, images, thumbnails] = await Promise.all([
    getProducts(),
    getImageUrls(),
    getThumbnailMap("product"),
  ]);
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  // Sections and order come from PRODUCT_LIST (lib/mock/content.ts); each card
  // opens that product directly.
  const sections = PRODUCT_LIST.map((section) => ({
    ...section,
    cards: section.items.flatMap((item) => {
      const product = bySlug.get(item.slug);
      if (!product) return [];
      const image =
        thumbnails[product.slug] ??
        product.directImageUrl ??
        (product.heroImageKey ? images[product.heroImageKey] : undefined);
      return [{ ...item, image }];
    }),
  }));

  return (
    <div className={jakarta.className}>
      <PageHeader title="Products" hideLogo titleClassName="text-[36px] font-bold" />

      {/* Quick jump between the vertical sections: sticky, with scroll-spy */}
      {/* One padded wrapper for the bar and the sections so the bar stays sticky across the whole list */}
      <div className="px-5">
        <SectionNav variant="minimal" items={sections.map((s) => ({ id: slugify(s.name), label: s.name }))} />

        <div className="space-y-8 pt-4">
          {sections.map((section) => (
            <Reveal as="section" key={section.name} id={slugify(section.name)} className="scroll-mt-20">
              <SectionHead title={section.name} size="sm" />
              <FocusCarousel label={section.name} autoPlay={4000}>
                {section.cards.map((card) => (
                  <OverlayCard
                    key={card.slug}
                    href={`/products/${card.slug}`}
                    title={card.title}
                    body={card.series}
                    image={card.image}
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
