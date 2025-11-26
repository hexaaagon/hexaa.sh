import { PathUtils } from "fumadocs-core/source";
import { blog } from "@/lib/source";

import { PlusSeparator } from "@/components/ui/plus-separator";
import { GrainGradient } from "@paper-design/shaders-react";
import Link from "next/link";

export default function BlogPage() {
  const posts = [...blog.getPages()].sort(
    (a, b) =>
      new Date(b.data.date ?? getName(b.path)).getTime() -
      new Date(a.data.date ?? getName(a.path)).getTime(),
  );

  return (
    <main className="mt-16">
      <section className="w-full border-separator/10 border-t">
        <div className="inner relative flex border-separator/10 border-x">
          <PlusSeparator
            position={["top-left", "top-right", "bottom-left", "bottom-right"]}
            main={{ className: "z-20" }}
          />
          <GrainGradient
            height={250}
            colors={["#c6750c", "#beae60", "#d7cbc6"]}
            colorBack="#ffffff00"
            softness={0.7}
            intensity={0.15}
            noise={0.5}
            shape="wave"
            speed={0.7}
            scale={2.5}
            offsetX={1}
            offsetY={0.6}
            className="w-full bg-background/20"
          />
          <div className="absolute top-0 right-0 bottom-0 left-0 z-10 h-full w-full text-white mix-blend-difference">
            <div className="mt-12 ml-10 flex h-full flex-col">
              <h2 className="text-4xl">hexaa's blog.</h2>
              <p>here goes another yap and yap</p>
            </div>
          </div>
        </div>
      </section>
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
