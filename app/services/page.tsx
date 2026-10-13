import Link from "next/link";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import {
  getImageUrls,
  getServiceCategories,
  getServiceSections,
  getServices,
  getThumbnailMap,
} from "@/lib/strapi";
import { CONTACT } from "@/lib/mock/appContent";
import { PageHeader } from "@/components/app/PageHeader";
import { Carousel } from "@/components/app/Carousel";
import { Photo, slugify } from "@/components/app/ui";

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
      services: services
        .filter((s) => section.categories.includes(s.category))
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
    <div>
      <PageHeader title="Service" subtitle="On-site expertise and technical support" />

      <nav aria-label="Service categories" className="no-scrollbar mb-2 flex gap-2 overflow-x-auto px-5 pb-2">
        {groups.map((g) => (
          <a
            key={g.name}
            href={`#${slugify(g.name)}`}
            className="press shrink-0 rounded-full bg-white px-4 py-2 text-[13px] font-medium text-brand-dark"
          >
            {g.name}
          </a>
        ))}
      </nav>

      <div className="space-y-9 px-5 pt-4">
        {groups.map((group) => (
          <section key={group.name} id={slugify(group.name)} className="scroll-mt-4">
            <div className="mb-3.5 flex items-center gap-3">
              <span className="h-7 w-1.5 rounded-full" style={{ background: group.color }} />
              <div>
                <h2 className="text-[24px] font-bold leading-none tracking-[-0.02em] text-brand-dark">{group.name}</h2>
                <div className="mt-1 text-[13px] text-brand-text-tertiary">
                  {group.services.length} {group.services.length === 1 ? "service" : "services"}
                </div>
              </div>
            </div>
            <Carousel label={group.name} itemClassName={group.services.length === 1 ? "w-full" : "w-[78%]"}>
              {group.services.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="press group block h-full overflow-hidden rounded-[26px] bg-white"
                >
                  <div className="relative aspect-[4/3]">
                    <Photo src={s.imageUrl} className="absolute inset-0" imgClassName="group-active:scale-105" sizes="300px" />
                    <div className="absolute inset-x-0 bottom-0 h-1" style={{ background: group.color }} />
                  </div>
                  <div className="flex items-start justify-between gap-2 p-4">
                    <div className="min-w-0">
                      <div className="text-[16px] font-semibold leading-tight text-brand-dark">{s.name}</div>
                      <div className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-brand-text-tertiary">
                        {s.tagline}
                      </div>
                    </div>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-dark text-white">
                      <ArrowUpRight size={15} />
                    </span>
                  </div>
                </Link>
              ))}
            </Carousel>
          </section>
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
  );
}
