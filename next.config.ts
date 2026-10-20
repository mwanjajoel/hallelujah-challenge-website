import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every route here prerenders static and nothing uses a route handler, a
  // server action or a dynamic API, so the site exports to plain files and is
  // served from Cloudflare's edge with no server to run.
  output: "export",
  images: {
    // No next/image yet, but the export target has no optimiser, so this is
    // the setting that would keep working if one were added.
    unoptimized: true,
    // Most imagery is a CSS background, but these hosts also back <img> tags
    // and are listed so a later move to next/image is a one-line change.
    remotePatterns: [
      { protocol: "https", hostname: "static.wixstatic.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
