import { jakarta } from "@/lib/fonts";
import { getCatalogueUrl, getCoreValues, getGlobalOffices } from "@/lib/strapi";
import { PageHeader } from "@/components/app/PageHeader";
import { SectionHead } from "@/components/app/ui";
import { PhotoSlideshow, type Slide } from "@/components/company/PhotoSlideshow";
import { RotatingLines } from "@/components/company/RotatingLines";
import { CoreValues } from "@/components/company/CoreValues";
import { ProductCatalogueCard } from "@/components/app/ProductCatalogueCard";

// Photos from tritorc.com (saved in public/company) that fade into one another
// behind the overview text.
const OVERVIEW_SLIDES: Slide[] = [
  { src: "/company/slide-1-tube-bundle.jpg", position: "30% 50%" },
  { src: "/company/slide-2-onsite-machining.jpg", position: "25% 40%" },
  { src: "/company/slide-3-offshore.webp", position: "45% 50%" },
  { src: "/company/slide-4-sharjah.jpg", position: "50% 45%" },
  { src: "/company/slide-5-wellhead.jpg", position: "72% 50%" },
];

// Short facts shown one at a time over the overview photo. Every line comes from
// content already in the app (journey, stats, certifications, case studies).
const OVERVIEW_LINES = [
  "Founded in 1989, with more than 35 years of experience.",
  "Offices across India, the UAE, the USA, Algeria, Oman, Canada and Germany.",
  "In-house manufacturing of bolting and machining tools since 2013.",
  "ISO 9001:2015 certified quality management.",
  "500+ projects delivered by 100+ expert engineers.",
  "Live pipelines hot-tapped with zero downtime.",
];
const OVERVIEW_TEXT =
  "Tritorc is a trusted authority in controlled bolting, on-site machining, and pipeline integrity solutions — delivering turnkey expertise to industrial teams across 11 countries.";

// Local flag images (public/flags) keyed by the country names used in the office data.
const FLAG_CODE: Record<string, string> = {
  India: "in",
  USA: "us",
  UAE: "ae",
  Algeria: "dz",
  Oman: "om",
  Canada: "ca",
  Germany: "de",
};

export default async function CompanyPage() {
  const [coreValues, globalOffices, companyProfileUrl] = await Promise.all([
    getCoreValues(),
    getGlobalOffices(),
    getCatalogueUrl("Company Profile (Final)"),
  ]);

  return (
    <div className={jakarta.className}>
      <PageHeader title="Company" hideLogo />
      <div className="space-y-10 px-5">
        {/* 01 — Company overview */}
        <section>
          <SectionHead title="Company overview" subtitle="01/04 · About Tritorc" />
          <div className="relative overflow-hidden rounded-[28px] bg-brand-dark">
            <div className="aspect-[4/5] w-full" />
            <PhotoSlideshow slides={OVERVIEW_SLIDES} sizes="(max-width: 448px) 100vw, 408px" />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
            <RotatingLines
              className="absolute inset-x-0 bottom-0 p-5 text-[16px] leading-snug text-white/90"
              lines={OVERVIEW_LINES}
              fullText={OVERVIEW_TEXT}
            />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-[20px] bg-brand-dark px-4 py-3.5">
              <div className="text-[26px] font-extrabold leading-none tracking-[-0.02em] text-white">54+</div>
              <div className="mt-1.5 text-[11.5px] leading-snug text-white/60">Oil &amp; gas projects</div>
            </div>
            <div className="rounded-[20px] bg-brand-dark px-4 py-3.5">
              <div className="text-[26px] font-extrabold leading-none tracking-[-0.02em] text-white">300+</div>
              <div className="mt-1.5 text-[11.5px] leading-snug text-white/60">Turbines installed</div>
            </div>
          </div>
        </section>

        {/* 02 — Core values */}
        <section>
          <SectionHead title="Core values" subtitle={`02/04 · ${coreValues.length} values`} />
          <CoreValues values={coreValues} />
        </section>

        {/* 03 — Global offices */}
        <section>
          <SectionHead title="Global offices" subtitle={`03/04 · ${globalOffices.length} locations`} />
          <div className="grid grid-cols-2 gap-2">
            {globalOffices.map((o) => (
              <div
                key={`${o.city}-${o.country}`}
                className="flex min-w-0 items-center gap-1.5 rounded-[18px] border border-black/8 bg-white px-2.5 py-2 text-[11.5px] font-medium leading-tight text-brand-dark shadow-[0_1px_2px_rgba(0,0,0,.03)]"
              >
                {FLAG_CODE[o.country] && (
                  // eslint-disable-next-line @next/next/no-img-element -- tiny local flag, no optimisation needed
                  <img
                    src={`/flags/${FLAG_CODE[o.country]}.png`}
                    alt=""
                    height={14}
                    className="h-[14px] w-auto shrink-0 rounded-[2px] ring-1 ring-black/10"
                  />
                )}
                <span className="min-w-0 [text-wrap:balance]">{o.city}, <span className="text-brand-text-secondary">{o.country}</span></span>
              </div>
            ))}
          </div>
        </section>

        {/* 04 — Company profile */}
        <section>
          <SectionHead title="Company profile" subtitle="04/04 · PDF download" />
          <ProductCatalogueCard
            title="Company Profile"
            meta="6.4 MB · Updated Jul 2026"
            url={companyProfileUrl ?? "#"}
          />
        </section>
      </div>
    </div>
  );
}
