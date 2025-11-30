import type { MetadataRoute } from "next";

const baseUrl = (path: string) =>
  `${process.env.BETTER_AUTH_URL || "https://hexaa.sh"}${path}`;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl("/"),
      lastModified: new Date("2025-11-25"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: baseUrl("/about"),
      lastModified: new Date("2025-11-30"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: baseUrl("/projects"),
      lastModified: new Date("2025-11-30"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: baseUrl("/blog"),
      lastModified: new Date("2025-11-30"),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: baseUrl("/guestbook"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.3,
    },
    {
      url: baseUrl("/attribute"),
      lastModified: new Date("2025-11-30"),
      changeFrequency: "yearly",
      priority: 0.1,
    },
  ];
}
