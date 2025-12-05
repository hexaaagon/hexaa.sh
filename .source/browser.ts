// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  blog: create.doc("blog", {"dont-use-shadcn.mdx": () => import("../src/content/blog/dont-use-shadcn.mdx?collection=blog"), }),
  labs: create.doc("labs", {"(root)/changelog.mdx": () => import("../src/content/labs/(root)/changelog.mdx?collection=labs"), "(root)/components.mdx": () => import("../src/content/labs/(root)/components.mdx?collection=labs"), "(root)/get-started.mdx": () => import("../src/content/labs/(root)/get-started.mdx?collection=labs"), "components/accordion.mdx": () => import("../src/content/labs/components/accordion.mdx?collection=labs"), "components/card.mdx": () => import("../src/content/labs/components/card.mdx?collection=labs"), }),
};
export default browserCollections;