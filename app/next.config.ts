import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false,
  outputFileTracingIncludes: {
    "/ao-vivo": ["./data/tvgarden-tv.json"],
    "/api/tv/catalog": ["./data/tvgarden-tv.json"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "video.blender.org",
        pathname: "/lazy-static/thumbnails/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "archive.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "commons.wikimedia.org",
        pathname: "/**",
      },
    ],
  },
};
export default config;
