import { blog } from "@/lib/source";
import { notFound } from "next/navigation";
import { generate as MetadataImage, getImageResponseOptions } from "./generate";
import { ImageResponse } from "@takumi-rs/image-response";
import { getBlogPageImage } from "@/lib/metadata";

export const revalidate = false;
export const dynamic = "force-static";

export async function GET(
  _req: Request,
  { params }: RouteContext<"/og/blog/[...slug]">,
) {
  const { slug } = await params;
  const page = blog.getPage(slug.slice(0, -1));

  if (!page) notFound();

  return new ImageResponse(
    await MetadataImage({
      path: `/blog/${slug.slice(0, -1).join("/")}`,
      title: page.data.title,
      description: page.data.description,
    }),
    await getImageResponseOptions(),
  );
}

export function generateStaticParams(): {
  slug: string[];
}[] {
  return blog.getPages().map((page) => ({
    slug: getBlogPageImage(page).segments,
  }));
}
