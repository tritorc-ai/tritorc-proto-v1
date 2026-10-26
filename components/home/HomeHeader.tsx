"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { useInbox } from "@/components/app/InboxProvider";

/**
 * Floating pill header from the home template: wordmark, a search button and
 * a notification bell (no text links, no menu). The other screens are reached
 * from the bottom navigation. The bell opens the inbox and shows the unread count.
 */
export function HomeHeader() {
  const { unreadCount } = useInbox();

  return (
    <header className="relative z-50">
      <div className="flex items-center gap-2 rounded-full border border-black/5 bg-white py-1.5 pl-3.5 pr-1.5 shadow-sm">
        <Link href="/" aria-label="Tritorc home" className="press flex shrink-0 items-center">
          <Image
            src="/brand/tritorc-logo.png"
            alt="Tritorc"
            width={2736}
            height={371}
            priority
            className="h-[13px] w-auto shrink-0 brightness-0"
          />
        </Link>

        <div className="flex-1" />

        <Link
          href="/library"
          aria-label="Search the library"
          className="press flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-900"
        >
          <Search size={15} />
        </Link>
        <Link
          href="/notifications"
          aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
          className="press relative flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-900"
        >
          <Bell size={15} />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-neutral-900 px-1 text-[9px] font-bold leading-none text-white ring-2 ring-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
