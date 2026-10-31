import { jakarta } from "@/lib/fonts";
import { getCatalogueUrl, getCompanyPage, getGlobalOffices } from "@/lib/strapi";
import { PageHeader } from "@/components/app/PageHeader";
import { SectionHead } from "@/components/app/ui";
import { PhotoSlideshow } from "@/components/company/PhotoSlideshow";
import { RotatingLines } from "@/components/company/RotatingLines";
import { ProductCatalogueCard } from "@/components/app/ProductCatalogueCard";
import { InstallAppCard } from "@/components/app/InstallAppCard";
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
      <div className="space-y-10 px-5 tablet:space-y-12 tablet:px-8 tablet-lg:px-10">
        {/* 01 — Overview photo + stats (the page heading above is just "Company") */}
        <section>
          <div className="relative overflow-hidden rounded-[28px] bg-brand-dark">
            <div className="aspect-[4/5] w-full tablet:aspect-[2/1] tablet-lg:aspect-[5/2]" />
            <PhotoSlideshow slides={company.slides} sizes="(max-width: 448px) 100vw, (max-width: 1024px) 92vw, 1100px" />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
            <RotatingLines
              className="absolute inset-x-0 bottom-0 p-5 text-[16px] leading-snug text-white/90 tablet:p-8 tablet:text-[22px]"
              lines={company.overviewLines}
              fullText={company.overviewText}
            />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 tablet:mt-4 tablet:gap-4">
            {company.stats.map((s) => (
              <div key={s.label} className="rounded-[20px] bg-brand-dark px-4 py-3.5 tablet:rounded-[26px] tablet:px-7 tablet:py-6">
                <div className="text-[26px] font-extrabold leading-none tracking-[-0.02em] text-white tablet:text-[40px]">{s.value}</div>
                <div className="mt-1.5 text-[11.5px] leading-snug text-white/60 tablet:mt-2 tablet:text-[15px]">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Vision and mission (edited in Strapi, Company Page). Two compact tiles side by side in the
            home page's grey/black style: a dark vision tile with a two-tone headline (like the hero)
            and a light mission tile with a big figure over a rising-bars motif. Art is decorative. */}
        <section aria-label="Vision and mission" className="grid grid-cols-2 gap-3 tablet:gap-4">
          <div className="relative flex min-h-[148px] flex-col justify-between overflow-hidden rounded-[22px] bg-gradient-to-br from-[#222225] to-[#0a0a0b] p-4 tablet:min-h-[210px] tablet:rounded-[28px] tablet:p-7">
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
            <span className="relative w-fit rounded-full bg-white/10 px-2.5 py-[3px] text-[9px] font-semibold uppercase tracking-[0.2em] text-white/80 tablet:px-3.5 tablet:py-1 tablet:text-[11px]">
              Vision
            </span>
            <p className="relative text-[19px] font-extrabold leading-[1.1] tracking-[-0.025em] text-white tablet:text-[30px]">
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

          <div className="relative flex min-h-[148px] flex-col justify-between overflow-hidden rounded-[22px] bg-[#e4e5e7] p-4 tablet:min-h-[210px] tablet:rounded-[28px] tablet:p-7">
            <div aria-hidden className="pointer-events-none absolute bottom-0 right-3 flex h-16 items-end gap-1 tablet:right-6 tablet:h-24 tablet:gap-1.5">
              {[16, 26, 38, 52, 66].map((h) => (
                <span key={h} className="w-2.5 rounded-t-[5px] bg-black/[0.08] tablet:w-4 tablet:scale-y-[1.45] tablet:origin-bottom" style={{ height: h }} />
              ))}
            </div>
            <span className="relative w-fit rounded-full bg-black/[0.07] px-2.5 py-[3px] text-[9px] font-semibold uppercase tracking-[0.2em] text-brand-text-secondary tablet:px-3.5 tablet:py-1 tablet:text-[11px]">
              Mission
            </span>
            <p className="relative text-[52px] font-extrabold leading-[0.9] tracking-[-0.045em] text-brand-dark tablet:text-[84px]">
              {company.mission}
            </p>
          </div>
        </section>

        {/* Install the app: adapts to the phone (Android install dialog, iPhone steps, already installed) */}
        <section aria-label="Get the app">
          <InstallAppCard />
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
