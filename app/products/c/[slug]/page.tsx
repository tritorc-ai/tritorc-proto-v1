import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getImageUrls, getProducts, getThumbnailMap } from "@/lib/strapi";
import { PRODUCT_CATEGORIES, PRODUCT_SECTIONS } from "@/lib/mock/content";
import { jakarta } from "@/lib/fonts";
import { PageHeader } from "@/components/app/PageHeader";
import { Carousel } from "@/components/app/Carousel";
import { SectionHead, slugify } from "@/components/app/ui";
import { ShowcaseCard } from "@/components/products/ShowcaseCard";

export default async function ProductCategoryPage(props: PageProps<"/products/c/[slug]">) {
  const { slug } = await props.params;
  const category = PRODUCT_CATEGORIES.find((c) => slugify(c.name) === slug);
  if (!category) notFound();

  const [products, images, thumbnails] = await Promise.all([
    getProducts(),
    getImageUrls(),
    getThumbnailMap("product"),
  ]);
  const section = PRODUCT_SECTIONS.find((s) => s.categories.includes(category.name));
  const items = products.filter((p) => p.category === category.name);

  // A category with a single product would only show one large card that
  // leads to the product page — skip that extra tap and open the product
  // directly. redirect() replaces the history entry, so Back returns to the
  // Products page instead of bouncing here again.
  if (items.length === 1) redirect(`/products/${items[0].slug}`);

  return (
    <div className={jakarta.className}>
      <PageHeader title={category.name} subtitle={section?.name} back={{ href: "/products" }} />
      <div className="px-5">
        {items.length === 0 && (
          <div className="rounded-[26px] bg-white p-6 text-center text-[14px] text-brand-text-secondary">
            No products listed in this category yet.
          </div>
        )}
        {items.length > 0 && (
          <Carousel label={category.name} itemClassName="w-[86%]" focusScale accent={section?.color}>
            {items.map((p, i) => {
              const image =
                thumbnails[p.slug] ??
                p.directImageUrl ??
                (p.heroImageKey ? images[p.heroImageKey] : undefined) ??
                images[category.imageKey];
              return (
                <ShowcaseCard
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  title={p.name}
                  body={p.tagline}
                  kicker={p.series}
                  image={image}
                  accent={section?.color}
                  cta="Know more"
                  aspect="aspect-[3/4]"
                  fit="cover"
                  priority={i === 0}
                />
              );
            })}
          </Carousel>
        )}

        {items.length > 1 && (
          <div className="mt-8">
            <SectionHead title="All products" subtitle={`${items.length} in this category`} />
            <div className="overflow-hidden rounded-[22px] bg-white">
              {items.map((p) => (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  className="press flex items-center justify-between gap-3 border-b border-black/6 px-4 py-3.5 last:border-b-0"
                >
                  <div className="min-w-0">
                    <div className="truncate text-[15px] font-semibold text-brand-dark">{p.name}</div>
                    <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-brand-text-tertiary">
                      {p.series}
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="shrink-0 text-brand-dark" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
