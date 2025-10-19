import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
    // lightning css doesn't support postcss yet.
    // useLightningcss: true,
  },
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
