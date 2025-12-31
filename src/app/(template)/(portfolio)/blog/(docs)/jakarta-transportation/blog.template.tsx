import { blog } from "@/lib/source";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { ShareButton } from "../(template)/[slug]/page.client";
import path from "node:path";
import { InlineTOC } from "@/components/markdown/inline-toc";
import { getMDXComponents } from "@/components/markdown/mdx-components";
import type { MDXComponents } from "mdx/types";

export type JakartaTransportBlogTemplateProps = Omit<
  ComponentProps<"article">,
  "children"
> & {
  currentLine: string;
  components: MDXComponents;
};

export async function JakartaTransportBlogTemplate({
  currentLine,
  components,
  className,
  ...props
}: JakartaTransportBlogTemplateProps) {
  const page = blog.getPage(
    currentLine
      ? ["jakarta-transportation", currentLine]
      : ["jakarta-transportation"],
  );

  // just type checking, should not be possible to reach here
  if (!page) {
    return null;
  }

  const { body, toc } = await page.data.load();

  return (
    <article
      className={cn("prose prose-neutral dark:prose-invert", className)}
      {...props}
    >
      <section className="prose dark:prose-invert flex items-center justify-between">
        <div className="not-prose mt-2 mb-5 flex flex-row gap-4 text-sm">
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
        <div className="not-prose mt-2 mb-5 flex flex-row gap-2">
          <ShareButton
            url={`/blog/jakarta-transportation?line=${page.url.split("/").pop()}`}
          />
        </div>
      </section>
      <h1 className="mb-4 font-semibold text-3xl">{page.data.title}</h1>
      <InlineTOC items={toc} className="mt-2 mb-4" />
      {body({ components: getMDXComponents(components) })}
    </article>
  );
}
