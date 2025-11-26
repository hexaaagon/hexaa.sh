import { PathUtils } from "fumadocs-core/source";
import { blog } from "@/lib/source";

import { PlusSeparator } from "@/components/ui/plus-separator";
import Link from "next/link";
import { HeaderBanner } from "./banner.client";

export default function BlogPage() {
  const posts = [...blog.getPages()].sort(
    (a, b) =>
      new Date(b.data.date ?? getName(b.path)).getTime() -
      new Date(a.data.date ?? getName(a.path)).getTime(),
  );

  return (
    <main className="mt-16">
      <HeaderBanner />
      <section className="w-full border-separator/10 border-y">
        <div className="inner relative grid grid-cols-1 gap-2 border-separator/10 border-x px-2 py-16 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.url}
              href={post.url}
              className="group relative flex flex-col gap-2 overflow-hidden rounded-xs border border-separator/10 bg-background p-6 transition-all hover:border-foreground/20"
            >
              <p className="font-medium">{post.data.title}</p>
              <p className="text-fd-muted-foreground text-sm">
                {post.data.description}
              </p>

              <p className="mt-auto pt-4 text-brand text-xs">
                {new Date(post.data.date ?? getName(post.path)).toDateString()}
              </p>
            </Link>
          ))}
          {posts.map((post) => (
            <Link
              key={post.url}
              href={post.url}
              className="group relative flex flex-col gap-2 overflow-hidden rounded-xs border border-separator/10 bg-background p-6 transition-all hover:border-foreground/20"
            >
              <p className="font-medium">{post.data.title}</p>
              <p className="text-fd-muted-foreground text-sm">
                {post.data.description}
              </p>

              <p className="mt-auto pt-4 text-brand text-xs">
                {new Date(post.data.date ?? getName(post.path)).toDateString()}
              </p>
            </Link>
          ))}
          {posts.map((post) => (
            <Link
              key={post.url}
              href={post.url}
              className="group relative flex flex-col gap-2 overflow-hidden rounded-xs border border-separator/10 bg-background p-6 transition-all hover:border-foreground/20"
            >
              <p className="font-medium">{post.data.title}</p>
              <p className="text-fd-muted-foreground text-sm">
                {post.data.description}
              </p>

              <p className="mt-auto pt-4 text-brand text-xs">
                {new Date(post.data.date ?? getName(post.path)).toDateString()}
              </p>
            </Link>
          ))}
          {posts.map((post) => (
            <Link
              key={post.url}
              href={post.url}
              className="group relative flex flex-col gap-2 overflow-hidden rounded-xs border border-separator/10 bg-background p-6 transition-all hover:border-foreground/20"
            >
              <p className="font-medium">{post.data.title}</p>
              <p className="text-fd-muted-foreground text-sm">
                {post.data.description}
              </p>

              <p className="mt-auto pt-4 text-brand text-xs">
                {new Date(post.data.date ?? getName(post.path)).toDateString()}
              </p>
            </Link>
          ))}
          {posts.map((post) => (
            <Link
              key={post.url}
              href={post.url}
              className="group relative flex flex-col gap-2 overflow-hidden rounded-xs border border-separator/10 bg-background p-6 transition-all hover:border-foreground/20"
            >
              <p className="font-medium">{post.data.title}</p>
              <p className="text-fd-muted-foreground text-sm">
                {post.data.description}
              </p>

              <p className="mt-auto pt-4 text-brand text-xs">
                {new Date(post.data.date ?? getName(post.path)).toDateString()}
              </p>
            </Link>
          ))}
          {posts.map((post) => (
            <Link
              key={post.url}
              href={post.url}
              className="group relative flex flex-col gap-2 overflow-hidden rounded-xs border border-separator/10 bg-background p-6 transition-all hover:border-foreground/20"
            >
              <p className="font-medium">{post.data.title}</p>
              <p className="text-fd-muted-foreground text-sm">
                {post.data.description}
              </p>

              <p className="mt-auto pt-4 text-brand text-xs">
                {new Date(post.data.date ?? getName(post.path)).toDateString()}
              </p>
            </Link>
          ))}
          <PlusSeparator
            position={["bottom-left", "bottom-right"]}
            main={{ className: "z-20" }}
          />
        </div>
      </section>
    </main>
  );
}

function getName(path: string) {
  return PathUtils.basename(path, PathUtils.extname(path));
}
