import Link from "next/link";
import { MapPin } from "lucide-react";
import { jakarta } from "@/lib/fonts";
import { getEvents } from "@/lib/strapi";
import { PageHeader } from "@/components/app/PageHeader";
import { OverlayCard, Photo, SectionHead } from "@/components/app/ui";

export const metadata = { title: "Events & Exhibitions | Tritorc" };

export default async function EventsPage() {
  const events = await getEvents();
  const upcoming = events.filter((e) => e.status === "upcoming");
  const past = events.filter((e) => e.status === "past").sort((a, b) => b.start.localeCompare(a.start));

  return (
    <div className={jakarta.className}>
      <PageHeader
        title="Events"
        subtitle="Where to meet the Tritorc team."
        back={{ href: "/notifications", label: "Back to notifications" }}
      />
      <div className="space-y-9 px-5 pb-6 tablet:space-y-12 tablet:px-8 tablet-lg:px-10">
        <section>
          <SectionHead title="Upcoming" />
          <div className="space-y-4 tablet:grid tablet:grid-cols-2 tablet:gap-5 tablet:space-y-0">
            {upcoming.map((e) => (
              <OverlayCard
                key={e.slug}
                href={`/events/${e.slug}`}
                image={e.image}
                title={e.title}
                titleClassName="text-[30px] font-extrabold tracking-[-0.02em]"
                body={`${e.city} · Hall ${e.hall}, booth ${e.booth}`}
                cta="View details"
                aspect="aspect-[4/5]"
              />
            ))}
          </div>
        </section>

        <section>
          <SectionHead title="Past events" subtitle="Where we showed our tools." />
          <ul className="space-y-3 tablet:grid tablet:grid-cols-2 tablet:gap-4 tablet:space-y-0">
            {past.map((e) => (
              <li key={e.slug}>
                <Link href={`/events/${e.slug}`} className="press flex gap-3.5 rounded-[24px] bg-[#e4e5e7] p-3">
                  <Photo src={e.image} sizes="96px" className="h-24 w-24 shrink-0 rounded-[18px]" />
                  <span className="min-w-0 flex-1 py-0.5">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-brand-text-tertiary">
                      {e.category} · {e.dateLabel}
                    </span>
                    <span className="mt-1 block text-[16px] font-semibold leading-snug text-brand-dark">{e.title}</span>
                    <span className="mt-1 flex items-center gap-1 text-[12.5px] text-brand-text-secondary">
                      <MapPin size={12} className="shrink-0" />
                      <span className="truncate">{e.city}</span>
                    </span>
                    {e.stats[1] && (
                      <span className="mt-1.5 inline-block rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-semibold text-brand-text-secondary">
                        {e.stats[1].value} {e.stats[1].label.toLowerCase()}
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
