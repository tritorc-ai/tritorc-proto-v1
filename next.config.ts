import type { NextConfig } from "next";

// Images uploaded in our Strapi are served from its own address (STRAPI_API_URL)
// or from the S3 bucket / CDN behind it. Allow that host so next/image can show them.
// When Strapi runs on this machine (localhost) the image optimizer must also be told
// local addresses are fine; that only happens when STRAPI_API_URL itself points at localhost.
const strapiUrl = process.env.STRAPI_API_URL ? new URL(process.env.STRAPI_API_URL) : null;
const strapiIsLocal = !!strapiUrl && ["localhost", "127.0.0.1"].includes(strapiUrl.hostname);
// Once Strapi stores uploads on S3 / a CDN (S3_PUBLIC_URL in its .env), set the same address here
// as STRAPI_MEDIA_URL so next/image may load those pictures.
const mediaUrl = process.env.STRAPI_MEDIA_URL ? new URL(process.env.STRAPI_MEDIA_URL) : null;

// The in-app PDF reader (components/app/PdfPages.tsx) has to fetch the whole file to draw its pages, and
// browsers refuse that for a file on another domain unless that domain sends CORS headers. CloudFront / S3
// do not (and answer the browser's pre-check with 403), so the catalogues failed with "could not be shown".
// These files are therefore read through our own domain: /pdf-src/<host>/<path> is passed on to
// https://<host>/<path>. Only the media hosts the app already trusts are allowed (a wildcard here would
// make the site an open proxy). Range requests pass through, so big catalogues still load page by page.
const pdfHosts = [
  "tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com",
  "cms.tritorc.com",
  "www.tritorc.com",
  "tritorc.com",
  ...(strapiUrl && !strapiIsLocal && strapiUrl.protocol === "https:" ? [strapiUrl.host] : []),
  ...(mediaUrl && mediaUrl.protocol === "https:" ? [mediaUrl.host] : []),
].filter((h, i, all) => all.indexOf(h) === i);

const nextConfig: NextConfig = {
  async rewrites() {
    const hosts = pdfHosts.map((h) => h.replace(/\./g, "\\.")).join("|");
    return [{ source: `/pdf-src/:host(${hosts})/:path*`, destination: "https://:host/:path*" }];
  },
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
      ...(mediaUrl
        ? [
            {
              protocol: mediaUrl.protocol.replace(":", "") as "http" | "https",
              hostname: mediaUrl.hostname,
              ...(mediaUrl.port && { port: mediaUrl.port }),
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
