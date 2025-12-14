import type { NextConfig } from "next";
import createBundleAnalyzer from "@next/bundle-analyzer";
import { createMDX } from "fumadocs-mdx/next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "typescript",
    "@takumi-rs/image-response",
    "shiki",
    "twoslash",
    "vscode-oniguruma",
  ],
  experimental: {
    optimizePackageImports: [
      "@icons-pack/react-simple-icons",
      "@paper-design/shaders-react",
    ],
  },
  images: {
    remotePatterns: [
      // Remote patterns intentionally minimal - external images (Spotify, Discord, Last.fm, etc.)
      // use regular <img> tags to avoid Vercel image optimization costs
    ],
    minimumCacheTTL: 60 * 60 * 24 * 28, // 28 days
    formats: ["image/avif", "image/webp"], // Use modern formats for better compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Default device sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Default image sizes
  },
  allowedDevOrigins: ["192.168.1.*"],
  reactCompiler: true,
};

const withMDX = createMDX();
const withAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withAnalyzer(withMDX(nextConfig));
