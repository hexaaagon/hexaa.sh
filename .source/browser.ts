// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  blog: create.doc("blog", {"dont-use-shadcn.mdx": () => import("../src/content/blog/dont-use-shadcn.mdx?collection=blog"), }),
};
export default browserCollections;