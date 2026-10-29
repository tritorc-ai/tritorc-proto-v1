import { jakarta } from "@/lib/fonts";
import { getCatalogueUrl, getCompanyPage, getGlobalOffices } from "@/lib/strapi";
import { PageHeader } from "@/components/app/PageHeader";
import { SectionHead } from "@/components/app/ui";
import { PhotoSlideshow } from "@/components/company/PhotoSlideshow";
import { RotatingLines } from "@/components/company/RotatingLines";
import { ProductCatalogueCard } from "@/components/app/ProductCatalogueCard";
import { GlobalOfficesSection } from "@/components/company/GlobalOfficesSection";
import { CertificationsBento } from "@/components/company/CertificationsBento";

// The overview text, rotating lines, slideshow photos, stat tiles, certification badges
// and the company-profile card are edited in Strapi (Company Page); the built-in
// defaults live in lib/mock/siteContent.ts.


export default async function CompanyPage() {
  const [company, globalOffices, companyProfileUrl] = await Promise.all([
    getCompanyPage(),
    getGlobalOffices(),
    getCatalogueUrl("Company Profile (Final)"),
  ]);

  return (
    <div className={jakarta.className}>
      <PageHeader title="Company" hideLogo />
      <div className="space-y-10 px-5 md:space-y-12 md:px-8 lg:px-10">
        {/* 01 — Overview photo + stats (the page heading above is just "Company") */}
        <section>
          <div className="relative overflow-hidden rounded-[28px] bg-brand-dark">
            <div className="aspect-[4/5] w-full md:aspect-[2/1] lg:aspect-[5/2]" />
            <PhotoSlideshow slides={company.slides} sizes="(max-width: 448px) 100vw, (max-width: 1024px) 92vw, 1100px" />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
            <RotatingLines
              className="absolute inset-x-0 bottom-0 p-5 text-[16px] leading-snug text-white/90 md:p-8 md:text-[22px]"
              lines={company.overviewLines}
              fullText={company.overviewText}
            />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 md:mt-4 md:gap-4">
            {company.stats.map((s) => (
              <div key={s.label} className="rounded-[20px] bg-brand-dark px-4 py-3.5 md:rounded-[26px] md:px-7 md:py-6">
                <div className="text-[26px] font-extrabold leading-none tracking-[-0.02em] text-white md:text-[40px]">{s.value}</div>
                <div className="mt-1.5 text-[11.5px] leading-snug text-white/60 md:mt-2 md:text-[15px]">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Vision and mission (edited in Strapi, Company Page). Two compact tiles side by side in the
            home page's grey/black style: a dark vision tile with a two-tone headline (like the hero)
            and a light mission tile with a big figure over a rising-bars motif. Art is decorative. */}
        <section aria-label="Vision and mission" className="grid grid-cols-2 gap-3 md:gap-4">
          <div className="relative flex min-h-[148px] flex-col justify-between overflow-hidden rounded-[22px] bg-gradient-to-br from-[#222225] to-[#0a0a0b] p-4 md:min-h-[210px] md:rounded-[28px] md:p-7">
            <svg
              aria-hidden
              viewBox="0 0 200 200"
              className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 text-white/[0.1]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="100" cy="100" r="28" />
              <circle cx="100" cy="100" r="55" />
              <circle cx="100" cy="100" r="82" />
            </svg>
            <span className="relative w-fit rounded-full bg-white/10 px-2.5 py-[3px] text-[9px] font-semibold uppercase tracking-[0.2em] text-white/80 md:px-3.5 md:py-1 md:text-[11px]">
              Vision
            </span>
            <p className="relative text-[19px] font-extrabold leading-[1.1] tracking-[-0.025em] text-white md:text-[30px]">
              {company.vision.includes(",") ? (
                <>
                  {company.vision.slice(0, company.vision.indexOf(",") + 1)}
                  <br />
                  <span className="text-white/45">{company.vision.slice(company.vision.indexOf(",") + 1).trim()}</span>
                </>
              ) : (
                company.vision
              )}
            </p>
          </div>

          <div className="relative flex min-h-[148px] flex-col justify-between overflow-hidden rounded-[22px] bg-[#e4e5e7] p-4 md:min-h-[210px] md:rounded-[28px] md:p-7">
            <div aria-hidden className="pointer-events-none absolute bottom-0 right-3 flex h-16 items-end gap-1 md:right-6 md:h-24 md:gap-1.5">
              {[16, 26, 38, 52, 66].map((h) => (
                <span key={h} className="w-2.5 rounded-t-[5px] bg-black/[0.08] md:w-4 md:scale-y-[1.45] md:origin-bottom" style={{ height: h }} />
              ))}
            </div>
            <span className="relative w-fit rounded-full bg-black/[0.07] px-2.5 py-[3px] text-[9px] font-semibold uppercase tracking-[0.2em] text-brand-text-secondary md:px-3.5 md:py-1 md:text-[11px]">
              Mission
            </span>
            <p className="relative text-[52px] font-extrabold leading-[0.9] tracking-[-0.045em] text-brand-dark md:text-[84px]">
              {company.mission}
            </p>
          </div>
        </section>

        {/* 02 — Global offices */}
        <section id="global-offices" className="scroll-mt-24">
          <SectionHead title="Global offices" />
          <GlobalOfficesSection offices={globalOffices} />
        </section>

        {/* 03 — Certifications: one bento box, badges cropped from tritorc.com */}
        <section id="certifications" className="scroll-mt-24">
          <SectionHead title="Certifications" />
          <CertificationsBento items={company.certifications} />
        </section>

        {/* 04 — Company profile */}
        <section>
          <SectionHead title="Company profile" />
          <ProductCatalogueCard
            title={company.profileTitle}
            meta={company.profileMeta}
            url={companyProfileUrl ?? "#"}
          />
        </section>
      </div>
    </div>
  );
}
