"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Share } from "lucide-react";
import { jakarta } from "@/lib/fonts";
import { cn } from "@/lib/utils";

/**
 * "Add Tritorc to your home screen" card, for phones and tablets only.
 *
 * - Android (Chrome, Edge, Samsung Internet): shown once the browser says the app is installable
 *   (`beforeinstallprompt`), with an Install button that opens the browser's own install dialog.
 * - iPhone / iPad (Safari): there is no install API, so the card shows the two taps instead.
 * - A few seconds after launch (the splash is over), as a small floating card above the tab bar;
 *   it never covers content for good and is not a modal.
 * - Never when the app is already installed (opened from the home screen, or the browser reported
 *   an install), and never nags: see `Stored` for how often it comes back.
 */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type Mode = "android" | "ios";

const STORE_KEY = "tritorc-install-v1";
const SHOW_AFTER_MS = 6000; // the 3.6 s splash plus a short settle
const DAY = 86_400_000;
const FOREVER = Number.MAX_SAFE_INTEGER;
const MAX_IMPRESSIONS = 5;

/** What is remembered between visits (per browser). */
interface Stored {
  installed?: boolean;
  /** how many times the card was shown */
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
    // private mode or storage blocked: the card just may show again next visit
  }
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
      // Count the showing now, so a user who ignores the card still does not see it on every launch.
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
      e.preventDefault(); // keep the browser's own mini-bar away; we show our card instead
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

  if (!mode) return null;

  const close = () => {
    setLeaving(true);
    setTimeout(() => {
      setMode(null);
      setLeaving(false);
    }, 260);
  };

  /** "Not now": back after 2 weeks, then 6 weeks, then never. */
  const dismiss = () => {
    const dismissed = (read().dismissed ?? 0) + 1;
    write({ dismissed, until: dismissed >= 3 ? FOREVER : Date.now() + (dismissed === 1 ? 14 : 45) * DAY });
    close();
  };

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
      aria-label="Install the Tritorc app"
      className={cn("pointer-events-none fixed inset-x-0 z-[45] mx-auto max-w-md px-4", jakarta.className)}
      // above the floating tab bar (about 56 px tall, 12 px off the bottom) plus a small gap
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 84px)" }}
    >
      <div
        className={cn(
          "pointer-events-auto flex items-center gap-3 rounded-[22px] border border-white/70 bg-white/80 p-3 shadow-[0_10px_36px_rgba(0,0,0,0.16)] backdrop-blur-2xl backdrop-saturate-[1.8]",
          leaving ? "install-card-out" : "install-card-in"
        )}
      >
        <Image src="/icon-192.png" alt="" width={44} height={44} className="h-11 w-11 shrink-0 rounded-[12px]" />
        <div className="min-w-0 flex-1">
          <div className="text-[13.5px] font-bold leading-tight text-brand-dark">Install the Tritorc app</div>
          <div className="mt-0.5 text-[11.5px] leading-snug text-brand-text-secondary">
            {mode === "android" ? (
              "One tap from your home screen, full screen."
            ) : (
              <>
                Tap <Share aria-label="Share" size={12} strokeWidth={2.2} className="-mt-0.5 inline text-brand-dark" />{" "}
                then <span className="font-semibold text-brand-dark">Add to Home Screen</span>
              </>
            )}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-stretch gap-1">
          {mode === "android" && (
            <button
              type="button"
              onClick={install}
              className="press rounded-full bg-[#0f0f10] px-4 py-1.5 text-[12px] font-semibold text-white"
            >
              Install
            </button>
          )}
          <button
            type="button"
            onClick={dismiss}
            className={cn(
              "press rounded-full px-3 text-[11.5px] font-medium text-brand-text-tertiary",
              mode === "android" ? "py-0.5" : "bg-black/5 py-1.5 font-semibold text-brand-dark"
            )}
          >
            {mode === "android" ? "Not now" : "Got it"}
          </button>
        </div>
      </div>
    </div>
  );
}
