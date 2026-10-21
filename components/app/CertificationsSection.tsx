import Image from "next/image";
import type { Certification } from "@/lib/mock/content";
import { SectionLabel } from "./SectionLabel";

type CertificationWithImage = Certification & { imageUrl?: string };

function Badge({ code, imageUrl }: { code: string; imageUrl?: string }) {
  if (imageUrl) {
    return (
      <div className="relative h-12 w-12 shrink-0 rounded-full border border-black/8 bg-white">
        <Image src={imageUrl} alt={code} fill sizes="48px" className="object-contain p-1.5" />
      </div>
    );
  }
  if (code === "ISO") {
    return (
      <div
        className="flex h-12 w-11 shrink-0 items-center justify-center bg-brand-dark"
        style={{ clipPath: "polygon(50% 0%,100% 18%,100% 62%,50% 100%,0% 62%,0% 18%)" }}
      >
        <span className="text-[9px] font-extrabold text-white">ISO</span>
      </div>
    );
  }
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[3px] border-brand-dark">
      <span className="text-xs font-extrabold tracking-[-0.02em] text-brand-dark">CE</span>
    </div>
  );
}

export function CertificationsSection({
  certifications,
}: {
  certifications: CertificationWithImage[];
}) {
  return (
    <div className="relative mb-8 overflow-hidden rounded-[10px] border border-black/6 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,.03),0_8px_18px_rgba(0,0,0,.05)]">
      <div
        className="absolute right-0 top-0 h-0 w-0 border-l-[44px] border-t-[44px] border-l-transparent border-t-brand-red"
      />
      <SectionLabel>Certifications</SectionLabel>
      <div className="flex gap-4">
        {certifications.map((c) => (
          <div key={c.code} className="flex flex-1 items-start gap-3">
            <Badge code={c.code} imageUrl={c.imageUrl} />
            <div className="min-w-0">
              <div className="text-[12.5px] font-bold leading-tight text-brand-dark">{c.name}</div>
              <div className="mt-0.5 text-[11px] leading-snug text-brand-text-secondary">
                {c.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
