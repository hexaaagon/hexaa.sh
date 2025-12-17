import type { Metadata } from "next/types";
import type { BlogPage, LabsPage } from "./source";

export function createMetadataBlog(override: Metadata): Metadata {
  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: "https://hexaa.sh",
      images: "/banner.png",
      siteName: "hexaa's blog.",
      ...override.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      creator: "@Scoooolzs",
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      images: "/banner.png",
      ...override.twitter,
    },
    alternates: {
      types: {
        "application/rss+xml": [
          {
            title: "Hexaa's Blog",
            url: "https://hexaa.sh/blog/rss.xml",
          },
        ],
      },
      ...override.alternates,
    },
  };
}

export function createMetadataLabs(override: Metadata): Metadata {
  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: "https://hexaa.sh/labs",
      siteName: "hexaa's labs.",
      ...override.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      creator: "@Scoooolzs",
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      ...override.twitter,
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

export function getLabPageImage(page: LabsPage) {
  const segments = [...page.slugs, "image.webp"];
  return {
    segments,
    url: `/og/labs/${segments.join("/")}`,
  };
}
