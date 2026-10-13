import Link from "next/link";
import { BookOpen, Building2, ChevronRight, Globe, Mail, Phone } from "lucide-react";
import { CONTACT } from "@/lib/mock/appContent";
import { PageHeader } from "@/components/app/PageHeader";

const ROWS = [
  { href: "/library", icon: BookOpen, title: "Library", body: "Catalogues, videos, photos and downloads" },
  { href: "/company", icon: Building2, title: "Company", body: "About, certifications, case studies, journey" },
] as const;

export default function MorePage() {
  return (
    <div>
      <PageHeader title="More" subtitle="Resources, company and contact" />
      <div className="space-y-6 px-5">
        <div className="overflow-hidden rounded-[26px] bg-white">
          {ROWS.map(({ href, icon: Icon, title, body }, i) => (
            <Link
              key={href}
              href={href}
              className={`press flex items-center gap-4 px-4 py-4 active:bg-black/[0.03] ${i > 0 ? "border-t border-black/[0.06]" : ""}`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-dark text-white">
                <Icon size={19} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[17px] font-semibold text-brand-dark">{title}</span>
                <span className="block text-[13px] leading-snug text-brand-text-secondary">{body}</span>
              </span>
              <ChevronRight size={18} className="text-brand-text-tertiary" />
            </Link>
          ))}
        </div>

        <div>
          <h2 className="mb-3 text-[20px] font-bold tracking-[-0.01em] text-brand-dark">Contact</h2>
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
        </div>

        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 pb-2 text-[13px] text-brand-text-tertiary">
          {CONTACT.social.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
