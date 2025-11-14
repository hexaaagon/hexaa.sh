import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/u/**",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        pathname: "/avatars/**",
      },
      {
        protocol: "https",
        hostname: "**", // Allow all HTTPS images for Dub link previews
      },
    ],
  },
  rewrites: async () => {
    return [
      {
        source: "/about",
        destination: "/error-pages/page-unavailable",
      },
      {
        source: "/projects",
        destination: "/error-pages/page-unavailable",
      },
      {
        source: "/blog",
        destination: "/error-pages/page-unavailable",
      },
    ];
  },
  allowedDevOrigins: ["192.168.1.*"],
};

export default nextConfig;
