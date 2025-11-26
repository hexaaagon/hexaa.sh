import { Feed } from "feed";
import { blog } from "@/lib/source";
import { NextResponse } from "next/server";

export const revalidate = false;

const baseUrl = "https://hexaa.sh";

export function GET() {
  const feed = new Feed({
    title: "Hexaa's Blog",
    id: `${baseUrl}/blog`,
    link: `${baseUrl}/blog`,
    language: "en",

    image: `${baseUrl}/banner.png`,
    favicon: `${baseUrl}/icon.png`,
    copyright: "© 2025, Hexaa. Licensed under CC BY-NC 4.0",
  });

  for (const page of blog.getPages().sort((a, b) => {
    return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  })) {
    feed.addItem({
      id: page.url,
      title: page.data.title,
      description: page.data.description,
      link: `${baseUrl}${page.url}`,
      date: new Date(page.data.date),

      author: [
        {
          name: page.data.author,
        },
      ],
    });
  }

  return new NextResponse(feed.rss2());
}
