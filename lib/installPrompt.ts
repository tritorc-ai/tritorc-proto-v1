"use client";

import { useSyncExternalStore } from "react";

/**
 * "Install the app" support for the Company page button.
 *
 * Chrome and Edge (Android and desktop) fire `beforeinstallprompt` once, early, and only if the app is
 * installable; the page can then show the browser's own install dialog when the user taps our button. That
 * event can arrive long before the Company page is opened, so `initInstallPrompt()` is called once at app
 * start (from ServiceWorkerRegister) and keeps the event here until it is needed.
 *
 * iPhone and iPad have no such event: Safari only installs through Share > Add to Home Screen, so the button
 * shows those steps instead.
 */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export type InstallPlatform = "ios" | "android" | "other";

export interface InstallState {
  /** Server render / first paint: nothing is known yet, so the card is not drawn (avoids a flash and a mismatch). */
  ready: boolean;
  /** The app is installed on this device (running as the home-screen app, or we saw it installed before), so the card is not needed. */
  installed: boolean;
  /** The user closed the card with its X; it stays hidden for DISMISS_DAYS. */
  dismissed: boolean;
  /** The browser can show its own install dialog right now. */
  canPrompt: boolean;
  platform: InstallPlatform;
  /** Opened inside another app's browser (WhatsApp, Instagram, LinkedIn...), where installing is not possible. */
  inAppBrowser: boolean;
}

const SERVER_STATE: InstallState = {
  ready: false,
  installed: false,
  dismissed: false,
  canPrompt: false,
  platform: "other",
  inAppBrowser: false,
};

/**
 * What this device remembers (localStorage, so per browser). A website cannot ask the phone "is my app
 * installed?" from a normal browser tab, so we remember what we did see:
 *  - the app running as the home-screen app (standalone), the browser's "app installed" event, the user
 *    accepting the install dialog, or the user tapping "I have added it";
 *  - the user closing the card.
 * Android Chrome shares this storage with its installed app, so after installing, the card also disappears
 * in the browser tab. On iPhone the home-screen app has its own storage, so Safari only knows if the user
 * tapped "I have added it".
 */
const INSTALLED_KEY = "tritorc:install:installed";
const DISMISSED_KEY = "tritorc:install:dismissedAt";
/** After closing the card with its X it stays away this long, then it may come back (unless installed). */
export const DISMISS_DAYS = 30;

function readStore(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null; // private window or blocked storage: behave as if nothing is remembered
  }
}
function writeStore(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

let deferred: BeforeInstallPromptEvent | null = null;
let started = false;
let snapshot: InstallState = SERVER_STATE;
const listeners = new Set<() => void>();

function detectPlatform(): InstallPlatform {
  const ua = navigator.userAgent;
  // iPadOS 13+ reports itself as a Mac but has a touch screen.
  const iPadOs = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  if (/iPhone|iPad|iPod/.test(ua) || iPadOs) return "ios";
  if (/Android/.test(ua)) return "android";
  return "other";
}

function isStandalone(): boolean {
  const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return iosStandalone || window.matchMedia("(display-mode: standalone)").matches;
}

function recompute() {
  // Running as the installed app proves it is installed: remember that for the browser tab on this device.
  if (isStandalone()) writeStore(INSTALLED_KEY, "1");
  const dismissedAt = Number(readStore(DISMISSED_KEY) ?? 0);
  snapshot = {
    ready: true,
    installed: isStandalone() || readStore(INSTALLED_KEY) === "1",
    dismissed: dismissedAt > 0 && Date.now() - dismissedAt < DISMISS_DAYS * 86_400_000,
    canPrompt: deferred !== null,
    platform: detectPlatform(),
    inAppBrowser: /FBAN|FBAV|Instagram|LinkedInApp|Line\/|MicroMessenger|Snapchat|Twitter|WhatsApp|GSA\//i.test(navigator.userAgent),
  };
  listeners.forEach((l) => l());
}

export function initInstallPrompt() {
  if (started || typeof window === "undefined") return;
  started = true;

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // keep it for our button instead of the browser's automatic mini-bar
    deferred = e as BeforeInstallPromptEvent;
    recompute();
  });
  window.addEventListener("appinstalled", () => {
    writeStore(INSTALLED_KEY, "1");
    deferred = null;
    recompute();
  });
  window.matchMedia("(display-mode: standalone)").addEventListener("change", recompute);
  recompute();
}

/** Shows the browser's install dialog. Resolves true if the user accepted. */
export async function promptInstall(): Promise<boolean> {
  if (!deferred) return false;
  const event = deferred;
  deferred = null; // a prompt event can only be used once
  recompute();
  await event.prompt();
  const { outcome } = await event.userChoice;
  if (outcome === "accepted") markAppInstalled();
  return outcome === "accepted";
}

/** The app is installed (the user accepted the dialog, or told us they added it): never show the card again. */
export function markAppInstalled() {
  writeStore(INSTALLED_KEY, "1");
  recompute();
}

/** The user closed the card: hide it for DISMISS_DAYS. */
export function dismissInstallCard() {
  writeStore(DISMISSED_KEY, String(Date.now()));
  recompute();
}

function subscribe(listener: () => void) {
  initInstallPrompt();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useInstallState(): InstallState {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => SERVER_STATE,
  );
}
