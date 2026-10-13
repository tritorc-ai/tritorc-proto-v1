"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, Wrench, BookOpen, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/products", label: "Products", icon: Package },
  { href: "/services", label: "Service", icon: Wrench },
  { href: "/library", label: "Library", icon: BookOpen },
  { href: "/company", label: "Company", icon: Building2 },
] as const;

/** Fixed five-tab bar, pinned above the device's system navigation area. */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md rounded-t-[26px] bg-white/95 shadow-[0_-8px_30px_rgba(0,0,0,0.07)] backdrop-blur supports-[backdrop-filter]:bg-white/85"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="flex items-stretch justify-between px-2 pt-2.5 pb-2">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className="press flex flex-col items-center gap-1 py-0.5"
              >
                <span
                  className={cn(
                    "flex h-8 w-14 items-center justify-center rounded-full transition-all duration-300 ease-out",
                    active ? "bg-brand-red/10" : "bg-transparent"
                  )}
                >
                  <Icon
                    size={22}
                    strokeWidth={active ? 2.3 : 1.7}
                    className={cn(
                      "transition-all duration-300",
                      active ? "scale-105 text-brand-red" : "text-brand-text-tertiary"
                    )}
                  />
                </span>
                <span
                  className={cn(
                    "text-[11px] leading-none transition-colors",
                    active ? "font-semibold text-brand-dark" : "font-medium text-brand-text-tertiary"
                  )}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
