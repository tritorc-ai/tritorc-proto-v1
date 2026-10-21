import { jakarta } from "@/lib/fonts";
import { Mail, Phone } from "lucide-react";
import {
  getImageUrls,
  getServiceCategories,
  getServiceSections,
  getServices,
  getThumbnailMap,
} from "@/lib/strapi";
import { CONTACT } from "@/lib/mock/appContent";
import { PageHeader } from "@/components/app/PageHeader";
import { FocusCarousel } from "@/components/app/FocusCarousel";
import { OverlayCard, SectionHead, slugify } from "@/components/app/ui";
import { SectionNav } from "@/components/app/SectionNav";
import { Reveal } from "@/components/app/Reveal";
import { HERO_VIDEOS } from "@/lib/heroVideos";


export default async function ServicesPage() {
  const [services, categories, sections, images, thumbnails] = await Promise.all([
    getServices(),
    getServiceCategories(),
    getServiceSections(),
    getImageUrls(),
    getThumbnailMap("service"),
  ]);
  const categoryImage = new Map(
    categories.map((c) => [c.name, c.directImageUrl ?? (c.imageKey ? images[c.imageKey] : undefined)])
  );

  const groups = sections
    .map((section) => ({
      ...section,
      // Follow the order of `section.categories` (lib/mock/content.ts), not the order of SERVICES.
      services: section.categories
        .flatMap((name) => services.filter((s) => s.category === name))
        .map((s) => ({
          ...s,
          imageUrl:
            thumbnails[s.slug] ??
            s.directImageUrl ??
            (s.imageKey ? images[s.imageKey] : undefined) ??
            categoryImage.get(s.category),
        })),
    }))
    .filter((g) => g.services.length > 0);

  return (
    <div className={jakarta.className}>
      <PageHeader title="Services" hideLogo titleClassName="text-[36px] font-bold" />

      {/* One padded wrapper for the bar and the sections so the bar stays sticky across the whole list */}
      <div className="px-5">
        <SectionNav variant="minimal" items={groups.map((g) => ({ id: slugify(g.name), label: g.name }))} />

        <div className="space-y-8 pt-4">
          {groups.map((group) => (
            <Reveal as="section" key={group.name} id={slugify(group.name)} className="scroll-mt-20">
              <SectionHead title={group.name} size="sm" />
              <FocusCarousel label={group.name} autoPlay={4000}>
                {group.services.map((s) => (
                  <OverlayCard
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    title={s.name}
                    body={s.tagline}
                    image={s.imageUrl}
                    video={HERO_VIDEOS[s.slug]}
                    cta="Learn more"
                    aspect="h-full"
                  />
                ))}
              </FocusCarousel>
            </Reveal>
          ))}

          <section className="rounded-[28px] bg-brand-dark p-6 text-white">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-red-bright">
              Technical support
            </div>
            <h2 className="mt-2 text-[24px] font-bold leading-[1.1] tracking-[-0.02em]">Need a service quote?</h2>
            <p className="mt-2 text-[14px] leading-snug text-white/70">
              Our team will help you scope the job and mobilise equipment and engineers.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <a
                href={`mailto:${CONTACT.email}`}
                className="press flex items-center justify-center gap-2 rounded-2xl bg-white py-3 text-[14px] font-semibold text-brand-dark"
              >
                <Mail size={16} /> Email
              </a>
              <a
                href={CONTACT.phoneIndiaHref}
                className="press flex items-center justify-center gap-2 rounded-2xl border border-white/40 py-3 text-[14px] font-semibold"
              >
                <Phone size={16} /> Call
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
