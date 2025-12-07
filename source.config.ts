import {
  defineCollections,
  defineConfig,
  defineDocs,
  frontmatterSchema,
} from "fumadocs-mdx/config";
import { z } from "zod";

export const blog = defineCollections({
  type: "doc",
  dir: "src/content/blog",
  schema: frontmatterSchema.extend({
    author: z.string(),
    date: z.iso.date().or(z.date()),
    image: z.string().optional(),
    hashtags: z.array(z.string().startsWith("#")).optional(),
    flags: z.array(z.string()).optional(),
  }),
  async: true,
});

export const labs = defineDocs({
  dir: "src/content/labs",
  docs: {
    schema: frontmatterSchema,
    async: true,
  },
});

export default defineConfig();
