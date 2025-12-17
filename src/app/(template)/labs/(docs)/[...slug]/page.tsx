import { labs, labs as source } from "@/lib/source";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/components/markdown/mdx-components";
import type { Metadata } from "next";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { createMetadataLabs, getLabPageImage } from "@/lib/metadata";
import { cn } from "@/lib/utils";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const { body: MDX, toc } = await page.data.load();

  return (
    <DocsPage
      toc={toc}
      full={page.data.full}
      breadcrumb={{ enabled: false }}
      tableOfContent={{
        style: "clerk",
      }}
      tableOfContentPopover={{
        style: "clerk",
      }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody className="max-w-none">
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: ({ className, ...props }) =>
              createRelativeLink(
                source,
                page,
              )({
                ...props,
                className: cn(
                  "underline transition hover:text-muted-foreground",
                  className,
                ),
              }),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<"/labs/[...slug]">,
): Promise<Metadata> {
  const params = await props.params;
  const page = labs.getPage(params.slug);

  if (!page) notFound();

  const image = {
    url: getLabPageImage(page).url,
    width: 1200,
    height: 630,
  };

  return createMetadataLabs({
    title: page.data.title,
    description: page.data.description ?? "Another hexaa's lab component.",
    openGraph: {
      url: `/labs/${page.slugs.join("/")}`,
      images: [image],
    },
    twitter: {
      images: [image],
    },
  });
}
