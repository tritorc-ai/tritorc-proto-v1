// Light placeholder mirroring the Services page (title, section pills, a
// heading and carousel cards) — no dark blocks, so going back to Products
// never flashes black.
export default function ServicesLoading() {
  return (
    <div className="overflow-x-clip px-5 pt-safe">
      <div className="mb-5 h-10 w-44 animate-pulse rounded-lg bg-black/[0.07]" />
      <div className="mb-6 flex gap-2">
        {[88, 112, 72].map((w) => (
          <div key={w} className="h-9 animate-pulse rounded-full bg-black/[0.06]" style={{ width: w }} />
        ))}
      </div>
      {[0, 1].map((s) => (
        <div key={s} className="mb-9">
          <div className="mb-4 h-7 w-56 animate-pulse rounded-lg bg-black/[0.07]" />
          <div className="-mx-5 flex gap-3 overflow-hidden px-5">
            {[0, 1].map((i) => (
              <div key={i} className="aspect-[4/5] w-[78%] shrink-0 animate-pulse rounded-[28px] bg-black/[0.06]" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
