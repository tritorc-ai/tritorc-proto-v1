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
      <div className="space-y-10 px-5">
        {/* 01 — Overview photo + stats (the page heading above is just "Company") */}
        <section>
          <div className="relative overflow-hidden rounded-[28px] bg-brand-dark">
            <div className="aspect-[4/5] w-full" />
            <PhotoSlideshow slides={company.slides} sizes="(max-width: 448px) 100vw, 408px" />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
            <RotatingLines
              className="absolute inset-x-0 bottom-0 p-5 text-[16px] leading-snug text-white/90"
              lines={company.overviewLines}
              fullText={company.overviewText}
            />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {company.stats.map((s) => (
              <div key={s.label} className="rounded-[20px] bg-brand-dark px-4 py-3.5">
                <div className="text-[26px] font-extrabold leading-none tracking-[-0.02em] text-white">{s.value}</div>
                <div className="mt-1.5 text-[11.5px] leading-snug text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Vision and mission (edited in Strapi, Company Page). Two tiles in the home page's
            grey/black style: a dark vision card with a two-tone headline (like the hero) and a
            light mission card with a big figure over a rising-bars motif. The art is decorative. */}
        <section aria-label="Vision and mission" className="space-y-3">
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#222225] to-[#0a0a0b] px-5 pb-6 pt-5">
            <svg
              aria-hidden
              viewBox="0 0 200 200"
              className="pointer-events-none absolute -right-14 -top-14 h-52 w-52 text-white/[0.09]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <circle cx="100" cy="100" r="30" />
              <circle cx="100" cy="100" r="55" />
              <circle cx="100" cy="100" r="80" />
              <circle cx="100" cy="100" r="105" />
            </svg>
            <span className="relative inline-block rounded-full bg-white/10 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-white/80">
              Vision
            </span>
            <p className="relative mt-12 text-[31px] font-extrabold leading-[1.06] tracking-[-0.03em] text-white">
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

          <div className="relative overflow-hidden rounded-[28px] bg-[#e4e5e7] px-5 pb-5 pt-5">
            <div aria-hidden className="pointer-events-none absolute bottom-0 right-5 flex h-28 items-end gap-2">
              {[28, 44, 62, 84, 112].map((h) => (
                <span key={h} className="w-5 rounded-t-[8px] bg-black/[0.07]" style={{ height: h }} />
              ))}
            </div>
            <span className="relative inline-block rounded-full bg-black/[0.07] px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-brand-text-secondary">
              Mission
            </span>
            <p className="relative mt-5 text-[92px] font-extrabold leading-[0.88] tracking-[-0.05em] text-brand-dark">
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
