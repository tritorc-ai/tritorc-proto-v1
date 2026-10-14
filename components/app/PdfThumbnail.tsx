// A generated "stacked paper, folded corner" thumbnail for catalogues that
// have no real preview image. Black and white only, so the grid stays calm and
// consistent with the rest of the app.
export function PdfThumbnail({ title }: { title: string }) {
  return (
    <div
      role="img"
      aria-label={`${title} (PDF)`}
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#ececec]"
    >
      <div className="absolute h-16 w-12 rounded-[4px] bg-black/10" style={{ transform: "rotate(9deg) translate(6px, 3px)" }} />
      <div className="relative h-16 w-12 -rotate-6 rounded-[4px] bg-white shadow-[0_4px_10px_rgba(0,0,0,.18)]">
        <div
          className="absolute right-0 top-0 h-0 w-0"
          style={{
            borderStyle: "solid",
            borderWidth: "0 10px 10px 0",
            borderColor: "transparent #d4d4d4 transparent transparent",
          }}
        />
        <div className="absolute inset-x-1.5 top-5 flex flex-col gap-1">
          <div className="h-0.5 rounded-full bg-black/15" />
          <div className="h-0.5 w-4/5 rounded-full bg-black/15" />
          <div className="h-0.5 w-3/5 rounded-full bg-black/15" />
        </div>
        <div className="absolute bottom-1 left-1 rounded-[2px] bg-black px-1 py-px text-[6px] font-black tracking-wide text-white">
          PDF
        </div>
      </div>
    </div>
  );
}
