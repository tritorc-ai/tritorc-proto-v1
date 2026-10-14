import { Skeleton } from "@/components/app/Skeleton";

// Mirrors the Company screen: title, then Overview (photo + two stat tiles),
// Core values card, Global offices (2-column pills) and the Company profile row.
export default function CompanyLoading() {
  return (
    <div aria-busy="true" aria-label="Loading company information">
      <div className="px-5 pb-4 pt-safe">
        <Skeleton className="h-9 w-44 rounded-xl" />
      </div>

      <div className="space-y-10 px-5">
        {/* Overview */}
        <section>
          <Skeleton className="mb-4 h-7 w-56 rounded-lg" />
          <Skeleton className="aspect-[4/5] w-full rounded-[28px]" />
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Skeleton className="h-[56px] rounded-[20px]" />
            <Skeleton className="h-[56px] rounded-[20px]" />
          </div>
        </section>

        {/* Core values */}
        <section>
          <Skeleton className="mb-4 h-7 w-36 rounded-lg" />
          <Skeleton className="h-[143px] w-full rounded-[22px]" />
        </section>

        {/* Global offices */}
        <section>
          <Skeleton className="mb-4 h-7 w-44 rounded-lg" />
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-8 rounded-[18px]" />
            ))}
          </div>
        </section>

        {/* Company profile */}
        <section>
          <Skeleton className="mb-4 h-7 w-48 rounded-lg" />
          <Skeleton className="h-[76px] w-full rounded-[20px]" />
        </section>
      </div>
    </div>
  );
}
