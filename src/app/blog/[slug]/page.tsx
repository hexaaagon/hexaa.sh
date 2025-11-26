import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InlineTOC } from "fumadocs-ui/components/inline-toc";
import { blog } from "@/lib/source";
import { createMetadata } from "@/lib/metadata";
import { ShareButton } from "./page.client";
import { getMDXComponents } from "@/components/mdx-components";
import path from "node:path";

export default async function Page(props: PageProps<"/blog/[slug]">) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();
  const { body: Mdx, toc } = await page.data.load();

  return (
    <article className="mx-auto flex w-full max-w-[800px] flex-col px-4 py-8">
      <section className="prose flex items-center justify-between">
        <div className="not-prose mb-8 flex flex-row gap-4 text-sm">
          <div>
            <p className="text-fd-muted-foreground">Written by</p>
            <p className="text-fd-muted-foreground text-sm">At</p>
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
      <h1 className="mb-4 font-semibold text-3xl">{page.data.title}</h1>
      <p className="mb-8 text-fd-muted-foreground">{page.data.description}</p>
      <div className="prose min-w-0 flex-1">
        <InlineTOC items={toc} />
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

  return createMetadata({
    title: page.data.title,
    description:
      page.data.description ?? "The library for building documentation sites",
  });
}

export function generateStaticParams(): { slug: string }[] {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}
