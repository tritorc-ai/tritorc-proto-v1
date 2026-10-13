import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Photo } from "@/components/app/ui";

/** Compact image-led card used for subcategories inside a horizontal rail. */
export function SubcategoryCard({
  href,
  name,
  image,
  count,
  accent,
}: {
  href: string;
  name: string;
  image?: string;
  count: number;
  accent: string;
}) {
  return (
    <Link href={href} className="press group block h-full overflow-hidden rounded-[26px] bg-white">
      <div className="relative aspect-[4/3]">
        <Photo src={image} className="absolute inset-0" imgClassName="group-active:scale-105" sizes="260px" />
        <div className="absolute inset-x-0 bottom-0 h-1" style={{ background: accent }} />
      </div>
      <div className="flex items-start justify-between gap-2 p-4">
        <div className="min-w-0">
          <div className="text-[16px] font-semibold leading-tight text-brand-dark">{name}</div>
          <div className="mt-1 text-[12.5px] text-brand-text-tertiary">
            {count} {count === 1 ? "product" : "products"}
          </div>
        </div>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-dark text-white">
          <ArrowUpRight size={15} />
        </span>
      </div>
    </Link>
  );
}
