import { jakarta } from "@/lib/fonts";
import { getImageUrls, getProductList, getProducts, getThumbnailMap } from "@/lib/strapi";
import { PageHeader } from "@/components/app/PageHeader";
import { FrontAndList } from "@/components/app/FrontAndList";
import { SectionHead, slugify } from "@/components/app/ui";
import { SectionNav } from "@/components/app/SectionNav";
import { Reveal } from "@/components/app/Reveal";


export default async function ProductsPage() {
  const [productList, products, images, thumbnails] = await Promise.all([
    getProductList(),
    getProducts(),
    getImageUrls(),
    getThumbnailMap("product"),
  ]);
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  // Sections and order come from Strapi (product sections; sample content is the fallback); each card
  // opens that product directly.
  const sections = productList.map((section) => ({
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
              <FrontAndList
                label={section.name}
                cta="Explore"
                listTitle={`More in ${section.name}`}
                items={section.cards.map((card) => ({
                  href: `/products/${card.slug}`,
                  title: card.title,
                  body: card.series,
                  image: card.image,
                }))}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
