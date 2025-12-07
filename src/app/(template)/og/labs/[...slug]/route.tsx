import { labs } from "@/lib/source";
import { notFound } from "next/navigation";
import { generate as MetadataImage, getImageResponseOptions } from "./generate";
import { ImageResponse } from "@takumi-rs/image-response";
import { getLabPageImage } from "@/lib/metadata";

export const revalidate = false;
export const dynamic = "force-static";

export async function GET(
  _req: Request,
  { params }: RouteContext<"/og/labs/[...slug]">,
) {
  const { slug } = await params;
  const page = labs.getPage(slug.slice(0, -1));

  if (!page) notFound();

  return new ImageResponse(
    await MetadataImage({
      path: `/labs/${slug.slice(0, -1).join("/")}`,
      title: page.data.title,
      description: page.data.description,
    }),
    await getImageResponseOptions(),
  );
}

export function generateStaticParams(): {
  slug: string[];
}[] {
  return labs.getPages().map((page) => ({
    slug: getLabPageImage(page).segments,
  }));
}
