"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import type { AppNotification } from "@/lib/mock/appContent";
import { cn } from "@/lib/utils";

const VISIBLE_MS = 6000;

/**
 * iOS/Android-style heads-up banner shown when a push arrives while the app
 * is in the foreground (the OS suppresses its own banner in that case — see
 * the push handler in public/sw.js). Tap to open, swipe up or tap X to dismiss.
 */
export function InAppBanner({
  notification,
  onClose,
  onOpen,
}: {
  notification: AppNotification | null;
  onClose: () => void;
  onOpen: (n: AppNotification) => void;
}) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const startY = useRef<number | null>(null);
  const [dragY, setDragY] = useState(0);

  // Slide in on a new notification; auto-dismiss.
  useEffect(() => {
    if (!notification) return;
    const raf = requestAnimationFrame(() => setVisible(true));
    const hide = setTimeout(() => setVisible(false), VISIBLE_MS);
    const clear = setTimeout(onClose, VISIBLE_MS + 350);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(hide);
      clearTimeout(clear);
    };
  }, [notification, onClose]);

  if (!notification) return null;
  const shown = notification;

  const open = () => {
    onOpen(shown);
    setVisible(false);
    const external = shown.href.startsWith("http");
    if (external) window.open(shown.href, "_blank", "noopener,noreferrer");
    else router.push(shown.href);
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] mx-auto max-w-md px-3"
      style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 8px)" }}
    >
      <div
        onTouchStart={(e) => (startY.current = e.touches[0].clientY)}
        onTouchMove={(e) => {
          if (startY.current === null) return;
          setDragY(Math.min(0, e.touches[0].clientY - startY.current));
        }}
        onTouchEnd={() => {
          if (dragY < -30) setVisible(false);
          setDragY(0);
          startY.current = null;
        }}
        style={{ transform: visible ? `translateY(${dragY}px)` : "translateY(-130%)" }}
        className={cn(
          "pointer-events-auto flex items-start gap-3 rounded-[22px] bg-white/90 p-3 shadow-[0_8px_30px_rgba(0,0,0,0.18)] ring-1 ring-black/5 backdrop-blur-xl",
          dragY === 0 && "transition-transform duration-300 ease-out"
        )}
      >
        <button type="button" onClick={open} className="flex min-w-0 flex-1 items-start gap-3 text-left">
          <Image
            src="/icon-192.png"
            alt=""
            width={38}
            height={38}
            className="mt-0.5 h-[38px] w-[38px] shrink-0 rounded-[10px]"
          />
          <span className="min-w-0 flex-1">
            <span className="flex items-center justify-between gap-2">
              <span className="text-[12px] font-semibold uppercase tracking-wide text-brand-text-tertiary">
                Tritorc
              </span>
              <span className="text-[12px] text-brand-text-tertiary">now</span>
            </span>
            <span className="line-clamp-1 block text-[14.5px] font-semibold text-brand-dark">{shown.title}</span>
            <span className="line-clamp-2 block text-[13px] leading-snug text-brand-text-secondary">
              {shown.body}
            </span>
          </span>
        </button>
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={() => setVisible(false)}
          className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-brand-text-tertiary"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
