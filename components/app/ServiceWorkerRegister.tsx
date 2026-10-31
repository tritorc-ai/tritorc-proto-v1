"use client";

import { useEffect } from "react";
import { initInstallPrompt } from "@/lib/installPrompt";

export function ServiceWorkerRegister() {
  useEffect(() => {
    // Start listening for the browser's install offer from the first page, so the Company page button can use it later.
    initInstallPrompt();
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Installability is a progressive enhancement — ignore failures
        // (e.g. running over plain HTTP in local dev on some setups).
      });
    }
  }, []);

  return null;
}
