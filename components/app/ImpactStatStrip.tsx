import Image from "next/image";
import type { ImpactStat } from "@/lib/mock/content";
import { SectionLabel } from "./SectionLabel";

export function ImpactStatStrip({
  stats,
  imageUrl,
}: {
  stats: ImpactStat[];
  imageUrl?: string;
}) {
  return (
    <div className="relative -mx-5 mb-7 overflow-hidden bg-brand-dark px-5 py-7">
      {imageUrl ? (
        <>
          <Image src={imageUrl} alt="" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-brand-dark/85" />
        </>
      ) : (
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-sans text-[150px] font-extrabold leading-none text-white/[.03]">
          %
        </div>
      )}
      <div className="relative">
        <SectionLabel>
          <span className="text-white/55">Our Impact</span>
        </SectionLabel>
      </div>
      <div className="relative flex gap-[22px] overflow-x-auto pb-0.5 [scrollbar-width:none]">
        {stats.map((s) => (
          <div key={s.label} className="min-w-[120px] shrink-0">
            <div className="text-[32px] font-extrabold leading-none tracking-[-0.01em] text-white">
              {s.value}
            </div>
            <div className="my-2.5 h-[3px] w-[26px] bg-brand-red" />
            <div className="text-[11.5px] leading-snug font-medium text-white/60">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
