import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * Architectural graphite card: a lit studio panel for the product shot,
 * then a text block separated by a hairline copper rule. The image is
 * multiplied onto the panel, so white photo backgrounds dissolve into it and
 * the whole product stays visible (contained, never cropped).
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
      className="press group relative flex h-full flex-col overflow-hidden rounded-[4px] border border-cu/40 bg-graphite transition-colors duration-300 hover:border-cu-light group-data-[active=true]/item:border-cu"
    >
      {/* Image panel */}
      <div className="relative aspect-[5/4] overflow-hidden border-b border-cu/30 bg-[linear-gradient(160deg,#efeae1_0%,#d9d2c6_100%)]">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes="(max-width: 448px) 78vw, 340px"
            className="object-contain p-4 mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-[1.04] group-active:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,#e6e0d5_0,#e6e0d5_10px,#dcd5c8_10px,#dcd5c8_20px)]" />
        )}
        <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-cu" aria-hidden />
        <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-cu" aria-hidden />
      </div>

      {/* Text block */}
      <div className="flex flex-1 items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <div className="text-[17px] font-semibold leading-snug tracking-[-0.005em] text-warm-white [text-wrap:balance]">
            {name}
          </div>
          <div className="mt-1.5 font-mono text-[11.5px] uppercase tracking-[0.12em] text-warm-white/55">
            {count} {count === 1 ? "product" : "products"}
          </div>
        </div>
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[3px] border border-cu/60 text-cu-light transition-colors duration-300 group-hover:border-cu group-hover:bg-cu group-hover:text-white group-active:bg-cu group-active:text-white">
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
