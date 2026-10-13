"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, Wrench, ClipboardList, Ellipsis } from "lucide-react";
import { cn } from "@/lib/utils";

// "More" owns Library and Company (plus contact/social), so those routes keep
// the More tab highlighted.
const TABS = [
  { href: "/", label: "Home", icon: Home, match: ["/"] },
  { href: "/products", label: "Products", icon: Package, match: ["/products"] },
  { href: "/services", label: "Services", icon: Wrench, match: ["/services"] },
  { href: "/enquiry", label: "Enquiry", icon: ClipboardList, match: ["/enquiry"] },
  { href: "/more", label: "More", icon: Ellipsis, match: ["/more", "/library", "/company"] },
] as const;

/** Fixed five-tab bar, pinned above the device's system navigation area. */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-black/[0.06] bg-white/95 shadow-[0_-6px_24px_rgba(0,0,0,0.05)] backdrop-blur supports-[backdrop-filter]:bg-white/90"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="flex items-stretch justify-between px-1">
        {TABS.map(({ href, label, icon: Icon, match }) => {
          const active = match.some((m) => (m === "/" ? pathname === "/" : pathname.startsWith(m)));
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className="press relative flex flex-col items-center gap-1 pb-2 pt-3"
              >
                <span
                  className={cn(
                    "absolute left-1/2 top-0 h-[3px] -translate-x-1/2 rounded-b-full bg-brand-red transition-all duration-300 ease-out",
                    active ? "w-8 opacity-100" : "w-0 opacity-0"
                  )}
                />
                <Icon
                  size={24}
                  strokeWidth={active ? 2.1 : 1.7}
                  className={cn(
                    "transition-all duration-300",
                    active ? "scale-105 text-brand-dark" : "text-brand-text-tertiary"
                  )}
                />
                <span
                  className={cn(
                    "text-[12px] leading-none transition-colors",
                    active ? "font-bold text-brand-dark" : "font-medium text-brand-text-tertiary"
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
