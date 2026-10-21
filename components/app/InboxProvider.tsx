"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { AppNotification } from "@/lib/mock/appContent";
import { InAppBanner } from "./InAppBanner";

const READ_KEY = "tritorc:readIds";
const INIT_KEY = "tritorc:inboxInit";
const MAX_READ = 300;

interface InboxValue {
  unreadIds: Set<string>;
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

const InboxContext = createContext<InboxValue>({
  unreadIds: new Set(),
  unreadCount: 0,
  markRead: () => {},
  markAllRead: () => {},
});

export const useInbox = () => useContext(InboxContext);

function loadRead(): Set<string> {
  try {
    return new Set<string>(JSON.parse(localStorage.getItem(READ_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

function saveRead(ids: Set<string>) {
  try {
    localStorage.setItem(READ_KEY, JSON.stringify([...ids].slice(-MAX_READ)));
  } catch {
    // storage blocked: read state just won't persist
  }
}

/**
 * Client-side inbox: polls the live notification list, tracks read state per
 * device (anonymous devices, no server table), sets the app-icon badge and
 * shows a heads-up banner when a push arrives while the app is open.
 */
export function InboxProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(loadRead);
  const [banner, setBanner] = useState<AppNotification | null>(null);
  const ready = useRef(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      if (!res.ok) return;
      const { items: live } = (await res.json()) as { items: AppNotification[] };
      setItems(live);

      // First run on this device: everything that already exists counts as
      // read, so a new install doesn't open with a huge badge.
      let firstRun = false;
      try {
        firstRun = !localStorage.getItem(INIT_KEY);
        if (firstRun) localStorage.setItem(INIT_KEY, "1");
      } catch {}
      if (firstRun) {
        const all = new Set(live.map((n) => n.id));
        saveRead(all);
        setReadIds(all);
      }
    } catch {
      // offline / backend down: keep what we have
    }
  }, []);

  useEffect(() => {
    ready.current = true;
    const first = setTimeout(refresh, 0);

    const onVisible = () => document.visibilityState === "visible" && refresh();
    document.addEventListener("visibilitychange", onVisible);
    const timer = setInterval(refresh, 60_000);

    const onMessage = (e: MessageEvent) => {
      if (e.data?.type !== "push-received") return;
      const p = e.data.payload ?? {};
      setBanner({
        id: p.id ?? `push-${Date.now()}`,
        tag: "Update",
        title: p.title ?? "Tritorc",
        body: p.body ?? "",
        href: p.url ?? "/notifications",
        image: p.image,
      });
      refresh();
    };
    if ("serviceWorker" in navigator) navigator.serviceWorker.addEventListener("message", onMessage);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      clearTimeout(first);
      clearInterval(timer);
      if ("serviceWorker" in navigator) navigator.serviceWorker.removeEventListener("message", onMessage);
    };
  }, [refresh]);

  const unreadIds = useMemo(
    () => new Set(items.filter((n) => !readIds.has(n.id)).map((n) => n.id)),
    [items, readIds]
  );

  // Home-screen icon badge where supported (Android Chrome, iOS 16.4+ PWA).
  useEffect(() => {
    if (!ready.current) return;
    const nav = navigator as Navigator & {
      setAppBadge?: (n?: number) => Promise<void>;
      clearAppBadge?: () => Promise<void>;
    };
    if (unreadIds.size > 0) nav.setAppBadge?.(unreadIds.size).catch(() => {});
    else nav.clearAppBadge?.().catch(() => {});
  }, [unreadIds]);

  const markRead = useCallback((id: string) => {
    setReadIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev).add(id);
      saveRead(next);
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setReadIds((prev) => {
      const next = new Set(prev);
      items.forEach((n) => next.add(n.id));
      saveRead(next);
      return next;
    });
  }, [items]);

  const value = useMemo(
    () => ({ unreadIds, unreadCount: unreadIds.size, markRead, markAllRead }),
    [unreadIds, markRead, markAllRead]
  );

  return (
    <InboxContext.Provider value={value}>
      {children}
      <InAppBanner
        notification={banner}
        onClose={() => setBanner(null)}
        onOpen={(n) => markRead(n.id)}
      />
    </InboxContext.Provider>
  );
}
