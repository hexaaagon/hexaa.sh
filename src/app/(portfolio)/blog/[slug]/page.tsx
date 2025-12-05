import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InlineTOC } from "@/components/inline-toc";
import { blog } from "@/lib/source";
import { createMetadata, getBlogPageImage } from "@/lib/metadata";
import { ShareButton } from "./page.client";
import { getMDXComponents } from "@/components/mdx-components";
import path from "node:path";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default async function Page(props: PageProps<"/blog/[slug]">) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();
  const { body: Mdx, toc } = await page.data.load();

  const image = {
    url: page.data.image || getBlogPageImage(page).url,
    invertable: !page.data.image,
    width: 1200,
    height: 630,
  };

  return (
    <article className="mx-auto flex w-full max-w-[800px] flex-col px-4 py-16">
      <h1 className="mb-4 font-semibold text-3xl">{page.data.title}</h1>
      <section className="prose dark:prose-invert flex items-center justify-between">
        <div className="not-prose mb-8 flex flex-row gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Written by</p>
            <p className="text-muted-foreground text-sm">At</p>
          </div>
          <div>
            <p className="font-medium">{page.data.author}</p>
            <p className="font-medium">
              {new Date(
                page.data.date ??
                  path.basename(page.path, path.extname(page.path)),
              ).toDateString()}
            </p>
          </div>
        </div>
        <div className="not-prose mb-8 flex flex-row gap-2">
          <ShareButton url={page.url} />
        </div>
      </section>
      <Image
        src={image.url}
        alt="Blog Post Image"
        width={image.width}
        height={image.height}
        className={cn(
          "prose mb-2 rounded-md",
          image.invertable && "invert-100 dark:invert-0",
        )}
      />
      <div className="prose dark:prose-invert min-w-0 flex-1">
        {page.data.flags?.includes("personal-opinion") && (
          <p className="mt-8 rounded-md border-yellow-500 border-l-4 bg-yellow-300/50 p-4 text-sm">
            ⚠️ <strong>Personal Opinion:</strong> The views expressed in this
            blog post are solely my own and do not represent the opinions of any
            organization or entity I may be affiliated with. And remember, you
            can always disagree with me!
          </p>
        )}
        <InlineTOC items={toc} className="mt-2 mb-4" />
        <Mdx components={getMDXComponents()} />
      </div>
    </article>
  );
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();

  const image = {
    url: page.data.image || getBlogPageImage(page).url,
    width: 1200,
    height: 630,
  };

  return createMetadata({
    title: page.data.title,
    description: page.data.description ?? "Another hexaa's blog post.",
    openGraph: {
      url: `/blog/${page.slugs.join("/")}`,
      images: [image],
    },
    twitter: {
      images: [image],
    },
  });
}

export function generateStaticParams(): { slug: string }[] {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}
