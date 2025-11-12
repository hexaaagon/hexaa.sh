"use server";
import { Dub } from "dub";
import { LRUCache } from "lru-cache";

const dub = new Dub({
  token: process.env.DUB_API_KEY || "",
});

// LRU Cache with 1 day TTL
const linkCache = new LRUCache<
  string,
  Awaited<ReturnType<typeof dub.links.get>> | false
>({
  max: 500, // Maximum number of items in cache
  ttl: 1000 * 60 * 60 * 24, // 1 day in milliseconds
});

export async function getLinkInfo(domain = "go.hexaa.sh", key: string) {
  const cacheKey = `${domain}:${key}`;

  const cached = linkCache.get(cacheKey);
  if (cached) {
    console.log("cached", cached);
    return cached;
  }

  const linkInfo = await dub.links
    .get({
      domain,
      key,
    })
    .catch((): false => false);

  linkCache.set(cacheKey, linkInfo);

  console.log("fetched", linkInfo);
  return linkInfo;
}

export async function clearLinkCache() {
  linkCache.clear();
  return { success: true, message: "Link cache cleared" };
}
