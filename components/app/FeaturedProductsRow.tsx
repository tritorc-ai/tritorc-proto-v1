import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/mock/content";
import { SectionLabel } from "./SectionLabel";

type ProductWithImage = Product & { imageUrl?: string };

export function FeaturedProductsRow({ products }: { products: ProductWithImage[] }) {
  return (
    <div className="mb-7">
      <div className="mb-2.5 flex items-baseline justify-between">
        <SectionLabel>Featured Products</SectionLabel>
        <Link href="/products" className="text-xs font-semibold text-brand-red">
          See all
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1.5 [scrollbar-width:none]">
        {products.map((p) => (
          <Link
            key={p.slug}
            href={`/products/${p.slug}`}
            className="w-[152px] shrink-0 overflow-hidden rounded-lg border border-black/6 bg-white shadow-[0_1px_2px_rgba(0,0,0,.03),0_8px_18px_rgba(0,0,0,.07)]"
          >
            <div className="relative h-23 overflow-hidden">
              {p.imageUrl ? (
                <Image src={p.imageUrl} alt="" fill sizes="152px" className="object-cover" />
              ) : (
                <div className="h-full w-full bg-[repeating-linear-gradient(135deg,#eef0f2_0px,#eef0f2_9px,#e3e7ea_9px,#e3e7ea_18px)]" />
              )}
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-brand-red" />
            </div>
            <div className="px-2.5 py-2.5">
              <div className="mb-0.5 text-[11.5px] font-semibold text-brand-dark">{p.name}</div>
              <div className="font-mono text-[10.5px] text-brand-text-secondary">{p.series}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
