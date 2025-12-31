import { Suspense } from "react";
import { JakartaTransportMapClient } from "./page.client";
import { JakartaTransportBlogTemplate } from "./blog.template";

// MDX content imports
import IndexContent from "@/content/blog/jakarta-transportation/index.mdx";
import KrlRangkasbitung from "@/content/blog/jakarta-transportation/krl-rangkasbitung.mdx";
import KrlCikarangLoop from "@/content/blog/jakarta-transportation/krl-cikarang-loop.mdx";
import KrlBogor from "@/content/blog/jakarta-transportation/krl-bogor.mdx";
import KrlTangerang from "@/content/blog/jakarta-transportation/krl-tangerang.mdx";
import KrlTanjungPriok from "@/content/blog/jakarta-transportation/krl-tanjung-priok.mdx";
import MrtNorthSouth1 from "@/content/blog/jakarta-transportation/mrt-north-south-1.mdx";
import MrtNorthSouth2a from "@/content/blog/jakarta-transportation/mrt-north-south-2a.mdx";
import MrtNorthSouth2b from "@/content/blog/jakarta-transportation/mrt-north-south-2b.mdx";
import MrtEastWest3 from "@/content/blog/jakarta-transportation/mrt-east-west-3.mdx";

const mdxComponents: Record<string, React.ComponentType> = {
  "": IndexContent,
  "krl-rangkasbitung": KrlRangkasbitung,
  "krl-cikarang-loop": KrlCikarangLoop,
  "krl-bogor": KrlBogor,
  "krl-tangerang": KrlTangerang,
  "krl-tanjung-priok": KrlTanjungPriok,
  "mrt-north-south-1": MrtNorthSouth1,
  "mrt-north-south-2a": MrtNorthSouth2a,
  "mrt-north-south-2b": MrtNorthSouth2b,
  "mrt-east-west-3": MrtEastWest3,
};

// Pre-render all content with templates
const contentMap: Record<string, React.ReactNode> = Object.entries(
  mdxComponents,
).reduce(
  (acc, [key, components]) => {
    acc[key] = (
      <JakartaTransportBlogTemplate
        className="prose-sm mx-auto max-w-3xl pb-8"
        currentLine={key}
        components={{ default: components }}
      />
    );
    return acc;
  },
  {} as Record<string, React.ReactNode>,
);

export default function JakartaTransportMapPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <JakartaTransportMapClient contentMap={contentMap} />
    </Suspense>
  );
}
