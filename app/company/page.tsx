import Link from "next/link";
import { Download, Globe, Mail, MapPin, Phone } from "lucide-react";
import {
  getCaseStudies,
  getCatalogueUrl,
  getCertifications,
  getCoreValues,
  getGlobalOffices,
  getImageUrls,
  getImpactStats,
  getJourney,
  getTestimonials,
} from "@/lib/strapi";
import { CONTACT } from "@/lib/mock/appContent";
import { PageHeader } from "@/components/app/PageHeader";
import { EnquiryForm } from "@/components/app/EnquiryForm";
import { SectionNav } from "@/components/app/SectionNav";
import { Photo, SectionHead } from "@/components/app/ui";
import {
  AchievementsBlock,
  CaseStudies,
  CertificationRow,
  ContactCta,
  FieldStories,
  IndustriesBlock,
  Journey,
  NotificationsList,
} from "@/components/home/sections";

const NAV = [
  { id: "updates", label: "Updates" },
  { id: "experience", label: "Experience" },
  { id: "certifications", label: "Certifications" },
  { id: "case-studies", label: "Case studies" },
  { id: "field", label: "In the field" },
  { id: "industries", label: "Industries" },
  { id: "journey", label: "Journey" },
  { id: "offices", label: "Offices" },
  { id: "enquiry", label: "Enquiry" },
];

export default async function CompanyPage() {
  const [images, coreValues, offices, profileUrl, stats, certifications, caseStudies, testimonials, journey] =
    await Promise.all([
      getImageUrls(),
      getCoreValues(),
      getGlobalOffices(),
      getCatalogueUrl("Company Profile (Final)"),
      getImpactStats(),
      getCertifications(),
      getCaseStudies(),
      getTestimonials(),
      getJourney(),
    ]);

  const certs = certifications.map((c) => ({
    ...c,
    imageUrl: c.code === "ISO" ? images.certIso : c.code === "CE" ? images.certCe : undefined,
  }));

  return (
    <div>
      <PageHeader title="Company" subtitle="About Tritorc" />
      <div className="space-y-10 px-5">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[30px] bg-brand-dark">
          <Photo src={images.companyIntro} className="absolute inset-0" priority sizes="(max-width: 448px) 100vw, 408px" />
          <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
              Since 1989
            </div>
            <p className="mt-1.5 text-[19px] font-semibold leading-snug tracking-[-0.01em]">
              A trusted authority in controlled bolting, on-site machining and pipeline integrity — across 11
              countries.
            </p>
          </div>
        </div>

        <SectionNav items={NAV} />

        <section id="updates" className="scroll-mt-16">
          <NotificationsList />
        </section>

        <section id="experience" className="scroll-mt-16">
          <AchievementsBlock stats={stats} image={images.impactBg} />
        </section>

        <section id="certifications" className="scroll-mt-16">
          <SectionHead title="Certifications" subtitle="Quality and compliance." />
          <CertificationRow certs={certs} />
        </section>

        <section id="case-studies" className="scroll-mt-16">
          <CaseStudies
            items={caseStudies.map((c) => ({
              ...c,
              imageUrl: c.directImageUrl ?? (c.imageKey ? images[c.imageKey] : undefined),
            }))}
          />
        </section>

        <section id="field" className="scroll-mt-16">
          <FieldStories items={testimonials} images={images} />
        </section>

        <section id="industries" className="scroll-mt-16">
          <IndustriesBlock />
        </section>

        <section id="journey" className="scroll-mt-16 space-y-10">
          <Journey items={journey} />
          <div>
            <SectionHead title="Core values" />
            <div className="grid grid-cols-2 gap-3">
              {coreValues.map((v, i) => (
                <div
                  key={v.name}
                  className={`rounded-[22px] bg-white p-4 ${i === coreValues.length - 1 && coreValues.length % 2 === 1 ? "col-span-2" : ""}`}
                >
                  <div className="text-[16px] font-semibold text-brand-dark">{v.name}</div>
                  <div className="mt-1 text-[12.5px] leading-snug text-brand-text-secondary">{v.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="offices" className="scroll-mt-16">
          <SectionHead title="Global offices" subtitle={`${offices.length} locations worldwide.`} />
          <div className="flex flex-wrap gap-2">
            {offices.map((o) => (
              <span
                key={`${o.city}-${o.country}`}
                className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[13px] font-medium text-brand-dark"
              >
                <MapPin size={13} className="text-brand-red" />
                {o.city}, <span className="text-brand-text-secondary">{o.country}</span>
              </span>
            ))}
          </div>
        </section>

        {profileUrl && profileUrl !== "#" && (
          <a
            href={profileUrl}
            target="_blank"
            rel="noreferrer"
            className="press flex items-center justify-between rounded-[26px] bg-white p-4"
          >
            <span>
              <span className="block text-[16px] font-semibold text-brand-dark">Company profile</span>
              <span className="block text-[12.5px] text-brand-text-tertiary">Download the PDF brochure</span>
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-dark text-white">
              <Download size={17} />
            </span>
          </a>
        )}
        {(!profileUrl || profileUrl === "#") && (
          <Link href="/library" className="press flex items-center justify-between rounded-[26px] bg-white p-4">
            <span>
              <span className="block text-[16px] font-semibold text-brand-dark">Company profile</span>
              <span className="block text-[12.5px] text-brand-text-tertiary">Find it in the Library</span>
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-dark text-white">
              <Download size={17} />
            </span>
          </Link>
        )}

        <section id="enquiry" className="scroll-mt-16 space-y-5">
          <SectionHead title="Enquiry" subtitle="Tell us what you need — our team will get back to you." />
          <div className="overflow-hidden rounded-[26px] bg-white">
            <a href={`mailto:${CONTACT.email}`} className="press flex items-center gap-3 px-4 py-4">
              <Mail size={18} className="text-brand-red" />
              <span className="text-[15px] text-brand-dark">{CONTACT.email}</span>
            </a>
            <a href={CONTACT.phoneIndiaHref} className="press flex items-center gap-3 border-t border-black/[0.06] px-4 py-4">
              <Phone size={18} className="text-brand-red" />
              <span className="text-[15px] text-brand-dark">{CONTACT.phoneIndia} (India)</span>
            </a>
            <a href={CONTACT.phoneUsaHref} className="press flex items-center gap-3 border-t border-black/[0.06] px-4 py-4">
              <Phone size={18} className="text-brand-red" />
              <span className="text-[15px] text-brand-dark">{CONTACT.phoneUsa} (USA)</span>
            </a>
            <a
              href={CONTACT.website}
              target="_blank"
              rel="noreferrer"
              className="press flex items-center gap-3 border-t border-black/[0.06] px-4 py-4"
            >
              <Globe size={18} className="text-brand-red" />
              <span className="text-[15px] text-brand-dark">tritorc.com</span>
            </a>
          </div>
          <EnquiryForm />
        </section>

        <ContactCta />

        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 pb-2 text-[13px] text-brand-text-tertiary">
          {CONTACT.social.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="press underline-offset-4 hover:underline">
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
