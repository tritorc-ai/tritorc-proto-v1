import { Plus_Jakarta_Sans } from "next/font/google";
import { getCatalogueUrl, getCoreValues, getGlobalOffices, getImageUrls } from "@/lib/strapi";
import { PageHeader } from "@/components/app/PageHeader";
import { FocusCarousel } from "@/components/app/FocusCarousel";
import { Photo, SectionHead } from "@/components/app/ui";
import { ProductCatalogueCard } from "@/components/app/ProductCatalogueCard";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], display: "swap" });

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
  const [images, coreValues, globalOffices, companyProfileUrl] = await Promise.all([
    getImageUrls(),
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
            <Photo src={images.companyIntro} priority className="aspect-[4/5] w-full" sizes="(max-width: 448px) 100vw, 408px" />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
            <p className="absolute inset-x-0 bottom-0 p-5 text-[16px] leading-snug text-white/90">
              Tritorc is a trusted authority in controlled bolting, on-site machining, and pipeline integrity
              solutions — delivering turnkey expertise to industrial teams across 11 countries.
            </p>
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
          <FocusCarousel label="Core values" autoPlay={3500} aspectClassName="aspect-[2/1]">
            {coreValues.map((v, i) => (
              <div
                key={v.name}
                className="flex h-full flex-col justify-between rounded-[24px] border border-white/10 bg-linear-to-br from-[#232326] to-[#121214] px-5 py-4"
              >
                <div className="text-[11px] font-semibold tracking-[0.18em] text-white/50">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <div className="text-[20px] font-semibold leading-tight tracking-[-0.01em] text-white">{v.name}</div>
                  <p className="mt-1 text-[12.5px] leading-snug text-white/65">{v.description}</p>
                </div>
              </div>
            ))}
          </FocusCarousel>
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
