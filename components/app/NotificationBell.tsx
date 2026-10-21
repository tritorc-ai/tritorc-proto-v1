"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useInbox } from "./InboxProvider";

/** Home-header bell with an unread count badge. */
export function NotificationBell() {
  const { unreadCount } = useInbox();
  return (
    <Link
      href="/notifications"
      aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
      className="press relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur"
    >
      <Bell size={18} />
      {unreadCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-red px-1 text-[10.5px] font-bold leading-none text-white ring-2 ring-black/20">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
