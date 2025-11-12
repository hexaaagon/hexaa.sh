"use server";
import { Dub } from "dub";
import { LRUCache } from "lru-cache";

const dub = new Dub();

// LRU Cache with 1 day TTL
const linkCache = new LRUCache<
  string,
  Awaited<ReturnType<typeof dub.links.get>>
>({
  max: 500, // Maximum number of items in cache
  ttl: 1000 * 60 * 60 * 24, // 1 day in milliseconds
});

export async function getLinkInfo(domain = "go.hexaa.sh", key: string) {
  const cacheKey = `${domain}:${key}`;

  const cached = linkCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const linkInfo = await dub.links.get({
    domain,
    key,
  });

  linkCache.set(cacheKey, linkInfo);

  return linkInfo;
}

export async function clearLinkCache() {
  linkCache.clear();
  return { success: true, message: "Link cache cleared" };
}
