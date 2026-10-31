"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, Copy, Download, EllipsisVertical, Share, SquarePlus, X } from "lucide-react";
import {
  dismissInstallCard,
  markAppInstalled,
  promptInstall,
  useInstallState,
  type InstallState,
} from "@/lib/installPrompt";

/**
 * "Get the app" card for the Company page. What the button does depends on the phone:
 *  - Android / desktop Chrome and Edge: opens the browser's own install dialog (one tap).
 *  - iPhone / iPad: Safari has no install dialog, so it shows the Share > Add to Home Screen steps.
 *  - Inside WhatsApp, Instagram, LinkedIn...: asks to open the page in the real browser first.
 *  - Already installed (or the user closed the card with its X): the card is not shown at all.
 */
export function InstallAppCard() {
  const state = useInstallState();
  const [sheetOpen, setSheetOpen] = useState(false);

  async function onInstall() {
    if (state.canPrompt) {
      await promptInstall();
      return;
    }
    setSheetOpen(true);
  }

  // Nothing is drawn until we know this device (no flash for people who already have the app), and never
  // for people who have the app or closed the card.
  if (!state.ready || state.installed || state.dismissed) return null;

  return (
    <>
      <div className="animate-in fade-in relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#222225] to-[#0a0a0b] p-4 duration-300 tablet:rounded-[28px] tablet:p-7">
        <svg
          aria-hidden
          viewBox="0 0 200 200"
          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 text-white/[0.08]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="100" cy="100" r="28" />
          <circle cx="100" cy="100" r="55" />
          <circle cx="100" cy="100" r="82" />
        </svg>

        {/* Cancel: hides the card (for 30 days) */}
        <button
          type="button"
          onClick={dismissInstallCard}
          aria-label="Hide this card"
          className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors active:bg-white/25 tablet:right-4 tablet:top-4"
        >
          <X size={15} />
        </button>

        <div className="relative flex items-center gap-3.5 pr-7 tablet:gap-5">
          <Image
            src="/icon-192.png"
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 shrink-0 rounded-[14px] shadow-[0_6px_18px_rgba(0,0,0,.5)] ring-1 ring-white/15 tablet:h-[72px] tablet:w-[72px] tablet:rounded-[18px]"
          />
          <div className="min-w-0 flex-1">
            <div className="text-[16px] font-extrabold leading-tight tracking-[-0.01em] text-white tablet:text-[22px]">
              Get the Tritorc app
            </div>
            <div className="mt-0.5 text-[12px] leading-snug text-white/60 tablet:text-[15px]">
              Keep catalogues and updates one tap away on your home screen.
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onInstall}
          className="press relative mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white text-[14px] font-bold text-brand-dark tablet:h-12 tablet:text-[15px]"
        >
          <Download size={16} strokeWidth={2.4} />
          Download the app
        </button>
      </div>

      {sheetOpen && <InstallHelpSheet state={state} onClose={() => setSheetOpen(false)} />}
    </>
  );
}

function Step({ n, icon, children }: { n: number; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-[12px] font-bold text-white">
        {n}
      </span>
      <span className="flex-1 text-[14px] leading-snug text-brand-dark">{children}</span>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/[0.06] text-brand-dark">{icon}</span>
    </li>
  );
}

function InstallHelpSheet({ state, onClose }: { state: InstallState; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
    } catch {
      // Clipboard can be blocked; the address is shown in the sheet anyway.
    }
  }

  const ios = state.platform === "ios";
  const android = state.platform === "android";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 tablet:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="How to install the app"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-[28px] bg-white px-5 pb-[max(env(safe-area-inset-bottom),20px)] pt-5 shadow-[0_-10px_40px_rgba(0,0,0,.3)] tablet:rounded-[28px]"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[18px] font-extrabold leading-tight tracking-[-0.01em] text-brand-dark">
              Add Tritorc to your {ios ? "Home Screen" : android ? "phone" : "device"}
            </div>
            <div className="mt-0.5 text-[12.5px] text-black/55">Takes a few seconds. No app store needed.</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/[0.07] text-brand-dark"
          >
            <X size={16} />
          </button>
        </div>

        {state.inAppBrowser ? (
          <div className="mt-5 rounded-2xl bg-[#f3f3f2] p-4 text-[14px] leading-snug text-brand-dark">
            <p className="font-semibold">Open this page in {ios ? "Safari" : "Chrome"} first.</p>
            <p className="mt-1 text-black/60">
              You are inside another app&apos;s browser, which cannot install apps. Copy the address, open{" "}
              {ios ? "Safari" : "Chrome"} and paste it there.
            </p>
            <button
              type="button"
              onClick={copyLink}
              className="press mt-3 flex h-10 items-center gap-2 rounded-full bg-black px-4 text-[13px] font-semibold text-white"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>
        ) : ios ? (
          <ol className="mt-5 space-y-4">
            <Step n={1} icon={<Share size={17} />}>
              Tap the <b>Share</b> button in Safari (the box with an arrow, at the bottom or top of the screen).
            </Step>
            <Step n={2} icon={<SquarePlus size={17} />}>
              Scroll down and tap <b>Add to Home Screen</b>.
            </Step>
            <Step n={3} icon={<Check size={17} />}>
              Tap <b>Add</b>. The Tritorc icon now sits on your home screen.
            </Step>
          </ol>
        ) : android ? (
          <ol className="mt-5 space-y-4">
            <Step n={1} icon={<EllipsisVertical size={17} />}>
              Open the browser menu (the <b>three dots</b>, top right).
            </Step>
            <Step n={2} icon={<SquarePlus size={17} />}>
              Tap <b>Install app</b> or <b>Add to Home screen</b>.
            </Step>
            <Step n={3} icon={<Check size={17} />}>
              Confirm. The Tritorc icon now sits on your home screen.
            </Step>
          </ol>
        ) : (
          <div className="mt-5 space-y-3 text-[14px] leading-snug text-brand-dark">
            <p>
              On a computer, look for the <b>install icon</b> at the right end of the address bar in Chrome or Edge.
            </p>
            <p className="text-black/60">
              To put it on a phone, open <b>{typeof window !== "undefined" ? window.location.host : "this site"}</b> in
              the phone&apos;s browser and use this button there.
            </p>
            <button
              type="button"
              onClick={copyLink}
              className="press flex h-10 items-center gap-2 rounded-full bg-black px-4 text-[13px] font-semibold text-white"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>
        )}

        {/* A web page cannot see that the user added it to the home screen, so they can tell us: the card then goes away. */}
        {!state.inAppBrowser && (ios || android) && (
          <button
            type="button"
            onClick={markAppInstalled}
            className="press mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-black text-[14px] font-bold text-white"
          >
            <Check size={16} strokeWidth={2.6} />
            I have added it
          </button>
        )}
      </div>
    </div>
  );
}
