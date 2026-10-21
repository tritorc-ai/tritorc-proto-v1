"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { disablePush, enablePush, getPushState, type PushState } from "@/lib/push";

const COPY: Record<PushState, { title: string; body: string }> = {
  unsupported: { title: "Notifications unavailable", body: "This browser doesn't support push notifications." },
  "needs-install": {
    title: "Install to get notifications",
    body: "On iPhone, tap Share → Add to Home Screen, then open Tritorc from your home screen.",
  },
  denied: { title: "Notifications blocked", body: "Enable them for Tritorc in your device or browser settings." },
  default: { title: "Stay in the loop", body: "Get event, product and LinkedIn updates as notifications." },
  subscribed: { title: "Notifications are on", body: "You'll be alerted about new Tritorc updates." },
};

export function NotificationPrompt() {
  const [state, setState] = useState<PushState | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPushState().then(setState).catch(() => setState("unsupported"));
  }, []);

  // Browser rotated the push subscription: register the fresh one.
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const onMessage = (e: MessageEvent) => {
      if (e.data?.type === "push-resubscribe") enablePush().catch(() => {});
    };
    navigator.serviceWorker.addEventListener("message", onMessage);
    return () => navigator.serviceWorker.removeEventListener("message", onMessage);
  }, []);

  if (!state) return null;

  async function toggle() {
    setBusy(true);
    setError(null);
    try {
      setState(state === "subscribed" ? await disablePush() : await enablePush());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  const canToggle = state === "default" || state === "subscribed";
  const { title, body } = COPY[state];

  return (
    <div className="mb-4 flex items-center gap-3 rounded-[24px] border border-black/10 bg-white p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-dark text-white">
        {state === "denied" || state === "unsupported" ? <BellOff size={18} /> : <Bell size={18} />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold">{title}</span>
        <span className="block text-[12.5px] text-brand-text-secondary">{error ?? body}</span>
      </span>
      {canToggle && (
        <button
          type="button"
          onClick={toggle}
          disabled={busy}
          className="press shrink-0 rounded-full bg-brand-dark px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-60"
        >
          {state === "subscribed" ? "Turn off" : "Enable"}
        </button>
      )}
    </div>
  );
}
