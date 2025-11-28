import type { NextConfig } from "next";
import createBundleAnalyzer from "@next/bundle-analyzer";
import { createMDX } from "fumadocs-mdx/next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["typescript", "@takumi-rs/image-response"],
  experimental: {
    optimizePackageImports: [
      "@icons-pack/react-simple-icons",
      "@paper-design/shaders-react",
    ],
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
    ];
  },
  allowedDevOrigins: ["192.168.1.*"],
  reactCompiler: true,
};

const withMDX = createMDX();
const withAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withAnalyzer(withMDX(nextConfig));
