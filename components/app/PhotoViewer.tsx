"use client";

import { useEffect, useRef, useState, type TouchEvent } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Maximize,
  Minimize,
  Pause,
  Play,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ZOOM_STEPS = [1, 1.5, 2, 3, 4] as const;
const SWIPE_THRESHOLD_PX = 50;

function ControlButton({
  label,
  onClick,
  disabled,
  active,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-colors active:bg-white/25",
        active ? "bg-white/25" : "hover:bg-white/15",
        disabled && "pointer-events-none opacity-30",
      )}
    >
      {children}
    </button>
  );
}

/**
 * Full-screen photo viewer with a control bar: previous / next (within the photos only), slideshow
 * play-pause, zoom out / in / reset, fullscreen. Double-tap zooms, swipe changes photo (only while not
 * zoomed, so a zoomed photo can be dragged around), arrow keys and + / - / space work on a keyboard.
 * Zoom starts at 100% for every photo because the parent gives this component a `key` per photo.
 */
export function PhotoViewer({
  title,
  url,
  position,
  total,
  playing,
  onTogglePlay,
  onPrev,
  onNext,
  onClose,
}: {
  title: string;
  url: string;
  /** 1-based place among the photos */
  position: number;
  total: number;
  playing: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [zoomIndex, setZoomIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const zoom = ZOOM_STEPS[zoomIndex];
  const canFullscreen = typeof document !== "undefined" && !!document.fullscreenEnabled;

  function changeZoom(next: number) {
    const clamped = Math.max(0, Math.min(ZOOM_STEPS.length - 1, next));
    setZoomIndex(clamped);
    // Looking closely at a photo: stop the slideshow so it does not move on.
    if (playing && clamped > 0) onTogglePlay();
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "+" || e.key === "=") changeZoom(zoomIndex + 1);
      else if (e.key === "-") changeZoom(zoomIndex - 1);
      else if (e.key === "0") changeZoom(0);
      else if (e.key === " ") {
        e.preventDefault();
        onTogglePlay();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomIndex, playing]);

  useEffect(() => {
    function onFullscreenChange() {
      setFullscreen(document.fullscreenElement === root.current);
    }
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  function toggleFullscreen() {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void root.current?.requestFullscreen?.();
  }

  function onTouchStart(e: TouchEvent) {
    touchStartX.current = e.touches.length === 1 ? e.touches[0].clientX : null;
  }
  function onTouchEnd(e: TouchEvent) {
    if (touchStartX.current == null || zoomIndex > 0) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return;
    if (dx < 0) onNext();
    else onPrev();
  }

  const canPrev = position > 1;
  const canNext = position < total;

  return (
    <div ref={root} className="fixed inset-0 z-50 flex flex-col bg-black/95">
      <div className="flex items-center justify-between gap-2.5 bg-brand-dark px-4 py-3">
        <div className="min-w-0 flex-1 truncate text-[13px] font-semibold text-white">{title}</div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white"
          aria-label="Open photo in new tab"
        >
          <ExternalLink size={15} />
        </a>
        <a
          href={url}
          download
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white"
          aria-label="Download photo"
        >
          <Download size={15} />
        </a>
        <button
          onClick={onClose}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white"
          aria-label="Close preview"
        >
          <X size={16} />
        </button>
      </div>

      {/* The picture. Zoomed in, it grows beyond the screen and can be dragged (scrolled) around. */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="min-h-0 flex-1 overflow-auto overscroll-contain"
      >
        <div
          className="flex min-h-full min-w-full items-center justify-center p-4 pb-28"
          style={zoomIndex > 0 ? { width: `${zoom * 100}%` } : undefined}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={title}
            draggable={false}
            onDoubleClick={() => changeZoom(zoomIndex === 0 ? 2 : 0)}
            className={cn(
              "animate-in fade-in rounded-lg object-contain shadow-[0_10px_40px_rgba(0,0,0,.4)] duration-200",
              zoomIndex === 0 ? "max-h-[calc(100dvh-230px)] max-w-full cursor-zoom-in" : "w-full max-w-none cursor-zoom-out",
            )}
          />
        </div>
      </div>

      {/* Control bar */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 pb-[max(env(safe-area-inset-bottom),14px)]">
        {total > 1 && (
          <div className="rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
            {position} / {total}
          </div>
        )}
        <div
          role="toolbar"
          aria-label="Photo controls"
          className="pointer-events-auto flex items-center gap-0.5 rounded-full bg-black/60 px-2 py-1.5 shadow-[0_8px_30px_rgba(0,0,0,.45)] ring-1 ring-white/15 backdrop-blur-xl"
        >
          <ControlButton label="Previous photo" onClick={onPrev} disabled={!canPrev}>
            <ChevronLeft size={22} />
          </ControlButton>
          {total > 1 && (
            <ControlButton
              label={playing ? "Pause slideshow" : "Play slideshow"}
              onClick={onTogglePlay}
              active={playing}
            >
              {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} className="translate-x-px" fill="currentColor" />}
            </ControlButton>
          )}
          <ControlButton label="Next photo" onClick={onNext} disabled={!canNext}>
            <ChevronRight size={22} />
          </ControlButton>

          <span aria-hidden className="mx-1 h-5 w-px bg-white/20" />

          <ControlButton label="Zoom out" onClick={() => changeZoom(zoomIndex - 1)} disabled={zoomIndex === 0}>
            <ZoomOut size={19} />
          </ControlButton>
          <button
            type="button"
            onClick={() => changeZoom(0)}
            aria-label="Reset zoom"
            className="h-10 min-w-[3rem] rounded-full px-1 text-[12px] font-semibold tabular-nums text-white hover:bg-white/15"
          >
            {Math.round(zoom * 100)}%
          </button>
          <ControlButton
            label="Zoom in"
            onClick={() => changeZoom(zoomIndex + 1)}
            disabled={zoomIndex === ZOOM_STEPS.length - 1}
          >
            <ZoomIn size={19} />
          </ControlButton>

          {canFullscreen && (
            <>
              <span aria-hidden className="mx-1 h-5 w-px bg-white/20" />
              <ControlButton
                label={fullscreen ? "Exit full screen" : "Full screen"}
                onClick={toggleFullscreen}
                active={fullscreen}
              >
                {fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              </ControlButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
