"use client";

import { createContext, Fragment, useCallback, useContext, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Card-animation approaches for the Products rows.
 *   A  slow auto-advance only
 *   B  featured-card emphasis only (no automatic movement)
 *   C  static cards + bronze timer bar that triggers the advance
 *   D  hybrid: auto-advance + emphasis + timer bar   <- production default
 */
export type AnimMode = "a" | "b" | "c" | "d";

export const DEFAULT_MODE: AnimMode = "d";
const MODES: AnimMode[] = ["a", "b", "c", "d"];

/** The comparison selector exists in development, or when built with NEXT_PUBLIC_PRODUCT_ANIM_DEMO=1. */
export const ANIM_DEMO =
  process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_PRODUCT_ANIM_DEMO === "1";

export function modeFeatures(mode: AnimMode) {
  return {
    auto: mode !== "b",
    timerBar: mode === "c" || mode === "d",
    emphasis: mode === "b" || mode === "d",
  };
}

const AnimModeContext = createContext<AnimMode>(DEFAULT_MODE);
export const useAnimMode = () => useContext(AnimModeContext);

const LABELS: Record<AnimMode, string> = {
  a: "Auto",
  b: "Emphasis",
  c: "Timer",
  d: "Hybrid",
};

export function ProductAnimationProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<AnimMode>(DEFAULT_MODE);

  // Demo only: honour ?anim=a|b|c|d so a specific approach can be shared/tested.
  useEffect(() => {
    if (!ANIM_DEMO) return;
    const q = new URLSearchParams(window.location.search).get("anim");
    if (!q || !(MODES as string[]).includes(q)) return;
    const id = requestAnimationFrame(() => setModeState(q as AnimMode)); // after hydration
    return () => cancelAnimationFrame(id);
  }, []);

  const setMode = useCallback((m: AnimMode) => {
    setModeState(m);
    const url = new URL(window.location.href);
    url.searchParams.set("anim", m);
    window.history.replaceState(null, "", url);
  }, []);

  return (
    <AnimModeContext.Provider value={mode}>
      {/* Keyed by mode: switching approach remounts the rows so every timer and listener resets cleanly. */}
      <Fragment key={mode}>{children}</Fragment>
      {ANIM_DEMO && (
        <div className="pointer-events-none fixed inset-x-0 bottom-[calc(76px+env(safe-area-inset-bottom,0px))] z-50 mx-auto max-w-md px-5">
          <div
            role="group"
            aria-label="Animation approach (development only)"
            className="pointer-events-auto mx-auto flex w-fit items-center gap-1 rounded-full bg-black/85 p-1 text-[11px] text-white shadow-lg"
          >
            <span className="px-2 font-mono uppercase tracking-wider text-white/50">dev</span>
            {MODES.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
                className={cn(
                  "rounded-full px-2.5 py-1 font-medium transition-colors",
                  mode === m ? "bg-cu text-white" : "text-white/70 hover:text-white"
                )}
              >
                {m.toUpperCase()} <span className="hidden min-[380px]:inline text-[10px] opacity-70">{LABELS[m]}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </AnimModeContext.Provider>
  );
}
