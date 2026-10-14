import { HorizontalProductTrack } from "@/components/products/HorizontalProductTrack";
import { ProductCategoryCard } from "@/components/products/ProductCategoryCard";

export interface ProductSectionData {
  id: string;
  name: string;
  subcategories: { name: string; slug: string; count: number; image?: string }[];
}

/** One product group: copper-ruled header + a horizontal track of category cards. */
export function ProductSection({ section }: { section: ProductSectionData }) {
  const n = section.subcategories.length;
  return (
    <section id={section.id} className="scroll-mt-16" aria-labelledby={`${section.id}-title`}>
      <header className="mb-4 flex items-stretch gap-3">
        <span className="w-[3px] shrink-0 rounded-full bg-cu" aria-hidden />
        <div>
          <h2
            id={`${section.id}-title`}
            className="text-[21px] font-bold uppercase leading-[1.1] tracking-[0.04em] text-ink"
          >
            {section.name}
          </h2>
          <p className="mt-1.5 font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink-muted">
            {n} {n === 1 ? "category" : "categories"}
          </p>
        </div>
      </header>
      <HorizontalProductTrack label={section.name}>
        {section.subcategories.map((sub) => (
          <ProductCategoryCard
            key={sub.slug}
            href={`/products/c/${sub.slug}`}
            name={sub.name}
            image={sub.image}
            count={sub.count}
          />
        ))}
      </HorizontalProductTrack>
    </section>
  );
}
