import type { JourneyMilestone } from "@/lib/mock/content";
import { SectionLabel } from "./SectionLabel";

export function JourneyTimeline({ journey }: { journey: JourneyMilestone[] }) {
  return (
    <div className="relative -mx-5 mb-8 overflow-hidden bg-brand-dark px-5 pb-5.5 pt-6.5">
      <div className="pointer-events-none absolute -left-2.5 bottom-[-30px] select-none font-sans text-[120px] font-extrabold leading-none text-white/[.03]">
        89
      </div>
      <div className="relative">
        <SectionLabel>
          <span className="text-white/55">Our Journey</span>
        </SectionLabel>
        <div className="mb-2 text-xs text-white/45">35+ years of milestones</div>
      </div>
      <div className="relative flex gap-6.5 overflow-x-auto px-0.5 pb-1.5 pt-4.5 [scrollbar-width:none]">
        <div className="absolute inset-x-0.5 top-6 h-0.5 bg-white/12" />
        {journey.map((j) => (
          <div key={j.year} className="relative z-[1] w-24 shrink-0">
            <div className="mb-2.5 h-2.5 w-2.5 rounded-full border-2 border-brand-dark bg-brand-red" />
            <div className="text-[13px] font-extrabold leading-tight text-white">{j.year}</div>
            <div className="mt-0.5 text-[10.5px] leading-snug text-white/50">{j.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
