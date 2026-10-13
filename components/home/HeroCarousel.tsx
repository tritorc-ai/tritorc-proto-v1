import Link from "next/link";
import { Carousel } from "@/components/app/Carousel";
import { Photo } from "@/components/app/ui";

export interface HeroSlide {
  title: string;
  tagline: string;
  image?: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
}

/** Full-bleed, image-led hero with rounded bottom edge and overlay pagination. */
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  return (
    <div className="overflow-hidden rounded-b-[36px] bg-brand-dark">
      <Carousel bleed={false} itemClassName="w-full" overlayDots trackClassName="gap-0 pb-0">
        {slides.map((s, i) => (
          <div key={s.title} className="relative h-[min(76svh,600px)] min-h-[470px] w-full">
            <Photo
              src={s.image}
              priority={i === 0}
              sizes="(max-width: 448px) 100vw, 448px"
              className="absolute inset-0"
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/10 to-black/80" />
            <div className="absolute inset-x-0 top-0 px-6 pt-[calc(env(safe-area-inset-top,0px)+76px)] text-center text-white">
              <h1 className="text-[40px] font-bold leading-[1.04] tracking-[-0.03em] [text-wrap:balance]">
                {s.title}
              </h1>
              <div className="mx-auto mt-4 inline-block rounded-full bg-white px-5 py-1.5 text-[14px] font-semibold text-brand-dark">
                {s.tagline}
              </div>
            </div>
            <div className="absolute inset-x-5 bottom-12 grid grid-cols-2 gap-3">
              <Link
                href={s.primary.href}
                className="press rounded-2xl bg-white py-3.5 text-center text-[16px] font-semibold text-brand-dark"
              >
                {s.primary.label}
              </Link>
              <Link
                href={s.secondary.href}
                className="press rounded-2xl border border-white/70 py-3.5 text-center text-[16px] font-semibold text-white backdrop-blur-[2px]"
              >
                {s.secondary.label}
              </Link>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
