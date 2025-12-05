// @ts-nocheck
import { frontmatter as __fd_glob_10 } from "../src/content/labs/components/trailing-scroll.mdx?collection=labs&only=frontmatter"
import { frontmatter as __fd_glob_9 } from "../src/content/labs/components/smooth-cursor.mdx?collection=labs&only=frontmatter"
import { frontmatter as __fd_glob_8 } from "../src/content/labs/components/rotate-velocity-scroll.mdx?collection=labs&only=frontmatter"
import { frontmatter as __fd_glob_7 } from "../src/content/labs/components/parallax-scroll.mdx?collection=labs&only=frontmatter"
import { frontmatter as __fd_glob_6 } from "../src/content/labs/components/card-stack-scroll.mdx?collection=labs&only=frontmatter"
import { frontmatter as __fd_glob_5 } from "../src/content/labs/components/card-overlap-scroll.mdx?collection=labs&only=frontmatter"
import { frontmatter as __fd_glob_4 } from "../src/content/labs/components/button.mdx?collection=labs&only=frontmatter"
import { frontmatter as __fd_glob_3 } from "../src/content/labs/(root)/get-started.mdx?collection=labs&only=frontmatter"
import { frontmatter as __fd_glob_2 } from "../src/content/labs/(root)/components.mdx?collection=labs&only=frontmatter"
import { frontmatter as __fd_glob_1 } from "../src/content/labs/(root)/changelog.mdx?collection=labs&only=frontmatter"
import { frontmatter as __fd_glob_0 } from "../src/content/blog/dont-use-shadcn.mdx?collection=blog&only=frontmatter"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const blog = await create.docLazy("blog", "src/content/blog", {"dont-use-shadcn.mdx": __fd_glob_0, }, {"dont-use-shadcn.mdx": () => import("../src/content/blog/dont-use-shadcn.mdx?collection=blog"), });

export const labs = await create.docsLazy("labs", "src/content/labs", {}, {"(root)/changelog.mdx": __fd_glob_1, "(root)/components.mdx": __fd_glob_2, "(root)/get-started.mdx": __fd_glob_3, "components/button.mdx": __fd_glob_4, "components/card-overlap-scroll.mdx": __fd_glob_5, "components/card-stack-scroll.mdx": __fd_glob_6, "components/parallax-scroll.mdx": __fd_glob_7, "components/rotate-velocity-scroll.mdx": __fd_glob_8, "components/smooth-cursor.mdx": __fd_glob_9, "components/trailing-scroll.mdx": __fd_glob_10, }, {"(root)/changelog.mdx": () => import("../src/content/labs/(root)/changelog.mdx?collection=labs"), "(root)/components.mdx": () => import("../src/content/labs/(root)/components.mdx?collection=labs"), "(root)/get-started.mdx": () => import("../src/content/labs/(root)/get-started.mdx?collection=labs"), "components/button.mdx": () => import("../src/content/labs/components/button.mdx?collection=labs"), "components/card-overlap-scroll.mdx": () => import("../src/content/labs/components/card-overlap-scroll.mdx?collection=labs"), "components/card-stack-scroll.mdx": () => import("../src/content/labs/components/card-stack-scroll.mdx?collection=labs"), "components/parallax-scroll.mdx": () => import("../src/content/labs/components/parallax-scroll.mdx?collection=labs"), "components/rotate-velocity-scroll.mdx": () => import("../src/content/labs/components/rotate-velocity-scroll.mdx?collection=labs"), "components/smooth-cursor.mdx": () => import("../src/content/labs/components/smooth-cursor.mdx?collection=labs"), "components/trailing-scroll.mdx": () => import("../src/content/labs/components/trailing-scroll.mdx?collection=labs"), });