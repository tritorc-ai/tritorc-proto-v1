export default function ProductsLoading() {
  return (
    <div
      className="overflow-x-clip bg-ivory px-5 pt-safe"
      style={{
        minHeight: "100dvh",
        marginBottom: "calc(-1 * (88px + env(safe-area-inset-bottom, 0px)))",
        paddingBottom: "calc(88px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="mb-4 h-3.5 w-24 animate-pulse bg-cu/20" />
      <div className="mb-2 h-9 w-44 animate-pulse bg-ink/10" />
      <div className="mb-8 h-4 w-56 animate-pulse bg-ink/10" />
      {[0, 1].map((s) => (
        <div key={s} className="mb-10">
          <div className="mb-4 flex gap-3">
            <span className="w-[3px] bg-cu/40" />
            <div className="h-9 w-48 animate-pulse bg-ink/10" />
          </div>
          <div className="-mx-5 flex gap-3 overflow-hidden px-5">
            {[0, 1].map((i) => (
              <div key={i} className="w-[78%] shrink-0 overflow-hidden rounded-[4px] border border-cu/30 bg-graphite">
                <div className="aspect-[5/4] animate-pulse bg-[#d9d2c6]" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-3/4 animate-pulse bg-white/15" />
                  <div className="h-3 w-1/3 animate-pulse bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
