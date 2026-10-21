import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Ather-style showcase slide: a tall rounded card with the product centred
 * on a studio backdrop and the name + one-liner overlaid on a dark gradient
 * at the bottom. Use inside a `Carousel` (w-[86%]) so the next card peeks.
 */
export function ShowcaseCard({
  href,
  title,
  body,
  kicker,
  image,
  accent,
  cta,
  aspect = "aspect-[4/5]",
  fit = "contain",
  priority,
  className,
}: {
  href?: string;
  title: string;
  body?: string;
  kicker?: string;
  image?: string;
  /** Section colour: tints the backdrop glow and kicker. */
  accent?: string;
  cta?: string;
  aspect?: string;
  /** "contain" floats a cut-out product in the middle; "cover" fills the card. */
  fit?: "contain" | "cover";
  priority?: boolean;
  className?: string;
}) {
  const body_ = (
    <>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 55% at 50% 38%, ${accent ? `${accent}33` : "rgba(255,255,255,0.12)"} 0%, transparent 70%), linear-gradient(180deg, #f7f8f9 0%, #d5d9dd 100%)`,
        }}
      />
      {image && (
        <Image
          src={image}
          alt={title}
          fill
          priority={priority}
          sizes="(max-width: 448px) 86vw, 380px"
          className={cn(
            "transition-transform duration-700 ease-(--ease-premium) group-active:scale-105",
            fit === "contain" ? "object-contain px-6 pb-44 pt-8" : "object-cover"
          )}
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-center text-white">
        {kicker && (
          <div
            className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: accent ? "#ffffffb3" : undefined }}
          >
            {kicker}
          </div>
        )}
        <div className="text-[24px] font-semibold leading-tight tracking-[-0.015em]">{title}</div>
        {body && <p className="mx-auto mt-1.5 line-clamp-2 max-w-[28ch] text-[14px] leading-snug text-white/80">{body}</p>}
        {cta && (
          <span className="mt-3.5 inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2 text-[13.5px] font-semibold text-brand-dark">
            {cta}
            <ArrowUpRight size={15} />
          </span>
        )}
      </div>
    </>
  );

  const cls = cn(
    "press group relative block w-full overflow-hidden rounded-[28px] bg-brand-darker outline-none focus-visible:ring-2 focus-visible:ring-brand-dark/40",
    aspect,
    className
  );

  return href ? (
    <Link href={href} className={cls}>
      {body_}
    </Link>
  ) : (
    <div className={cls}>{body_}</div>
  );
}
