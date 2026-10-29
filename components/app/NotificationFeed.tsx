"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Bell, BookOpen, CalendarDays, CheckCheck, FileText, MessageSquare, Newspaper, Package, Play, Wrench } from "lucide-react";
import type { AppNotification, NotificationTag } from "@/lib/mock/appContent";
import { Photo } from "./ui";
import { useInbox } from "./InboxProvider";
import { cn } from "@/lib/utils";

const FILTERS: { label: string; tags: NotificationTag[] | null }[] = [
  { label: "All", tags: null },
  { label: "Events", tags: ["Event"] },
  { label: "Case studies", tags: ["Case study"] },
  { label: "Articles", tags: ["Article"] },
  { label: "Library", tags: ["Library", "Video"] },
  { label: "Updates", tags: ["Update", "Product", "Service", "LinkedIn"] },
];

const TAG_ICON: Record<NotificationTag, typeof Bell> = {
  Event: CalendarDays,
  "Case study": FileText,
  Article: Newspaper,
  Library: BookOpen,
  Video: Play,
  Update: Bell,
  Product: Package,
  Service: Wrench,
  LinkedIn: MessageSquare,
};

export function NotificationFeed({ items }: { items: AppNotification[] }) {
  const [filter, setFilter] = useState(0);
  const { unreadIds, unreadCount, markRead, markAllRead } = useInbox();
  const tags = FILTERS[filter].tags;
  const shown = tags ? items.filter((n) => tags.includes(n.tag)) : items;

  return (
    <div>
      <div role="tablist" aria-label="Filter notifications" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] tablet:mx-0 tablet:flex-wrap tablet:px-0">
        {FILTERS.map((f, i) => (
          <button
            key={f.label}
            type="button"
            role="tab"
            aria-selected={i === filter}
            onClick={() => setFilter(i)}
            className={cn(
              "press shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors",
              i === filter ? "bg-brand-dark text-white" : "bg-[#e4e5e7] text-brand-text-secondary"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {unreadCount > 0 && (
        <button
          type="button"
          onClick={markAllRead}
          className="press mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-dark"
        >
          <CheckCheck size={15} /> Mark all {unreadCount} as read
        </button>
      )}

      <ul className="mt-4 space-y-3 tablet:grid tablet:grid-cols-2 tablet:gap-3 tablet:space-y-0">
        {shown.map((n) => {
          const external = n.href.startsWith("http");
          const Icon = TAG_ICON[n.tag];
          const unread = unreadIds.has(n.id);
          return (
            <li key={n.id}>
              <Link
                href={n.href}
                onClick={() => markRead(n.id)}
                {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                className="press relative flex gap-3.5 rounded-[24px] bg-[#e4e5e7] p-3"
              >
                {unread && (
                  <span
                    aria-label="Unread"
                    className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-brand-red"
                  />
                )}
                {n.image ? (
                  <Photo src={n.image} sizes="96px" className="h-24 w-24 shrink-0 rounded-[18px]" />
                ) : (
                  <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[18px] bg-white text-brand-dark">
                    <Icon size={26} />
                  </span>
                )}
                <span className="min-w-0 flex-1 py-0.5">
                  <span className="flex items-center gap-2">
                    <span className="rounded-full bg-white/70 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-brand-text-secondary">
                      {n.tag}
                    </span>
                    {n.when && <span className="text-[12px] text-brand-text-tertiary">{n.when}</span>}
                  </span>
                  <span className="mt-1.5 line-clamp-2 block text-[15px] font-semibold leading-snug text-brand-dark">
                    {n.title}
                  </span>
                  <span className="mt-1 line-clamp-2 block text-[12.5px] leading-snug text-brand-text-secondary">
                    {n.body}
                  </span>
                  {external && (
                    <span className="mt-1.5 inline-flex items-center gap-1 text-[12px] font-semibold text-brand-dark">
                      Read on tritorc.com <ArrowUpRight size={12} />
                    </span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
