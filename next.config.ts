import type { NextConfig } from "next";

// Images uploaded in our Strapi are served from its own address (STRAPI_API_URL)
// or from the S3 bucket / CDN behind it. Allow that host so next/image can show them.
// When Strapi runs on this machine (localhost) the image optimizer must also be told
// local addresses are fine; that only happens when STRAPI_API_URL itself points at localhost.
const strapiUrl = process.env.STRAPI_API_URL ? new URL(process.env.STRAPI_API_URL) : null;
const strapiIsLocal = !!strapiUrl && ["localhost", "127.0.0.1"].includes(strapiUrl.hostname);

const nextConfig: NextConfig = {
  // Lets other devices on the local network (e.g. a phone) and Cloudflare quick
  // tunnels use the dev server's overlay and HMR resources. Dev-only; has no
  // effect on production builds.
  allowedDevOrigins: ["192.168.1.*", "*.trycloudflare.com"],
  images: {
    ...(strapiIsLocal && { dangerouslyAllowLocalIP: true }),
    remotePatterns: [
      { protocol: "https", hostname: "tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com" },
      { protocol: "https", hostname: "cms.tritorc.com" },
      { protocol: "https", hostname: "www.tritorc.com" },
      { protocol: "https", hostname: "tritorc.com" },
      ...(strapiUrl
        ? [
            {
              protocol: strapiUrl.protocol.replace(":", "") as "http" | "https",
              hostname: strapiUrl.hostname,
              ...(strapiUrl.port && { port: strapiUrl.port }),
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
