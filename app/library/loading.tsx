import { Skeleton } from "@/components/app/Skeleton";

// Mirrors the Library screen: title + subtitle, search, type chips, category
// select, result count and a two-column grid of tiles.
export default function LibraryLoading() {
  return (
    <div aria-busy="true" aria-label="Loading library">
      <div className="px-5 pb-4 pt-safe">
        <Skeleton className="h-9 w-36 rounded-xl" />
        <Skeleton className="mt-2.5 h-4 w-64 rounded-md" />
      </div>

      <div className="px-5 pb-6">
        <Skeleton className="h-[50px] w-full rounded-full" />

        <div className="mt-3 flex gap-2 overflow-hidden">
          {[84, 112, 92, 88].map((w, i) => (
            <Skeleton key={i} className="h-[38px] shrink-0 rounded-full" style={{ width: w }} />
          ))}
        </div>

        <Skeleton className="mt-3 h-[46px] w-full rounded-full" />
        <Skeleton className="mb-3 mt-5 h-3.5 w-16 rounded-md" />

        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-[22px] bg-white">
              <Skeleton className="aspect-[4/3] w-full rounded-none" />
              <div className="px-3 pb-3.5 pt-2.5">
                <Skeleton className="mb-1.5 h-3.5 w-full rounded-md" />
                <Skeleton className="h-3 w-2/3 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
