import type { ImageLoaderProps } from "next/image";

const normalizeSrc = (src: string) => {
  const first = src.startsWith("/") ? src.slice(1) : src;
  const second = first.endsWith("/") ? first.slice(0, -1) : first;
  return second;
};

export function cloudflareLoader({ src, width, quality }: ImageLoaderProps) {
  const normalizedSrc = normalizeSrc(src);
  const unoptimized = normalizedSrc.endsWith(".unoptimized");
  const params = [`width=${width}`];
  if (quality) {
    params.push(`quality=${quality}`);
  }
  return `https://files.hexaa.sh/${unoptimized ? "" : `cdn-cgi/image/${params.join(",")}/`}${normalizeSrc(src).replaceAll(".unoptimized", "")}`;
}
