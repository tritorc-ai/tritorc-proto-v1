import { cn } from "@/lib/utils";

/**
 * Thin copper progress rail for a horizontal track. Everything it shows comes
 * from the track's real scroll metrics:
 *  - `thumb`    visible share of the track (clientWidth / scrollWidth)
 *  - `progress` scroll position, 0 → 1
 *  - `index`    card nearest the snap point
 */
export function ScrollProgressIndicator({
  progress,
  thumb,
  index,
  count,
  className,
}: {
  progress: number;
  thumb: number;
  index: number;
  count: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)} aria-hidden>
      <div className="relative h-[2px] flex-1 bg-cu/25">
        <span
          className="absolute inset-y-0 bg-cu-dark"
          style={{
            width: `${Math.max(thumb, 0.08) * 100}%`,
            left: `${progress * (1 - Math.max(thumb, 0.08)) * 100}%`,
          }}
        />
      </div>
      <span className="font-mono text-[11px] tabular-nums tracking-wider text-ink-muted">
        {String(index + 1).padStart(2, "0")}
        <span className="text-cu/60"> / </span>
        {String(count).padStart(2, "0")}
      </span>
    </div>
  );
}
