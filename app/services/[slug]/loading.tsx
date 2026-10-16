// Mirrors the service detail layout (neutral hero card + white sheet peeking
// from the bottom) so there is no dark flash between tapping a product and
// the page rendering.
export default function ServiceDetailLoading() {
  return (
    <div className="relative">
      <div className="h-[calc(100dvh-136px)] min-h-[440px] overflow-hidden bg-(--app-bg)">
        <div className="px-5 pt-safe-header">
          <div className="h-10 w-10 animate-pulse rounded-full bg-white/80" />
          <div className="mt-4 h-3 w-24 animate-pulse rounded-full bg-black/[0.07]" />
          <div className="mt-3 h-7 w-3/4 animate-pulse rounded-lg bg-black/[0.07]" />
        </div>
        <div className="mx-5 mt-4 h-[calc(100%-150px)] animate-pulse rounded-[28px] bg-white/80" />
      </div>
      <div className="relative -mt-12 min-h-[200px] rounded-t-[34px] bg-(--app-bg) px-5 pt-5 shadow-[0_-18px_40px_-18px_rgba(0,0,0,0.18)]">
        <div className="mx-auto h-1 w-10 rounded-full bg-black/15" />
        <div className="mt-6 h-4 w-full animate-pulse rounded-full bg-black/[0.06]" />
        <div className="mt-2.5 h-4 w-2/3 animate-pulse rounded-full bg-black/[0.06]" />
      </div>
    </div>
  );
}
