import {
  krlTransportation,
  mrtTransportation,
} from "@/constants/blog/jakarta-transport";

export type LineInfo = {
  id: string;
  name: string;
  color: string;
  slug: string;
  type: "krl" | "mrt";
};

export function getAllLines(): LineInfo[] {
  const krlLines = krlTransportation.lines.map((line) => ({
    id: line.id,
    name: line.name,
    color: line.code.color,
    slug: line.id,
    type: "krl" as const,
  }));

  const mrtLines = mrtTransportation.lines.map((line) => ({
    id: line.id,
    name: line.name,
    color: line.code.color,
    slug: line.id,
    type: "mrt" as const,
  }));

  return [...krlLines, ...mrtLines];
}

export function getLineBySlug(slug: string | null): LineInfo | null {
  if (!slug) return null;
  return getAllLines().find((line) => line.slug === slug) || null;
}

export function getLineIndex(slug: string | null): number {
  if (!slug) return -1;
  return getAllLines().findIndex((line) => line.slug === slug);
}

export function getNextLine(currentSlug: string | null): LineInfo | null {
  const lines = getAllLines();
  const currentIndex = getLineIndex(currentSlug);

  if (currentIndex === -1) return lines[0] || null;
  if (currentIndex === lines.length - 1) return null;

  return lines[currentIndex + 1] || null;
}

export function getPreviousLine(currentSlug: string | null): LineInfo | null {
  const lines = getAllLines();
  const currentIndex = getLineIndex(currentSlug);

  if (currentIndex === -1) return null;
  if (currentIndex === 0) return null;

  return lines[currentIndex - 1] || null;
}
