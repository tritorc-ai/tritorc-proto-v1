import { notFound } from "next/navigation";
import { ArrowUpRight, CalendarDays, Clock, MapPin, Store } from "lucide-react";
import { jakarta } from "@/lib/fonts";
import { getEvent, getEvents, getSiteContact } from "@/lib/strapi";
import { PageHeader } from "@/components/app/PageHeader";
import { Photo, SectionHead } from "@/components/app/ui";

export async function generateStaticParams() {
  return (await getEvents()).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata(props: PageProps<"/events/[slug]">) {
  const { slug } = await props.params;
  const event = await getEvent(slug);
  return { title: event ? `${event.title} | Tritorc` : "Event | Tritorc" };
}

export default async function EventDetailPage(props: PageProps<"/events/[slug]">) {
  const { slug } = await props.params;
  const [event, contact] = await Promise.all([getEvent(slug), getSiteContact()]);
  if (!event) notFound();

  const facts = [
    { icon: CalendarDays, label: "Date", value: event.schedule },
    { icon: MapPin, label: "Venue", value: `${event.venue}, ${event.city}` },
    ...(event.hall && event.booth
      ? [{ icon: Store, label: "Visit Tritorc", value: `Hall ${event.hall} · Booth ${event.booth}` }]
      : []),
  ];

  return (
    <div className={jakarta.className}>
      <PageHeader title={event.title} back={{ href: "/events", label: "Back to events" }} />
      <div className="space-y-9 px-5 pb-6">
        <div className="relative overflow-hidden rounded-[28px] bg-brand-dark">
          <Photo src={event.image} sizes="(max-width: 448px) 100vw, 408px" className="aspect-[4/3] w-full" priority />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-brand-dark">
            {event.status === "upcoming" ? "Upcoming" : "Completed"} · {event.category}
          </span>
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <div className="text-[22px] font-bold leading-tight">{event.dateLabel}</div>
            <div className="mt-0.5 text-[13px] text-white/75">{event.city}</div>
          </div>
        </div>

        <ul className="space-y-2.5">
          {facts.map(({ icon: Icon, label, value }) => (
            <li key={label} className="flex items-start gap-3.5 rounded-[22px] bg-[#e4e5e7] p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-brand-dark">
                <Icon size={18} />
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-brand-text-tertiary">
                  {label}
                </span>
                <span className="mt-0.5 block text-[15px] font-semibold leading-snug text-brand-dark">{value}</span>
              </span>
            </li>
          ))}
        </ul>

        {event.stats.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {event.stats.map((s) => (
              <div key={s.label} className="rounded-[20px] bg-brand-dark px-4 py-3.5">
                <div className="text-[26px] font-extrabold leading-none tracking-[-0.02em] text-white">{s.value}</div>
                <div className="mt-1.5 text-[11.5px] leading-snug text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {event.hours && (
          <section>
            <SectionHead title="Show hours" />
            <div className="overflow-hidden rounded-[22px] bg-[#e4e5e7]">
              {event.hours.map((h, i) => (
                <div
                  key={h.day}
                  className={`flex items-center justify-between px-4 py-3 ${i > 0 ? "border-t border-black/[0.08]" : ""}`}
                >
                  <span className="flex items-center gap-2 text-[14px] font-semibold text-brand-dark">
                    <Clock size={14} className="text-brand-text-tertiary" />
                    {h.day}
                  </span>
                  <span className="text-[13px] text-brand-text-secondary">{h.hours}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid gap-3">
          <a
            href={`mailto:${contact.email}?subject=${encodeURIComponent(event.title)}`}
            className="press flex items-center justify-center rounded-2xl bg-brand-dark py-3.5 text-[15px] font-semibold text-white"
          >
            {event.status === "upcoming" ? "Book a meeting with us" : "Get in touch"}
          </a>
          <a
            href={event.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="press flex items-center justify-center gap-1.5 py-1 text-[14px] text-brand-text-secondary"
          >
            View on tritorc.com <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
