"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Installability is a progressive enhancement — ignore failures
        // (e.g. running over plain HTTP in local dev on some setups).
      });
    }
  }, []);

  return null;
}
