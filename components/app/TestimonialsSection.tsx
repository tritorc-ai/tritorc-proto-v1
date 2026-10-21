import Image from "next/image";
import { SectionLabel } from "@/components/app/SectionLabel";
import type { ImageKey } from "@/lib/mock/images";
import type { Testimonial } from "@/lib/mock/content";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  images: Partial<Record<ImageKey, string>>;
}

export function TestimonialsSection({ testimonials, images }: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null;

  return (
    <div className="mb-7">
      <SectionLabel>What Clients Say</SectionLabel>
      <div className="flex gap-3 overflow-x-auto pb-1.5 [scrollbar-width:none]">
        {testimonials.map((t) => {
          const avatarUrl = images[t.imageKey];
          return (
            <div
              key={t.author}
              className="w-55 shrink-0 rounded-lg border border-black/6 bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,.03),0_6px_14px_rgba(0,0,0,.05)]"
            >
              {avatarUrl && (
                <div className="relative mb-2.5 h-20 w-full overflow-hidden rounded-md">
                  <Image src={avatarUrl} alt="" fill sizes="220px" className="object-cover" />
                </div>
              )}
              <div className="text-[12.5px] italic leading-relaxed text-brand-dark">
                &ldquo;{t.quote}&rdquo;
              </div>
              <div className="mt-2 text-[11px] font-semibold text-brand-text-secondary">
                {t.author}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
