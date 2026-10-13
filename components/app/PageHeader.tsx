import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

/** Large-title page header used by every tab screen and sub-screen. */
export function PageHeader({
  title,
  subtitle,
  back,
}: {
  title: string;
  subtitle?: string;
  back?: { href: string; label?: string };
}) {
  return (
    <div className="px-5 pb-4 pt-safe">
      {!back && (
        <Link href="/" aria-label="Tritorc home" className="press mb-4 inline-block">
          <Image src="/brand/tritorc-logo.png" alt="Tritorc" width={104} height={14} className="h-3.5 w-auto" />
        </Link>
      )}
      {back && (
        <Link
          href={back.href}
          className="press mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-dark"
          aria-label={back.label ?? "Back"}
        >
          <ArrowLeft size={19} />
        </Link>
      )}
      <h1 className="text-[34px] font-bold leading-[1.05] tracking-[-0.03em] text-brand-dark">{title}</h1>
      {subtitle && <p className="mt-1.5 text-[15px] leading-snug text-brand-text-tertiary">{subtitle}</p>}
    </div>
  );
}
