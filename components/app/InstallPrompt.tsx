"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PlusSquare, Share } from "lucide-react";
import { jakarta } from "@/lib/fonts";
import { cn } from "@/lib/utils";

/**
 * "Install the Tritorc app" popup for phones and tablets only: a centred card over a blurred, dimmed
 * app, shown once the startup splash is over.
 *
 * - Android (Chrome, Edge, Samsung Internet): shown once the browser says the app is installable
 *   (`beforeinstallprompt`), with an Install button that opens the browser's own install dialog.
 * - iPhone / iPad (Safari): there is no install API, so the popup shows the taps to make instead.
 * - Never when the app is already installed (opened from the home screen, or the browser reported
 *   an install), and never nags: see `Stored` for how often it comes back.
 */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type Mode = "android" | "ios";

const STORE_KEY = "tritorc-install-v1";
const SHOW_AFTER_MS = 4400; // the 3.6 s splash plus a moment to look at the app
const DAY = 86_400_000;
const FOREVER = Number.MAX_SAFE_INTEGER;
const MAX_IMPRESSIONS = 5;

/** What is remembered between visits (per browser). */
interface Stored {
  installed?: boolean;
  /** how many times the popup was shown */
  shown?: number;
  /** how many times it was dismissed */
  dismissed?: number;
  /** not before this time (ms since epoch) */
  until?: number;
}

function read(): Stored {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) ?? "{}") as Stored;
  } catch {
    return {};
  }
}

function write(patch: Stored) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({ ...read(), ...patch }));
  } catch {
    // private mode or storage blocked: the popup just may show again next visit
  }
}

/** "Not now": back after 2 weeks, then 6 weeks, then never. */
function recordDismissal() {
  const dismissed = (read().dismissed ?? 0) + 1;
  write({ dismissed, until: dismissed >= 3 ? FOREVER : Date.now() + (dismissed === 1 ? 14 : 45) * DAY });
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/** A phone or tablet (a touch laptop is not one: its pointer is fine, not coarse). */
function isMobileDevice(): boolean {
  const ua = navigator.userAgent;
  return (
    /Android|iPhone|iPad|iPod|Mobile/i.test(ua) ||
    (navigator.maxTouchPoints > 1 && window.matchMedia("(pointer: coarse)").matches)
  );
}

/**
 * Safari on iPhone/iPad (iPadOS 13+ reports itself as a touch "MacIntel"). Other iOS browsers and the
 * in-app browsers of Instagram, Facebook, Line and the like are left out: their share sheet differs
 * or cannot add to the home screen at all, so the instructions would be wrong.
 */
function isIosSafari(): boolean {
  const ua = navigator.userAgent;
  const ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const other = /CriOS|FxiOS|EdgiOS|OPiOS|GSA|FBAN|FBAV|Instagram|Line\/|MicroMessenger|Snapchat/.test(ua);
  return ios && /Safari\//.test(ua) && !other;
}

export function InstallPrompt() {
  const [mode, setMode] = useState<Mode | null>(null);
  const [leaving, setLeaving] = useState(false);
  const deferred = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (!isMobileDevice()) return;
    if (isStandalone()) {
      // Opened from the home screen: it is installed, so remember that for good.
      write({ installed: true });
      return;
    }
    const saved = read();
    if (saved.installed) return;
    if ((saved.shown ?? 0) >= MAX_IMPRESSIONS) return;
    if (Date.now() < (saved.until ?? 0)) return;

    const ios = isIosSafari();
    let ready = false;
    let shown = false;

    const reveal = (m: Mode) => {
      if (shown) return;
      shown = true;
      // Count the showing now, so a user who ignores the popup still does not see it on every launch.
      write({ shown: (read().shown ?? 0) + 1, until: Date.now() + 2 * DAY });
      setMode(m);
    };
    const maybeReveal = () => {
      if (!ready) return;
      if (ios) reveal("ios");
      else if (deferred.current) reveal("android");
    };

    const timer = setTimeout(() => {
      ready = true;
      maybeReveal();
    }, SHOW_AFTER_MS);

    const onPrompt = (e: Event) => {
      e.preventDefault(); // keep the browser's own mini-bar away; we show our popup instead
      deferred.current = e as BeforeInstallPromptEvent;
      maybeReveal();
    };
    const onInstalled = () => {
      write({ installed: true, until: FOREVER });
      deferred.current = null;
      setMode(null);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const close = useCallback(() => {
    setLeaving(true);
    setTimeout(() => {
      setMode(null);
      setLeaving(false);
    }, 260);
  }, []);

  const dismiss = useCallback(() => {
    recordDismissal();
    close();
  }, [close]);

  // While the popup is open: the page behind does not scroll, and Escape closes it.
  useEffect(() => {
    if (!mode) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && dismiss();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [mode, dismiss]);

  if (!mode) return null;

  const install = async () => {
    const evt = deferred.current;
    deferred.current = null; // an event can be used only once
    if (!evt) return dismiss();
    await evt.prompt();
    const { outcome } = await evt.userChoice;
    if (outcome === "accepted") {
      write({ installed: true, until: FOREVER });
      close();
    } else {
      dismiss();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-title"
      className={cn("fixed inset-0 z-[90] flex items-center justify-center px-6", jakarta.className)}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {/* Dims and blurs the app; a tap outside the card counts as "not now". */}
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close"
        onClick={dismiss}
        className={cn(
          "absolute inset-0 cursor-default bg-black/30 backdrop-blur-md",
          leaving ? "install-fade-out" : "install-fade-in"
        )}
      />

      <div
        className={cn(
          "relative w-full max-w-[340px] rounded-[32px] border border-white/70 bg-white/90 px-6 pb-5 pt-7 text-center shadow-[0_24px_70px_rgba(0,0,0,0.3)] backdrop-blur-2xl",
          leaving ? "install-card-out" : "install-card-in"
        )}
      >
        <Image
          src="/icon-192.png"
          alt=""
          width={76}
          height={76}
          className="mx-auto h-[76px] w-[76px] rounded-[20px] shadow-[0_10px_26px_rgba(0,0,0,0.25)]"
        />
        <h2 id="install-title" className="mt-4 text-[21px] font-bold leading-tight tracking-[-0.02em] text-brand-dark">
          Install the Tritorc app
        </h2>
        <p className="mt-1.5 text-[13.5px] leading-snug text-brand-text-secondary">
          Open products, services and catalogues straight from your home screen, full screen.
        </p>

        {mode === "android" ? (
          <>
            <button
              type="button"
              autoFocus
              onClick={install}
              className="press mt-5 h-12 w-full rounded-full bg-[#0f0f10] text-[15px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(0,0,0,0.6)]"
            >
              Install
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="press mt-1 w-full py-2.5 text-[13px] font-medium text-brand-text-tertiary"
            >
              Not now
            </button>
          </>
        ) : (
          <>
            <ol className="mt-5 space-y-2 text-left text-[13.5px] text-brand-dark">
              <li className="flex items-center gap-3 rounded-2xl bg-black/[0.04] px-3.5 py-2.5">
                <Share aria-hidden size={19} strokeWidth={2} className="shrink-0" />
                <span>
                  Tap <span className="font-semibold">Share</span> in the browser bar
                </span>
              </li>
              <li className="flex items-center gap-3 rounded-2xl bg-black/[0.04] px-3.5 py-2.5">
                <PlusSquare aria-hidden size={19} strokeWidth={2} className="shrink-0" />
                <span>
                  Choose <span className="font-semibold">Add to Home Screen</span>
                </span>
              </li>
            </ol>
            <button
              type="button"
              autoFocus
              onClick={dismiss}
              className="press mt-4 h-12 w-full rounded-full bg-[#0f0f10] text-[15px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(0,0,0,0.6)]"
            >
              Got it
            </button>
          </>
        )}
      </div>
    </div>
  );
}
