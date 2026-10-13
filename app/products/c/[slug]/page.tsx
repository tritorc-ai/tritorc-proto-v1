import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getImageUrls, getProducts, getThumbnailMap } from "@/lib/strapi";
import { PRODUCT_CATEGORIES, PRODUCT_SECTIONS } from "@/lib/mock/content";
import { PageHeader } from "@/components/app/PageHeader";
import { Photo, slugify } from "@/components/app/ui";

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

  return (
    <div>
      <PageHeader title={category.name} subtitle={section?.name} back={{ href: "/products" }} />
      <div className="space-y-4 px-5">
        {items.length === 0 && (
          <div className="rounded-[26px] bg-white p-6 text-center text-[14px] text-brand-text-secondary">
            No products listed in this category yet.
          </div>
        )}
        {items.map((p) => {
          const image =
            thumbnails[p.slug] ??
            p.directImageUrl ??
            (p.heroImageKey ? images[p.heroImageKey] : undefined) ??
            images[category.imageKey];
          return (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className="press group block overflow-hidden rounded-[28px] bg-white"
            >
              <Photo src={image} className="aspect-[4/3] w-full" imgClassName="group-active:scale-105" />
              <div className="p-5">
                <div
                  className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em]"
                  style={{ color: section?.color }}
                >
                  {p.series}
                </div>
                <div className="mt-1 flex items-start justify-between gap-3">
                  <h2 className="text-[20px] font-semibold leading-tight tracking-[-0.01em] text-brand-dark">
                    {p.name}
                  </h2>
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-dark text-white">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
                <p className="mt-2 line-clamp-3 text-[13.5px] leading-snug text-brand-text-secondary">{p.tagline}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
