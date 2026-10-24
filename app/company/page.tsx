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
