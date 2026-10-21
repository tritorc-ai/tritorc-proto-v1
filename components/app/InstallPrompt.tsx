"use client";

import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";

// Chrome/Edge/Android only — Safari and Firefox never fire this event, so
// the button simply never appears there (installing is manual via each
// browser's own share/menu UI, same as before this component existed).
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "tritorc-install-dismissed";

// iOS never fires beforeinstallprompt — there's no programmatic install API,
// only the user manually tapping Share -> Add to Home Screen. Detected via
// UA (including iPadOS 13+, which reports as a touch-capable "MacIntel"),
// excluding other iOS browser shells (Chrome/Firefox/Edge/Opera) that share
// Safari's engine but don't expose the same Share-sheet instructions.
function isIosSafari(): boolean {
  const ua = navigator.userAgent;
  const isIos = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isOtherBrowser = /CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
  return isIos && !isOtherBrowser;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    const dismissed = sessionStorage.getItem(DISMISSED_KEY) === "1";
    if (isStandalone || dismissed) return;

    // Deliberately deferred to an effect rather than computed during render:
    // navigator/matchMedia/sessionStorage aren't available during SSR, and
    // computing this synchronously on the client's first render would mismatch
    // the server-rendered (null) output and trigger a hydration error.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isIosSafari()) setShowIosHint(true);

    function handler(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!deferredPrompt && !showIosHint) return null;

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }

  function handleDismiss() {
    sessionStorage.setItem(DISMISSED_KEY, "1");
    setDeferredPrompt(null);
    setShowIosHint(false);
  }

  return (
    <div
      className="sticky z-20 mx-3 mb-2 flex items-center gap-2.5 rounded-lg bg-brand-dark px-3.5 py-2.5 shadow-[0_10px_24px_rgba(0,0,0,.25)]"
      style={{ bottom: "calc(64px + env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
        {deferredPrompt ? <Download size={15} /> : <Share size={15} />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[12.5px] font-semibold text-white">Install Tritorc App</div>
        <div className="text-[10.5px] text-white/60">
          {deferredPrompt ? (
            "Faster access, works like a native app"
          ) : (
            <>
              Tap <span className="font-semibold text-white/80">Share</span>, then{" "}
              <span className="font-semibold text-white/80">Add to Home Screen</span>
            </>
          )}
        </div>
      </div>
      {deferredPrompt && (
        <button
          onClick={handleInstall}
          className="shrink-0 rounded-md bg-brand-red px-3 py-1.5 text-[11.5px] font-semibold text-white"
        >
          Install
        </button>
      )}
      <button
        onClick={handleDismiss}
        aria-label="Dismiss"
        className="shrink-0 text-white/50"
      >
        <X size={16} />
      </button>
    </div>
  );
}
