import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  BookOpen,
  Bell,
  Info,
  Mail,
  Phone,
  ShieldCheck,
  Wrench,
  Layers,
  Headset,
  CalendarDays,
  ChevronRight,
} from "lucide-react";
import { Carousel } from "@/components/app/Carousel";
import { FocusCarousel } from "@/components/app/FocusCarousel";
import { OverlayCard, Photo, SectionHead } from "@/components/app/ui";
import { CONTACT, INDUSTRIES, NOTIFICATIONS, UPCOMING_EVENTS } from "@/lib/mock/appContent";
import type { CaseStudy, Certification, ImpactStat, JourneyMilestone, Testimonial } from "@/lib/mock/content";
import { cn } from "@/lib/utils";

export interface Card {
  href: string;
  title: string;
  body?: string;
  image?: string;
  kicker?: string;
  contain?: boolean;
}

export function Eyebrow({ index, label }: { index: number; label: string }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-text-tertiary">
      <span className="text-brand-red">0{index}</span>
      <span className="h-px flex-1 bg-black/10" />
      <span>{label}</span>
      <span className="flex gap-1">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={cn("h-1 w-4 rounded-full", n === index ? "bg-brand-red" : "bg-black/12")}
          />
        ))}
      </span>
    </div>
  );
}

/* ---------------- Scroll 1 ---------------- */

/** Compact announcement card shown right under the hero. */
export function UpcomingEvents() {
  return (
    <div className="space-y-3">
      {UPCOMING_EVENTS.map((e) => (
        <Link
          key={e.id}
          href={e.href}
          className="press flex items-center justify-between gap-4 rounded-[26px] bg-[#e4e5e7] px-5 py-4"
        >
          <span className="min-w-0">
            <span className="flex items-center gap-2 text-[13px] text-brand-text-secondary">
              <CalendarDays size={15} />
              Upcoming event
            </span>
            <span className="mt-1.5 block text-[16px] font-semibold leading-snug text-brand-dark">{e.title}</span>
          </span>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-brand-dark">
            <ChevronRight size={18} />
          </span>
        </Link>
      ))}
    </div>
  );
}

/** Ather "Halo" block: two compact tiles beside one large product visual. */
export function SpotlightBlock({
  title,
  subtitle,
  image,
  productHref,
  productName,
}: {
  title: string;
  subtitle: string;
  image?: string;
  productHref: string;
  productName: string;
}) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-[26px] font-bold leading-[1.1] tracking-[-0.02em] text-brand-dark">{title}</h2>
        <p className="mt-1 text-[14px] leading-snug text-brand-text-tertiary">{subtitle}</p>
      </div>
      <div className="grid h-[250px] grid-cols-[0.42fr_1fr] gap-3">
        <div className="grid grid-rows-2 gap-3">
          <Link href="/company" className="press flex flex-col overflow-hidden rounded-[22px] bg-[#e6e8ea]">
            <span className="flex flex-1 items-center justify-center text-brand-dark">
              <Info size={26} strokeWidth={1.6} />
            </span>
            <span className="bg-[#c9ccd0] py-2 text-center text-[13px] font-medium text-brand-dark">Know more</span>
          </Link>
          <Link href="/library" className="press flex flex-col overflow-hidden rounded-[22px] bg-[#e6e8ea]">
            <span className="flex flex-1 items-center justify-center text-brand-dark">
              <BookOpen size={26} strokeWidth={1.6} />
            </span>
            <span className="bg-brand-red py-2 text-center text-[13px] font-semibold text-white">Catalogues</span>
          </Link>
        </div>
        <Link href={productHref} className="press group relative overflow-hidden rounded-[22px] bg-[#e6e8ea]">
          <Photo src={image} className="absolute inset-0" imgClassName="group-active:scale-105" sizes="260px" />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-4 pt-10 text-white">
            <div className="text-[15px] font-semibold leading-tight">{productName}</div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export function ProductShowcase({ products }: { products: Card[] }) {
  return (
    <div>
      <SectionHead
        title="Product range"
        subtitle="Engineered for critical joints."
        action={{ href: "/products", label: "View all" }}
      />
      <FocusCarousel label="Featured products" autoPlay={2600}>
        {products.map((p) => (
          <OverlayCard
            key={p.href}
            href={p.href}
            image={p.image}
            title={p.title}
            kicker={p.kicker}
            aspect="h-full"
            contain={p.contain}
            framed
          />
        ))}
      </FocusCarousel>
    </div>
  );
}

/* ---------------- Scroll 2 ---------------- */

export function NotificationsList() {
  return (
    <div>
      <SectionHead title="What's new" subtitle="Announcements, updates and field news." />
      <div className="overflow-hidden rounded-[26px] bg-white">
        {NOTIFICATIONS.map((n, i) => (
          <Link
            key={n.id}
            href={n.href}
            className={cn(
              "press flex items-start gap-3.5 px-4 py-4 active:bg-black/[0.03]",
              i > 0 && "border-t border-black/[0.06]"
            )}
          >
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
              <Bell size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="rounded-full bg-black/[0.06] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-brand-text-secondary">
                  {n.tag}
                </span>
                <span className="text-[12px] text-brand-text-tertiary">{n.when}</span>
              </span>
              <span className="mt-1 block text-[15px] font-semibold leading-snug text-brand-dark">{n.title}</span>
              <span className="mt-0.5 block text-[13px] leading-snug text-brand-text-secondary">{n.body}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ServiceShowcase({ services }: { services: Card[] }) {
  return (
    <div>
      <SectionHead
        title="Tritorc services"
        subtitle="On-site expertise, anywhere."
        action={{ href: "/services", label: "View all" }}
      />
      <Carousel label="Services" itemClassName="w-[84%]">
        {services.map((s) => (
          <OverlayCard
            key={s.href}
            href={s.href}
            image={s.image}
            title={s.title}
            body={s.body}
            cta="Learn more"
            aspect="aspect-[3/4]"
          />
        ))}
      </Carousel>
    </div>
  );
}

/** Mixed layout: one large visual card + stacked compact info cards. */
export function SupportGrid({ image }: { image?: string }) {
  const compact = [
    { href: "/services/onsite-controlled-bolting", icon: ShieldCheck, title: "Joint integrity", body: "Controlled bolting by experts" },
    { href: "/products", icon: Layers, title: "Flange management", body: "Spreaders & nut splitters" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      <Link
        href="/services"
        className="press group relative row-span-2 min-h-[300px] overflow-hidden rounded-[26px] bg-brand-dark"
      >
        <Photo src={image} className="absolute inset-0" imgClassName="group-active:scale-105" sizes="220px" />
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <Wrench size={20} className="mb-2" />
          <div className="text-[18px] font-semibold leading-tight">Maintenance &amp; machining</div>
          <p className="mt-1 text-[12.5px] leading-snug text-white/75">On-site milling, cutting and facing.</p>
        </div>
      </Link>
      {compact.map(({ href, icon: Icon, title, body }) => (
        <Link key={title} href={href} className="press flex flex-col justify-between rounded-[26px] bg-white p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-dark text-white">
            <Icon size={18} />
          </span>
          <span>
            <span className="block text-[16px] font-semibold leading-tight text-brand-dark">{title}</span>
            <span className="mt-0.5 block text-[12.5px] leading-snug text-brand-text-secondary">{body}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

export function ContactStrip() {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-[26px] bg-white p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
          <Headset size={20} />
        </span>
        <span>
          <span className="block text-[15px] font-semibold text-brand-dark">Technical support</span>
          <span className="block text-[12.5px] text-brand-text-secondary">Talk to a Tritorc engineer</span>
        </span>
      </div>
      <div className="flex gap-2">
        <a
          href={CONTACT.phoneIndiaHref}
          aria-label="Call Tritorc"
          className="press flex h-11 w-11 items-center justify-center rounded-full bg-brand-dark text-white"
        >
          <Phone size={18} />
        </a>
        <a
          href={`mailto:${CONTACT.email}`}
          aria-label="Email Tritorc"
          className="press flex h-11 w-11 items-center justify-center rounded-full bg-brand-dark text-white"
        >
          <Mail size={18} />
        </a>
      </div>
    </div>
  );
}

/* ---------------- Scroll 3 ---------------- */

export function AchievementsBlock({ stats, image }: { stats: ImpactStat[]; image?: string }) {
  return (
    <div>
      <SectionHead title="Built on experience" subtitle="Tritorc by the numbers." />
      <div className="relative overflow-hidden rounded-[28px] bg-brand-dark p-5">
        {image && <Photo src={image} className="absolute inset-0 opacity-30" sizes="448px" />}
        <div className="absolute inset-0 bg-linear-to-br from-black/70 to-black/30" />
        <div className="relative grid grid-cols-2 gap-y-6">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-[38px] font-bold leading-none tracking-[-0.03em] text-white">{s.value}</div>
              <div className="mt-1.5 text-[13px] text-white/65">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-brand-red to-brand-red-bright" />
      </div>
    </div>
  );
}

export function CertificationRow({ certs }: { certs: (Certification & { imageUrl?: string })[] }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {certs.map((c) => (
        <div key={c.code} className="flex flex-col items-center rounded-[22px] bg-white px-2 py-4 text-center">
          <div className="relative mb-2 flex h-12 w-12 items-center justify-center">
            {c.imageUrl ? (
              <Image src={c.imageUrl} alt={c.code} fill sizes="48px" className="object-contain" />
            ) : (
              <ShieldCheck className="text-brand-red" size={30} />
            )}
          </div>
          <div className="text-[13px] font-semibold leading-tight text-brand-dark">{c.name}</div>
        </div>
      ))}
    </div>
  );
}

export function CaseStudies({ items, id }: { items: (CaseStudy & { imageUrl?: string })[]; id?: string }) {
  return (
    <div id={id}>
      <SectionHead title="Case studies" subtitle="Real projects, real conditions." />
      <Carousel label="Case studies" itemClassName="w-[84%]">
        {items.map((c) => (
          <div key={c.slug} className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-brand-dark">
            <Photo src={c.imageUrl} className="absolute inset-0" sizes="(max-width: 448px) 84vw, 380px" />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <div className="text-[34px] font-bold leading-none tracking-[-0.03em]">{c.stat}</div>
              <div className="mt-1 text-[12.5px] leading-snug text-white/75">{c.statLabel}</div>
              <div className="mt-3 text-[17px] font-semibold leading-tight">{c.name}</div>
              <p className="mt-1.5 line-clamp-3 text-[13px] leading-snug text-white/70">{c.meta}</p>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export function FieldStories({
  items,
  images,
}: {
  items: Testimonial[];
  images: Partial<Record<string, string>>;
}) {
  return (
    <div>
      <SectionHead title="In the field" subtitle="From Tritorc success stories." />
      <Carousel label="Field stories" itemClassName="w-[84%]" dots={items.length > 1}>
        {items.map((t) => (
          <div key={t.author} className="overflow-hidden rounded-[28px] bg-white">
            <Photo src={images[t.imageKey]} className="h-44 w-full" sizes="(max-width: 448px) 84vw, 380px" />
            <div className="p-5">
              <p className="text-[16px] font-medium leading-snug text-brand-dark">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-3 text-[12.5px] font-semibold text-brand-text-tertiary">{t.author}</div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export function IndustriesBlock() {
  return (
    <div>
      <SectionHead title="Industries we serve" subtitle="Wherever bolted joints matter." />
      <div className="grid grid-cols-2 gap-3">
        {INDUSTRIES.map((i) => (
          <Link key={i.name} href="/library" className="press rounded-[22px] bg-white p-4">
            <div className="text-[15px] font-semibold leading-tight text-brand-dark">{i.name}</div>
            <div className="mt-1 text-[12.5px] leading-snug text-brand-text-secondary">{i.note}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Journey({ items }: { items: JourneyMilestone[] }) {
  return (
    <div>
      <SectionHead title="Our journey" />
      <Carousel label="Milestones" itemClassName="w-[38%]" dots={false}>
        {items.map((m) => (
          <div key={m.year} className="h-full rounded-[22px] bg-white p-4">
            <div className="text-[24px] font-bold leading-none tracking-[-0.02em] text-brand-red">{m.year}</div>
            <div className="mt-2 text-[13px] leading-snug text-brand-dark">{m.label}</div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export function ContactCta({ stats }: { stats?: ImpactStat[] }) {
  return (
    <div className="relative overflow-hidden rounded-[30px] bg-brand-dark p-6 text-white">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-red/30 blur-2xl" />
      <div className="relative">
        {stats && (
          <Link
            href="/company"
            className="press mb-5 grid grid-cols-4 gap-2 border-b border-white/15 pb-5"
            aria-label="See Tritorc credentials on the Company tab"
          >
            {stats.slice(0, 4).map((s) => (
              <span key={s.label} className="block">
                <span className="block text-[22px] font-bold leading-none tracking-[-0.02em]">{s.value}</span>
                <span className="mt-1 block text-[10.5px] leading-tight text-white/55">{s.label}</span>
              </span>
            ))}
          </Link>
        )}
        <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-red-bright">
          Work with Tritorc
        </div>
        <h2 className="mt-2 text-[28px] font-bold leading-[1.1] tracking-[-0.02em]">
          Let&apos;s solve your bolting challenge.
        </h2>
        <p className="mt-2 text-[14px] leading-snug text-white/70">
          Tell us about the joint, the site and the schedule — our team will take it from there.
        </p>
        <div className="mt-5 grid gap-3">
          <a
            href={`mailto:${CONTACT.email}`}
            className="press flex items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-[15px] font-semibold text-brand-dark"
          >
            <Mail size={17} /> {CONTACT.email}
          </a>
          <a
            href={CONTACT.phoneIndiaHref}
            className="press flex items-center justify-center gap-2 rounded-2xl border border-white/40 py-3.5 text-[15px] font-semibold"
          >
            <Phone size={17} /> {CONTACT.phoneIndia}
          </a>
          <Link href="/company" className="press flex items-center justify-center gap-1.5 py-1 text-[14px] text-white/70">
            Credentials, case studies & more <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
