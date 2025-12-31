"use client";
import { cloudflareLoader } from "@/lib/cloudflare-images";
import { cn } from "@/lib/utils";
import Image, { type ImageProps } from "next/image";

export type categories = "assets" | "blog" | "projects";

export function CloudflareImage({
  src,
  category,
  className,
  ...props
}: ImageProps & { category: categories }) {
  return (
    <Image
      loader={cloudflareLoader}
      src={`/portfolio/v1/${category}${src}`}
      className={cn("aspect-video object-cover", className)}
      {...props}
    />
  );
}

export function BlogImage(
  props: Omit<
    React.ComponentProps<typeof CloudflareImage>,
    "category" | "className" | "fill"
  >,
) {
  return (
    <div className="flex flex-col items-center justify-center space-y-0 text-center">
      <CloudflareImage
        category="blog"
        className="not-prose mb-2 rounded-2xl"
        {...props}
      />
      <p className="text-fd-muted-foreground text-xs">{props.alt}</p>
    </div>
  );
}
