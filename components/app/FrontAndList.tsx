"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { OverlayCard, Photo } from "@/components/app/ui";
import type { HeroVideoSource } from "@/lib/heroVideos";
import { cn } from "@/lib/utils";

export interface FrontAndListItem {
  href: string;
  title: string;
  body?: string;
  image?: string;
  /** Muted clip that plays on the front card (hot tapping etc.). */
  video?: HeroVideoSource;
}

/**
 * One section of Products / Services: a single card up front, and the rest of
 * the section as a list one swipe away. The list is made hard to miss:
 *  - the next page peeks in at the right edge of the card,
 *  - a "See all N" bar sits right under the card with a stack of thumbnails
 *    and a nudging arrow (it flips to "Back to featured" on the list page).
 * No autoplay, no looping.
 */
export function FrontAndList({
  label,
  items,
  cta,
  listTitle = "More in this section",
}: {
  label: string;
  items: FrontAndListItem[];
  cta: string;
  listTitle?: string;
}) {
  const [front, ...rest] = items;
  const track = useRef<HTMLDivElement>(null);
  const [onList, setOnList] = useState(false);

  if (!front) return null;
  const hasList = rest.length > 0;

  const show = (list: boolean) => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: list ? el.scrollWidth : 0, behavior: "smooth" });
  };

  return (
    <div role="group" aria-label={label}>
      <div
        ref={track}
        onScroll={(e) => setOnList(e.currentTarget.scrollLeft > 24)}
        className={cn(
          "flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          hasList && "gap-3",
        )}
      >
        {/* Page 1: the front card (narrower than the screen so the list peeks in) */}
        <div className={cn("shrink-0 snap-start", hasList ? "w-[88%]" : "w-full")}>
          <OverlayCard
            href={front.href}
            title={front.title}
            body={front.body}
            image={front.image}
            video={front.video}
            cta={cta}
            aspect="aspect-[4/5]"
          />
        </div>

        {/* Page 2: the rest of the section as a list */}
        {hasList && (
          <div className="w-[88%] shrink-0 snap-start">
            {/* Long lists fill the same height as the front card and scroll; short ones just wrap their rows */}
            <div className={cn("flex flex-col overflow-hidden rounded-[28px] bg-[#e4e5e7]", rest.length > 4 && "aspect-[4/5]")}>
              <div className="px-4 pb-1 pt-4 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-text-secondary">
                {listTitle}
              </div>
              <ul
                className={cn(
                  "space-y-2 px-2.5 pb-2.5 pt-1.5",
                  rest.length > 4 && "flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none]",
                )}
              >
                {rest.map((it) => (
                  <li key={it.href}>
                    <Link href={it.href} className="press flex items-center gap-3 rounded-[20px] bg-white/80 p-2.5">
                      <Photo src={it.image} sizes="56px" className="h-14 w-14 shrink-0 rounded-[14px]" />
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-2 block text-[14px] font-semibold leading-snug text-brand-dark">
                          {it.title}
                        </span>
                        {it.body && (
                          <span className="mt-0.5 line-clamp-1 block text-[12px] text-brand-text-secondary">{it.body}</span>
                        )}
                      </span>
                      <ChevronRight size={16} className="shrink-0 text-brand-text-tertiary" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {hasList && (
        <button
          type="button"
          onClick={() => show(!onList)}
          aria-label={onList ? "Back to the featured card" : `See all ${items.length} in ${label}`}
          className="press mt-3 flex w-full items-center gap-3 rounded-full bg-[#e4e5e7] py-2 pl-3 pr-2 text-left"
        >
          {onList ? (
            <span className="ml-1 shrink-0 text-[11px] font-semibold uppercase tracking-wider text-brand-text-secondary">Swipe</span>
          ) : (
            <span className="flex shrink-0 items-center">
              {items.slice(1, 4).map((it, i) => (
                <Photo
                  key={it.href}
                  src={it.image}
                  sizes="28px"
                  className={cn("h-7 w-7 rounded-full ring-2 ring-[#e4e5e7]", i > 0 && "-ml-2.5")}
                />
              ))}
            </span>
          )}
          <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-brand-dark">
            {onList ? "Back to featured" : `See all ${items.length} in ${label}`}
          </span>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-dark text-white">
            {onList ? <ChevronLeft size={16} /> : <ChevronRight size={16} className="animate-nudge motion-reduce:animate-none" />}
          </span>
        </button>
      )}
    </div>
  );
}
