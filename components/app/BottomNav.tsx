"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, Wrench, BookOpen, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "Home", icon: Home, match: ["/"] },
  { href: "/products", label: "Products", icon: Package, match: ["/products"] },
  { href: "/services", label: "Services", icon: Wrench, match: ["/services"] },
  { href: "/library", label: "Library", icon: BookOpen, match: ["/library"] },
  { href: "/company", label: "Company", icon: Building2, match: ["/company"] },
] as const;

/** Fixed five-tab bar, pinned above the device's system navigation area. */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md px-4"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
    >
      <ul className="pointer-events-auto flex items-stretch justify-between rounded-full border border-white/70 bg-white/45 p-1 shadow-[0_10px_36px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(255,255,255,0.35)] backdrop-blur-2xl backdrop-saturate-[1.8]">
        {TABS.map(({ href, label, icon: Icon, match }) => {
          const active = match.some((m) => (m === "/" ? pathname === "/" : pathname.startsWith(m)));
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className="press relative flex flex-col items-center gap-0.5 pb-1 pt-1.5"
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-0.5 inset-y-0 rounded-full border border-white/70 bg-white/55 shadow-[0_4px_14px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-md transition-all duration-300 ease-out",
                    active ? "scale-100 opacity-100" : "scale-90 opacity-0"
                  )}
                />
                <Icon
                  size={21}
                  strokeWidth={active ? 2.1 : 1.7}
                  className={cn(
                    "relative transition-all duration-300",
                    active ? "scale-105 text-brand-dark" : "text-brand-text-tertiary"
                  )}
                />
                <span
                  className={cn(
                    "relative text-[11px] leading-none transition-colors",
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
