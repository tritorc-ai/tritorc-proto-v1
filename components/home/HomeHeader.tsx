"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, BookOpen, Building2, CalendarDays, Home, Menu, Package, Search, Wrench, X } from "lucide-react";
import { useInbox } from "@/components/app/InboxProvider";
import { cn } from "@/lib/utils";

const MENU = [
  { href: "/", label: "Home", icon: Home },
  { href: "/products", label: "Products", icon: Package },
  { href: "/services", label: "Services", icon: Wrench },
  { href: "/library", label: "Library", icon: BookOpen },
  { href: "/company", label: "Company", icon: Building2 },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/notifications", label: "Notifications", icon: Bell },
];

/**
 * Floating pill header from the home template: wordmark, a search button and
 * a menu button (no text links).
 * The menu lists every screen and carries the unread-notification count.
 */
export function HomeHeader() {
  const { unreadCount } = useInbox();
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);
  // The menu is open only for the route it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (next: boolean | ((o: boolean) => boolean)) => {
    const value = typeof next === "function" ? next(open) : next;
    setOpenOn(value ? pathname : null);
  };

  // Close on any tap outside the header.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpenOn(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  return (
    <header ref={ref} className="relative z-50">
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
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="press relative flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-900"
        >
          {open ? <X size={15} /> : <Menu size={15} />}
          {unreadCount > 0 && !open && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-neutral-900 ring-2 ring-neutral-100" />
          )}
        </button>
      </div>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-60 rounded-[24px] border border-black/5 bg-white p-2 shadow-[0_18px_40px_-14px_rgba(0,0,0,0.3)] animate-in fade-in slide-in-from-top-1 duration-200">
          {MENU.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className={cn(
                "press flex items-center gap-3 rounded-[16px] px-3 py-2.5 text-[14px] font-medium text-[#1c1c1e] hover:bg-neutral-100",
                pathname === href && "bg-neutral-100 font-semibold",
              )}
            >
              <Icon size={16} className="text-neutral-500" />
              <span className="flex-1">{label}</span>
              {label === "Notifications" && unreadCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-900 px-1.5 text-[11px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
