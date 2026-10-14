import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CardImage } from "@/components/products/CardImage";

/**
 * Image-led card used for subcategories inside a horizontal rail.
 * Ather-style: monochrome, borderless, the product photo does the talking.
 * White card on the grey page background, title and a quiet grey meta line,
 * and a soft round arrow that darkens on press.
 */
export function SubcategoryCard({
  href,
  name,
  image,
  count,
}: {
  href: string;
  name: string;
  image?: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      className="press group block h-full overflow-hidden rounded-[28px] bg-white outline-none focus-visible:ring-2 focus-visible:ring-brand-dark/40"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <CardImage src={image} alt={name} sizes="(max-width: 448px) 70vw, 300px" />
      </div>

      <div className="flex items-end justify-between gap-3 px-5 pb-5 pt-4">
        <div className="min-w-0">
          <div className="min-h-[2.5em] text-[15.5px] font-semibold leading-[1.25] tracking-[-0.015em] text-brand-dark">
            {name}
          </div>
          <div className="mt-1 text-[12.5px] text-brand-text-tertiary">
            {count} {count === 1 ? "product" : "products"}
          </div>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--app-bg) text-brand-dark transition-colors duration-300 group-hover:bg-brand-dark group-hover:text-white group-active:bg-brand-dark group-active:text-white">
          <ArrowUpRight
            size={17}
            className="transition-transform duration-300 ease-(--ease-premium) group-hover:rotate-45 group-active:rotate-45"
          />
        </span>
      </div>
    </Link>
  );
}
