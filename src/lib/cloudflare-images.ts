import type { ImageLoaderProps } from "next/image";

const normalizeSrc = (src: string) => {
  return src.startsWith("/") ? src.slice(1) : src;
};

export function cloudflareLoader({ src, width, quality }: ImageLoaderProps) {
  const params = [`width=${width}`];
  if (quality) {
    params.push(`quality=${quality}`);
  }
  return `https://files.hexaa.sh/cdn-cgi/image/${params.join(",")}/${normalizeSrc(src)}`;
}
