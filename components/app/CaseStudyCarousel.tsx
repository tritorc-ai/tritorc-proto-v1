import Image from "next/image";
import type { CaseStudy } from "@/lib/mock/content";
import { SectionLabel } from "./SectionLabel";

type CaseStudyWithImage = CaseStudy & { imageUrl?: string };

function PhotoBg({ imageUrl, sizes }: { imageUrl?: string; sizes: string }) {
  return imageUrl ? (
    <Image src={imageUrl} alt="" fill sizes={sizes} className="object-cover" />
  ) : (
    <div className="absolute inset-0 h-full w-full bg-[repeating-linear-gradient(115deg,#4a4f55_0px,#4a4f55_16px,#3d4247_16px,#3d4247_32px)]" />
  );
}

export function CaseStudyCarousel({ caseStudies }: { caseStudies: CaseStudyWithImage[] }) {
  const [featured, ...rest] = caseStudies;
  if (!featured) return null;

  return (
    <div className="mb-8">
      <SectionLabel>Proven at Scale</SectionLabel>
      <div className="mb-3.5 text-xs text-brand-text-secondary">Real projects, real outcomes</div>

      <div className="mb-4 overflow-hidden rounded-[10px] border border-black/6 bg-white shadow-[0_1px_2px_rgba(0,0,0,.03),0_12px_26px_rgba(0,0,0,.1)]">
        <div className="relative h-[170px]">
          <PhotoBg imageUrl={featured.imageUrl} sizes="100vw" />
          <div className="absolute inset-0 [background-image:linear-gradient(0deg,rgba(10,10,10,.85)_0%,rgba(10,10,10,.1)_65%)]" />
          <div className="absolute left-3 top-2.5 rounded-sm bg-black/40 px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-wider text-brand-red-bright">
            FEATURED
          </div>
          <div className="absolute inset-x-3.5 bottom-3 text-lg font-extrabold leading-tight text-white">
            {featured.name}
          </div>
        </div>
        <div className="p-4.5">
          <div className="text-[34px] font-extrabold leading-none tracking-[-0.01em] text-brand-red">
            {featured.stat}
          </div>
          <div className="mt-1.5 text-xs font-semibold text-brand-dark">{featured.statLabel}</div>
          <div className="mt-2 text-xs leading-relaxed text-brand-text-secondary">{featured.meta}</div>
        </div>
      </div>

      <div className="flex gap-3.5 overflow-x-auto pb-1.5 [scrollbar-width:none]">
        {rest.map((cs) => (
          <div
            key={cs.slug}
            className="w-[180px] shrink-0 overflow-hidden rounded-[10px] border border-black/6 bg-white shadow-[0_1px_2px_rgba(0,0,0,.03),0_6px_14px_rgba(0,0,0,.05)]"
          >
            <div className="relative h-24">
              <PhotoBg imageUrl={cs.imageUrl} sizes="180px" />
              <div className="absolute inset-0 [background-image:linear-gradient(0deg,rgba(10,10,10,.8)_0%,rgba(10,10,10,.1)_65%)]" />
              <div className="absolute inset-x-2.5 bottom-2 text-xs font-bold leading-tight text-white">
                {cs.name}
              </div>
            </div>
            <div className="p-3">
              <div className="text-xl font-extrabold leading-none tracking-[-0.01em] text-brand-red">
                {cs.stat}
              </div>
              <div className="mt-1 text-[10.5px] font-semibold text-brand-dark">{cs.statLabel}</div>
              <div className="mt-1.5 text-[10.5px] leading-snug text-brand-text-secondary">{cs.meta}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
