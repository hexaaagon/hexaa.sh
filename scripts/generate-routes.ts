#!/usr/bin/env bun
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MANIFEST_PATH = join(
  process.cwd(),
  ".next/app-path-routes-manifest.json",
);
const OUTPUT_PATH = join(process.cwd(), "src/generated/routes.ts");

try {
  // Read the manifest file
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf-8")) as Record<
    string,
    string
  >;

  // Extract route patterns
  const routes = Object.values(manifest);

  // Convert to regex patterns
  const patterns = routes.map((route) => {
    const normalizedRoute = route.replace(/^\//, "");
    const pattern = normalizedRoute
      .replace(/\[\.\.\.[\w-]+\]/g, ".*") // [...slug] -> .*
      .replace(/\[[\w-]+\]/g, "[^/]+") // [slug] -> [^/]+
      .replace(/\//g, "\\/"); // Escape forward slashes for regex

    return pattern;
  });

  // Generate TypeScript file
  const content = `// Auto-generated file. Do not edit manually.
// Generated from .next/app-path-routes-manifest.json
// Run 'bun run generate:routes' to regenerate

export const routePatterns = [
${patterns.map((p) => `  /^${p}$/,`).join("\n")}
] as const;

export function isDefinedRoute(pathname: string): boolean {
  return routePatterns.some((pattern) => pattern.test(pathname));
}
`;

  // Ensure directory exists
  const { mkdirSync } = await import("node:fs");
  const { dirname } = await import("node:path");
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });

  // Write the file
  writeFileSync(OUTPUT_PATH, content, "utf-8");

  console.log(`✅ Generated routes file: ${OUTPUT_PATH}`);
  console.log(`   Found ${patterns.length} routes`);
} catch (error) {
  if (error instanceof Error && "code" in error && error.code === "ENOENT") {
    console.warn(
      "⚠️  .next/app-path-routes-manifest.json not found. Skipping route generation.",
    );
    console.warn(
      "   This is normal during the first build. The file will be generated after the build completes.",
    );
    process.exit(0);
  }
  throw error;
}
