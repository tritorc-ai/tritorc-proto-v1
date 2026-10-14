import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets other devices on the local network (e.g. a phone) use the dev server's
  // overlay and HMR resources. Dev-only; has no effect on production builds.
  allowedDevOrigins: ["192.168.1.68"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "tritorc-strapi-media-prod-140732842400-ap-south-1.s3.ap-south-1.amazonaws.com" },
      { protocol: "https", hostname: "cms.tritorc.com" },
      { protocol: "https", hostname: "www.tritorc.com" },
      { protocol: "https", hostname: "tritorc.com" },
    ],
  },
};

export default nextConfig;
