// @ts-nocheck
import { frontmatter as __fd_glob_0 } from "../src/content/blog/dont-use-shadcn.mdx?collection=blog&only=frontmatter"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const blog = await create.docLazy("blog", "src/content/blog", {"dont-use-shadcn.mdx": __fd_glob_0, }, {"dont-use-shadcn.mdx": () => import("../src/content/blog/dont-use-shadcn.mdx?collection=blog"), });