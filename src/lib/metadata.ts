import type { Metadata } from "next/types";
import type { BlogPage } from "./source";

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: "https://fumadocs.dev",
      images: "/banner.png",
      siteName: "Fumadocs",
      ...override.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      creator: "@fuma_nama",
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      images: "/banner.png",
      ...override.twitter,
    },
    alternates: {
      types: {
        "application/rss+xml": [
          {
            title: "Fumadocs Blog",
            url: "https://fumadocs.dev/blog/rss.xml",
          },
        ],
      },
      ...override.alternates,
    },
  };
}

export function getBlogPageImage(page: BlogPage) {
  const segments = [...page.slugs, "image.webp"];

  return {
    segments,
    url: `/og/blog/${segments.join("/")}`,
  };
}
