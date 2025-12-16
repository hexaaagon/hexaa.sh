import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";

import { Accordion, Accordions } from "@/components/accordion";
import { CodeBlock } from "@/components/code-block";

import { ComponentPreview } from "./component-preview";
import { ComponentsShowcase } from "./components-showcase";
import { ShadcnInstall } from "./installation-tabs";
import * as ChangelogComponents from "./changelog-showcase";
import * as TabsComponents from "./tabs";

import { createGenerator } from "fumadocs-typescript";
import { AutoTypeTable } from "fumadocs-typescript/ui";

const generator = createGenerator();

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    AutoTypeTable: (props) => (
      <AutoTypeTable {...props} generator={generator} />
    ),
    Accordion,
    Accordions,
    ...ChangelogComponents,
    CodeBlock,
    ComponentPreview,
    ComponentsShowcase,
    ShadcnInstall,
    ...TabsComponents,
    ...components,
  };
}
