import Image from "next/image";

export interface Certification {
  /** Short name shown under the badge. */
  title: string;
  /** One-line descriptor. */
  note: string;
  /** Badge image (transparent webp), shown whole. */
  image: string;
  alt: string;
}

/**
 * All certifications in ONE bento box, in the Company page's style: a soft grey
 * `#e4e5e7` rounded card (like its office chips) with the badges side by side,
 * split by a hairline. Each badge is shown whole above a bold name and a muted
 * descriptor. The section heading (`SectionHead`) is rendered by the page.
 */
export function CertificationsBento({ items }: { items: Certification[] }) {
  return (
    <div className="rounded-[28px] bg-[#e4e5e7] p-4 md:p-7">
      <div className="grid grid-cols-2 divide-x divide-black/10">
        {items.map((c) => (
          <div key={c.title} className="flex flex-col items-center px-3 text-center md:px-6">
            <div className="relative h-[96px] w-full md:h-[130px]">
              <Image src={c.image} alt={c.alt} fill sizes="160px" className="object-contain" />
            </div>
            <div className="mt-3 text-[14px] font-bold leading-tight tracking-[-0.01em] text-brand-dark">{c.title}</div>
            <div className="mt-1 text-[11.5px] leading-snug text-brand-text-secondary">{c.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
