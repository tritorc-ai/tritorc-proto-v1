import Image from "next/image";
import Link from "next/link";
import { SectionLabel } from "./SectionLabel";

interface ServicePreview {
  slug: string;
  name: string;
  tagline: string;
  imageUrl?: string;
}

export function ServicesPreviewGrid({ services }: { services: ServicePreview[] }) {
  return (
    <div className="mb-7.5">
      <SectionLabel>Services</SectionLabel>
      <div className="grid grid-cols-2 gap-2.5">
        {services.map((s) => (
          <Link
            key={s.slug}
            href={`/services/${s.slug}`}
            className="relative flex flex-col gap-2 overflow-hidden rounded-lg p-4 shadow-[0_8px_18px_rgba(0,0,0,.18)]"
          >
            {s.imageUrl ? (
              <Image src={s.imageUrl} alt="" fill sizes="50vw" className="object-cover" />
            ) : (
              <div className="absolute inset-0 bg-linear-to-br from-[#1c1c1c] to-[#2a1010]" />
            )}
            <div className="absolute inset-0 [background-image:linear-gradient(0deg,rgba(0,0,0,.75)_0%,rgba(0,0,0,.25)_70%)]" />
            <div className="pointer-events-none absolute -right-4 -top-4 h-14 w-14 rounded-full bg-brand-red/28" />
            <div className="relative text-[12.5px] font-semibold leading-snug text-white">{s.name}</div>
            <div className="relative text-[11px] leading-snug text-white/70">{s.tagline}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
