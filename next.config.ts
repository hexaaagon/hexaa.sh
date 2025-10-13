import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
    // lightning css doesn't support postcss yet.
    // useLightningcss: true,
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
      {
        source: "/guestbook",
        destination: "/error-pages/page-unavailable",
      },
    ];
  },
  allowedDevOrigins: ["192.168.1.*"],
};

export default nextConfig;
