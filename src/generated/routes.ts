// Auto-generated file. Do not edit manually.
// Generated from .next/app-path-routes-manifest.json
// Run 'bun run generate:routes' to regenerate

export const routePatterns = [
  /^dub-redirect$/,
  /^error-pages\/not-found$/,
  /^error-pages\/page-unavailable$/,
  /^about$/,
  /^blog\/[^\/]+$/,
  /^blog$/,
  /^blog\/rss.xml$/,
  /^$/,
  /^projects$/,
  /^_global-error$/,
  /^_not-found$/,
  /^api\/admin-workflow\/cache-delete\/all$/,
  /^api\/admin-workflow\/cache-delete\/dub-links$/,
  /^api\/admin-workflow\/cache-delete\/guestbook-response$/,
  /^api\/auth\/.*$/,
  /^attribute$/,
  /^favicon.ico$/,
  /^guestbook$/,
  /^og\/blog\/.*$/,
  /^sitemap.xml$/,
] as const;

export function isDefinedRoute(pathname: string): boolean {
  return routePatterns.some((pattern) => pattern.test(pathname));
}
