import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/app/BottomNav";
import { Splash } from "@/components/app/Splash";
import { SPLASH_GUARD_SCRIPT } from "@/components/app/splashGuard";
import { ServiceWorkerRegister } from "@/components/app/ServiceWorkerRegister";
import { InboxProvider } from "@/components/app/InboxProvider";

// Resolves relative URLs in metadata (OG images, canonical links) against the
// real deployment origin. Vercel sets VERCEL_PROJECT_PRODUCTION_URL/VERCEL_URL
// automatically per-environment; NEXT_PUBLIC_SITE_URL overrides both once a
// custom domain is attached.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Tritorc",
  description:
    "Turnkey industrial bolting, on-site machining & pipeline integrity solutions.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Tritorc",
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#f3f3f2",
  width: "device-width",
  initialScale: 1,
  // Lets content draw under the notch/status bar on iOS so env(safe-area-
  // inset-*) reports the device's real inset instead of always being 0 —
  // without this, "black-translucent" status bar + a hardcoded top padding
  // (see pt-safe-header in globals.css) either double up on notched devices
  // or leave a padding-shaped gap with nothing to clear on everything else.
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full bg-(--app-bg) font-sans text-foreground">
        <script dangerouslySetInnerHTML={{ __html: SPLASH_GUARD_SCRIPT }} />
        <Splash />
        <InboxProvider>
          <div className="mx-auto min-h-dvh max-w-md bg-(--app-bg) pb-nav sm:shadow-[0_0_60px_rgba(0,0,0,0.08)]">
            {children}
          </div>
          <BottomNav />
        </InboxProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
