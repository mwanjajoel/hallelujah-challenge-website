import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Most imagery is a CSS background, but these hosts also back <img> tags
    // and are listed so a later move to next/image is a one-line change.
    remotePatterns: [
      { protocol: "https", hostname: "static.wixstatic.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
