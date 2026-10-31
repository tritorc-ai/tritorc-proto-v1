import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    // A stable id keeps the installed app the same app if start_url ever changes.
    id: "/",
    name: "Tritorc",
    short_name: "Tritorc",
    description:
      "Turnkey industrial bolting, on-site machining & pipeline integrity solutions.",
    lang: "en",
    start_url: "/",
    scope: "/",
    display: "standalone",
    // "any": tablets are used in landscape too, so the installed app must be allowed to rotate.
    orientation: "any",
    categories: ["business", "productivity"],
    // Same colours as the app itself (see viewport.themeColor in layout.tsx), so the splash
    // screen and the status bar match the first screen instead of flashing grey or black.
    background_color: "#f3f3f2",
    theme_color: "#f3f3f2",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
