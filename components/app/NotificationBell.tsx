"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInbox } from "./InboxProvider";

/**
 * Header bell with an unread count badge. `dark` sits on a photo/dark hero,
 * `light` sits on a white header pill (the bento home).
 */
export function NotificationBell({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const { unreadCount } = useInbox();
  const light = variant === "light";
  return (
    <Link
      href="/notifications"
      aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
      className={cn(
        "press relative flex items-center justify-center rounded-full",
        light
          ? "h-8 w-8 bg-neutral-100 text-neutral-800 transition-colors hover:bg-neutral-200"
          : "h-10 w-10 bg-white/20 text-white backdrop-blur"
      )}
    >
      <Bell size={light ? 16 : 18} />
      {unreadCount > 0 && (
        <span
          className={cn(
            "absolute flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-red px-1 text-[10.5px] font-bold leading-none text-white ring-2",
            light ? "-right-1 -top-1 ring-white" : "-right-0.5 -top-0.5 ring-black/20"
          )}
        >
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
