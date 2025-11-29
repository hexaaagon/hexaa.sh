// source.config.ts
import {
  defineCollections,
  defineConfig,
  frontmatterSchema
} from "fumadocs-mdx/config";
import { z } from "zod";
var blog = defineCollections({
  type: "doc",
  dir: "src/content/blog",
  schema: frontmatterSchema.extend({
    author: z.string(),
    date: z.iso.date().or(z.date()),
    image: z.string().optional(),
    hashtags: z.array(z.string().startsWith("#")).optional()
  }),
  async: true
});
var source_config_default = defineConfig();
export {
  blog,
  source_config_default as default
};
