#!/usr/bin/env bun
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Registry, RegistryItem } from "../src/labs-registry/schema";

// Extract description from MDX frontmatter
function extractDescriptionFromMDX(mdxPath: string): string {
  try {
    const content = readFileSync(mdxPath, "utf-8");
    // Match YAML frontmatter (handles different line endings)
    const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      // Match description line, accounting for potential quotes
      const descMatch = frontmatter.match(
        /description:\s*["']?([^"'\n\r]+)["']?/,
      );
      if (descMatch) {
        return descMatch[1].trim();
      }
    }
  } catch (_error) {
    console.warn(`⚠️  Could not read MDX file ${mdxPath}`);
  }
  return "";
}

// Auto-generate registry from components directory
function generateRegistry(): Registry {
  const componentsDir = join(process.cwd(), "src/labs-registry/components-v1");
  const docsDir = join(process.cwd(), "src/content/labs/components");
  const demoDir = join(componentsDir, "demo");

  const items: RegistryItem[] = [];
  const files = readdirSync(componentsDir);

  // Process component files
  for (const file of files) {
    if (!file.endsWith(".tsx") || file === "utils.ts") {
      continue;
    }

    const componentName = file.replace(".tsx", "");
    const mdxPath = join(docsDir, `${componentName}.mdx`);
    const description = extractDescriptionFromMDX(mdxPath);

    // Determine categories based on component name patterns
    const categories: string[] = [];
    if (componentName.includes("scroll")) {
      categories.push("scroll");
    }
    if (componentName.includes("card")) {
      categories.push("cards");
    }
    if (componentName.includes("cursor")) {
      categories.push("cursor");
    }
    if (
      componentName.includes("parallax") ||
      componentName.includes("rotate") ||
      componentName.includes("trailing")
    ) {
      categories.push("effects");
    }
    if (componentName === "button") {
      categories.push("interactive");
    }

    items.push({
      name: componentName,
      description: description || `${componentName} component`,
      type: "registry:component",
      files: [`${componentName}.tsx`],
      dependencies: [],
      registryDependencies: [],
      categories: categories.length > 0 ? categories : ["components"],
    });
  }

  // Process demo files
  try {
    const demoFiles = readdirSync(demoDir);
    for (const file of demoFiles) {
      if (!file.endsWith(".tsx")) {
        continue;
      }

      const demoName = `demo-${file.replace(".tsx", "")}`;
      const componentName = file.replace(".tsx", "");

      items.push({
        name: demoName,
        description: `Demo of the ${componentName} component`,
        type: "registry:example",
        files: [`demo/${file}`],
        dependencies: [],
        registryDependencies: [componentName],
        categories: ["interactive"],
      });
    }
  } catch (_error) {
    console.warn("⚠️  No demo directory found");
  }

  return { items };
}

// Extract dependencies from file content
function extractDependencies(content: string) {
  const dependencies = new Set<string>();
  const registryDeps = new Set<string>();
  const utilFiles = new Set<string>();

  // Match import statements
  const importRegex = /import\s+(?:{[^}]*}|[\w*]+)?\s*from\s+['"]([^'"]+)['"]/g;
  let match: RegExpExecArray | null;

  match = importRegex.exec(content);
  while (match !== null) {
    const importPath = match[1];

    // Check for @/lib/* imports (utility files)
    if (importPath.startsWith("@/lib/")) {
      const utilPath = importPath.replace("@/lib/", "");
      utilFiles.add(`${utilPath}.ts`);
      match = importRegex.exec(content);
      continue;
    }

    // Skip relative imports and Next.js imports
    if (
      importPath.startsWith(".") ||
      importPath.startsWith("@/") ||
      importPath.startsWith("next") ||
      importPath === "react"
    ) {
      match = importRegex.exec(content);
      continue;
    }

    // Check if it's a scoped package or regular npm package
    if (importPath.startsWith("@") || !importPath.includes("/")) {
      dependencies.add(importPath);
    }

    match = importRegex.exec(content);
  }

  // Detect registry dependencies from @/labs-registry imports
  const registryImportRegex = /@\/labs-registry\/components-v1\/([\w-]+)/g;
  match = registryImportRegex.exec(content);
  while (match !== null) {
    registryDeps.add(match[1]);
    match = registryImportRegex.exec(content);
  }

  return {
    dependencies: Array.from(dependencies).sort(),
    registryDependencies: Array.from(registryDeps).sort(),
    utilFiles: Array.from(utilFiles).sort(),
  };
}

async function buildRegistryIndex() {
  const registry = generateRegistry();

  let index = `// This file is autogenerated by scripts/build-registry.ts
// Do not edit this file directly.
import * as React from "react";
import type { RegistryEntry as RegistryEntryType } from "./schema";

export const Index: Record<string, RegistryEntryType> = {`;

  for (const item of registry.items) {
    const files =
      item.files?.map((file) => ({
        path: typeof file === "string" ? file : file.path,
        type: typeof file === "string" ? item.type : file.type,
        target: typeof file === "string" ? undefined : file.target,
      })) ?? [];

    if (files.length === 0) {
      continue;
    }

    const componentPath = files[0]?.path
      ? `@/labs-registry/components-v1/${files[0].path.replace(".tsx", "")}`
      : "";

    index += `
  "${item.name}": {
    name: "${item.name}",
    description: "${item.description ?? ""}",
    type: "${item.type}",
    registryDependencies: ${JSON.stringify(item.registryDependencies ?? [])},
    files: [${files.map((file) => {
      const filePath = `labs-registry/components-v1/${file.path}`;
      return `{
        path: "${filePath}",
        type: "${file.type}",
        target: "${file.target ?? ""}"
      }`;
    })}],
    component: ${
      componentPath
        ? `React.lazy(async () => {
        const mod = await import("${componentPath}") as any
        const exportName = Object.keys(mod).find(key => typeof mod[key] === 'function' || typeof mod[key] === 'object') || "${item.name}"
        return { default: mod.default || mod[exportName] }
      })`
        : "null"
    },
    categories: ${JSON.stringify(item.categories ?? [])},
    meta: ${JSON.stringify(item.meta ?? {})},
  },`;
  }

  index += `
};

export type RegistryEntry = keyof typeof Index;
`;

  const outputPath = join(process.cwd(), "src/labs-registry/__index__.tsx");
  writeFileSync(outputPath, index);
  console.log("✅ Built registry index at src/labs-registry/__index__.tsx");
}

async function buildPublicRegistry() {
  const registry = generateRegistry();

  // Create output directory
  const outputDir = join(process.cwd(), "public/labs/r");
  mkdirSync(outputDir, { recursive: true });

  // Registry directories
  const registryDirs = {
    components: "src/labs-registry/components-v1",
    demo: "src/labs-registry/components-v1/demo",
  };

  // Array to store all generated registry files
  const registryFiles: string[] = [];

  // Generate individual JSON files for each component
  for (const item of registry.items) {
    const files = item.files.map(
      (file: string | { path: string; type: string; target?: string }) => {
        const fileName = typeof file === "string" ? file : file.path;
        const sourcePath = join(
          process.cwd(),
          registryDirs.components,
          fileName,
        );

        // Read the file content
        let content = "";
        try {
          content = readFileSync(sourcePath, "utf-8");
        } catch (error) {
          console.error(`❌ Failed to read ${fileName}:`, error);
        }

        return {
          path: `labs-registry/components-v1/${fileName}`,
          content,
          type: typeof file === "string" ? item.type : file.type,
          target: typeof file === "string" ? undefined : file.target,
        };
      },
    );

    // Auto-detect dependencies from all files
    const allContent = files
      .map((f: { content: string }) => f.content)
      .join("\n");
    const detectedDeps = extractDependencies(allContent);

    // Add detected util files to the files array
    const utilFilesWithContent = detectedDeps.utilFiles.map((utilFile) => {
      const sourcePath = join(process.cwd(), registryDirs.components, utilFile);
      let content = "";
      try {
        content = readFileSync(sourcePath, "utf-8");
      } catch (_error) {
        console.warn(`⚠️  Could not read util file ${utilFile}`);
      }

      return {
        path: `labs-registry/components-v1/${utilFile}`,
        content,
        type: "registry:lib",
        target: undefined,
      };
    });

    // Combine component files and util files
    const allFiles = [...files, ...utilFilesWithContent];

    // Merge with manually specified dependencies
    const finalDependencies = [
      ...new Set([...(item.dependencies || []), ...detectedDeps.dependencies]),
    ].sort();

    const finalRegistryDependencies = [
      ...new Set([
        ...(item.registryDependencies || []),
        ...detectedDeps.registryDependencies,
      ]),
    ].sort();

    // Create individual component JSON file
    const componentJson = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: item.name,
      type: item.type,
      ...(item.description && { description: item.description }),
      ...(finalDependencies.length > 0 && {
        dependencies: finalDependencies,
      }),
      ...(finalRegistryDependencies.length > 0 && {
        registryDependencies: finalRegistryDependencies,
      }),
      files: allFiles.map((f) => ({
        path: f.path,
        content: f.content,
        type: f.type,
        ...(f.target && { target: f.target }),
      })),
      ...(item.tailwind && { tailwind: item.tailwind }),
      ...(item.cssVars && { cssVars: item.cssVars }),
    };

    const componentJsonPath = join(outputDir, `${item.name}.json`);
    writeFileSync(componentJsonPath, JSON.stringify(componentJson, null, 2));
    registryFiles.push(`${item.name}.json`);
    console.log(`📄 Generated ${item.name}.json`);
  }

  // Fix the path for registry items.
  const fixedRegistry = {
    ...registry,
    items: registry.items.map((item: RegistryItem) => {
      const files = item.files?.map(
        (file: string | { path: string; type: string; target?: string }) => {
          const filePath = typeof file === "string" ? file : file.path;
          return {
            path: `labs-registry/components-v1/${filePath}`,
            type: typeof file === "string" ? item.type : file.type,
            target: typeof file === "string" ? undefined : file.target,
          };
        },
      );

      return {
        ...item,
        files,
      };
    }),
  };

  // Create registry.json
  const registryPath = join(outputDir, "registry.json");
  writeFileSync(registryPath, JSON.stringify(fixedRegistry, null, 2));
  registryFiles.push("registry.json");
  console.log("✅ Built registry.json at public/labs/r/registry.json");

  return registryFiles;
}

try {
  console.log("🏗️ Building labs registry...");
  await buildRegistryIndex();
  const registryFiles = await buildPublicRegistry();
  console.log(
    `✅ Build complete! Generated ${registryFiles.length} files:`,
    registryFiles,
  );
} catch (error) {
  console.error("❌ Build failed:", error);
  process.exit(1);
}
