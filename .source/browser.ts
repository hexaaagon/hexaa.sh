// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  blog: create.doc("blog", {"dont-use-shadcn.mdx": () => import("../src/content/blog/dont-use-shadcn.mdx?collection=blog"), }),
  labs: create.doc("labs", {"components/button.mdx": () => import("../src/content/labs/components/button.mdx?collection=labs"), "components/card-overlap-scroll.mdx": () => import("../src/content/labs/components/card-overlap-scroll.mdx?collection=labs"), "components/card-stack-scroll.mdx": () => import("../src/content/labs/components/card-stack-scroll.mdx?collection=labs"), "components/parallax-scroll.mdx": () => import("../src/content/labs/components/parallax-scroll.mdx?collection=labs"), "components/rotate-velocity-scroll.mdx": () => import("../src/content/labs/components/rotate-velocity-scroll.mdx?collection=labs"), "components/smooth-cursor.mdx": () => import("../src/content/labs/components/smooth-cursor.mdx?collection=labs"), "components/trailing-scroll.mdx": () => import("../src/content/labs/components/trailing-scroll.mdx?collection=labs"), "(root)/changelog.mdx": () => import("../src/content/labs/(root)/changelog.mdx?collection=labs"), "(root)/components.mdx": () => import("../src/content/labs/(root)/components.mdx?collection=labs"), "(root)/get-started.mdx": () => import("../src/content/labs/(root)/get-started.mdx?collection=labs"), }),
};
export default browserCollections;