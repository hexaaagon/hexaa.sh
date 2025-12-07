import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { type InferPageType, loader } from "fumadocs-core/source";
import {
  blog as blogPosts,
  labs as labsCollections,
} from "fumadocs-mdx:collections/server";

export const blog = loader(toFumadocsSource(blogPosts, []), {
  baseUrl: "/blog",
});

export const labs = loader({
  baseUrl: "/labs",
  source: labsCollections.toFumadocsSource(),
});

export type BlogPage = InferPageType<typeof blog>;
export type LabsPage = InferPageType<typeof labs>;
