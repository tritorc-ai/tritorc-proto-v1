import { Plus_Jakarta_Sans } from "next/font/google";
import { getCatalogueUrl, getCoreValues, getGlobalOffices, getImageUrls } from "@/lib/strapi";
import { PageHeader } from "@/components/app/PageHeader";
import { Carousel } from "@/components/app/Carousel";
import { Photo, SectionHead } from "@/components/app/ui";
import { ProductCatalogueCard } from "@/components/app/ProductCatalogueCard";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], display: "swap" });

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
            <div className="rounded-[24px] bg-brand-dark p-5">
              <div className="text-[34px] font-extrabold leading-none tracking-[-0.02em] text-white">54+</div>
              <div className="mt-2 text-[12.5px] leading-snug text-white/60">Oil &amp; gas projects</div>
            </div>
            <div className="rounded-[24px] bg-brand-dark p-5">
              <div className="text-[34px] font-extrabold leading-none tracking-[-0.02em] text-white">300+</div>
              <div className="mt-2 text-[12.5px] leading-snug text-white/60">Turbines installed</div>
            </div>
          </div>
        </section>

        {/* 02 — Core values */}
        <section>
          <SectionHead title="Core values" subtitle={`02/04 · ${coreValues.length} values`} />
          <Carousel label="Core values" itemClassName="w-[78%]">
            {coreValues.map((v, i) => (
              <div
                key={v.name}
                className="flex h-full min-h-[140px] flex-col justify-between gap-4 rounded-[24px] border border-white/10 bg-linear-to-br from-[#232326] to-[#121214] p-5"
              >
                <div className="text-[12px] font-semibold tracking-[0.18em] text-white/50">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <div className="text-[22px] font-semibold leading-tight tracking-[-0.01em] text-white">{v.name}</div>
                  <p className="mt-1.5 text-[13.5px] leading-snug text-white/65">{v.description}</p>
                </div>
              </div>
            ))}
          </Carousel>
        </section>

        {/* 03 — Global offices */}
        <section>
          <SectionHead title="Global offices" subtitle={`03/04 · ${globalOffices.length} locations`} />
          <div className="flex flex-wrap gap-2">
            {globalOffices.map((o) => (
              <div
                key={`${o.city}-${o.country}`}
                className="rounded-full border border-black/8 bg-white px-3.5 py-2 text-[13px] font-medium text-brand-dark shadow-[0_1px_2px_rgba(0,0,0,.03)]"
              >
                {o.city}, <span className="text-brand-text-secondary">{o.country}</span>
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
