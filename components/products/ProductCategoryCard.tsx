import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * Graphite card: the product image fills a rounded inset frame directly on
 * the card (no extra backdrop), followed by the name, count and arrow.
 */
export function ProductCategoryCard({
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
      className="press group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-cu/40 bg-graphite transition-colors duration-300 hover:border-cu-light group-data-[active=true]/item:border-cu"
    >
      {/* Image fills an inset, rounded frame directly on the graphite card */}
      <div className="relative m-2 aspect-[5/4] overflow-hidden rounded-[20px] bg-graphite-deep">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes="(max-width: 448px) 78vw, 340px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] group-active:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,#2c2c2c_0,#2c2c2c_10px,#262626_10px,#262626_20px)]" />
        )}
      </div>

      {/* Text block */}
      <div className="flex flex-1 items-start justify-between gap-3 px-5 pb-5 pt-3">
        <div className="min-w-0">
          <div className="text-[17px] font-semibold leading-snug tracking-[-0.005em] text-warm-white [text-wrap:balance]">
            {name}
          </div>
          <div className="mt-1.5 font-mono text-[11.5px] uppercase tracking-[0.12em] text-warm-white/55">
            {count} {count === 1 ? "product" : "products"}
          </div>
        </div>
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cu/60 text-cu-light transition-colors duration-300 group-hover:border-cu group-hover:bg-cu group-hover:text-white group-active:bg-cu group-active:text-white">
          <ArrowUpRight
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-px group-hover:-translate-y-px group-active:translate-x-0.5 group-active:-translate-y-0.5"
          />
        </span>
      </div>

      {/* Accent line that draws in on interaction */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-cu transition-transform duration-500 ease-out group-hover:scale-x-100 group-active:scale-x-100 group-data-[active=true]/item:scale-x-100"
      />
    </Link>
  );
}
