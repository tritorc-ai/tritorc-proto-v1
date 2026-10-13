import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Section heading in the Ather pattern: big title, muted subtitle, optional pill action. */
export function SectionHead({
  title,
  subtitle,
  action,
  tone = "light",
}: {
  title: string;
  subtitle?: string;
  action?: { href: string; label: string };
  /** "dark" is for sections that sit on a black background. */
  tone?: "light" | "dark";
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 className={cn("text-[26px] font-bold leading-[1.1] tracking-[-0.02em]", tone === "dark" ? "text-white" : "text-brand-dark")}>
          {title}
        </h2>
        {subtitle && (
          <p className={cn("mt-1 text-[14px] leading-snug", tone === "dark" ? "text-white/60" : "text-brand-text-tertiary")}>
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="press shrink-0 rounded-full bg-brand-dark px-5 py-2.5 text-[14px] font-semibold text-white"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

/** Image with a graphite hatch placeholder when no photo resolves. */
export function Photo({
  src,
  alt = "",
  sizes = "(max-width: 448px) 90vw, 400px",
  className,
  priority,
  imgClassName,
}: {
  src?: string;
  alt?: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
  imgClassName?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-[#dcdfe2]", className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover transition-transform duration-700 ease-out", imgClassName)}
        />
      ) : (
        <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,#e6e8ea_0,#e6e8ea_10px,#dcdfe2_10px,#dcdfe2_20px)]" />
      )}
    </div>
  );
}

/** Tall image card with bottom gradient, title + blurb overlay (Ather "Magic Twist" card). */
export function OverlayCard({
  href,
  image,
  title,
  body,
  kicker,
  cta,
  aspect = "aspect-[4/5]",
  frame,
  contain,
}: {
  href: string;
  image?: string;
  title: string;
  body?: string;
  kicker?: string;
  cta?: string;
  aspect?: string;
  /** Frame style: solid black border, or a fine gradient ring. */
  frame?: "black" | "ring";
  /** Cut-out product shot: show it whole on a studio backdrop instead of cropping. */
  contain?: boolean | "white";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "press group relative block overflow-hidden rounded-[28px] bg-brand-dark",
        frame === "black" && "border-[3px] border-[#0b0b0c] shadow-[0_14px_32px_-10px_rgba(0,0,0,0.45)]",
        aspect
      )}
    >
      <Photo
        src={image}
        className={cn("absolute inset-0", contain === "white" ? "bg-white" : contain && "bg-linear-to-b from-[#f7f8f9] to-[#d5d9dd]")}
        imgClassName={cn("group-active:scale-105", contain && (cta ? "object-contain px-4 pt-6 pb-44" : "object-contain px-5 pt-8 pb-28"))}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-transparent" />
      {frame === "ring" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 rounded-[28px] p-[2px]"
          style={{
            background: "linear-gradient(145deg, #DAB58F 0%, #DAB58F 30%, #563F32 100%)",
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
          }}
        />
      )}
      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        {kicker && (
          <div className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white/65">
            {kicker}
          </div>
        )}
        <div className="text-[22px] font-semibold leading-tight tracking-[-0.01em]">{title}</div>
        {body && <p className="mt-1.5 line-clamp-3 text-[14px] leading-snug text-white/80">{body}</p>}
        {cta && (
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[14px] font-semibold text-brand-dark">
            {cta}
            <ArrowUpRight size={15} />
          </span>
        )}
      </div>
    </Link>
  );
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
