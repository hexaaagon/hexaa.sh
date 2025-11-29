"use server";
import { LastFmClient } from "lastfm-client-ts";
import type { Lyrics } from "@/shared/types/lyrics";
import type { WakaTimeData } from "@/lib/actions/wakatime";
import { LRUCache } from "lru-cache";

export async function getLyrics(trackId?: string) {
  if (!trackId) return "no-track-id";

  const data = await fetch(
    `https://public-api.verseify.workers.dev/lyrics/${trackId}`,
  )
    .then((res) => res.json())
    .then((data) => data as Lyrics)
    .catch(() => null);

  if (!data) return "no-lyrics";
  const dataAny = data as unknown as Record<string, unknown>;

  if (dataAny.success === false) {
    switch ((dataAny.message as string).toLowerCase().replaceAll(".", "")) {
      case "lyrics not found":
        return "no-lyrics";
      default:
        return "error";
    }
  }

  return data;
}

export async function getRecentTrackPlayed(limit = 5) {
  const lastfm = new LastFmClient({
    apiKey: process.env.LASTFM_API_KEY,
    baseUrl: "https://ws.audioscrobbler.com/2.0/",
  });

  const data = await lastfm.user.getRecentTracks({
    user: process.env.LASTFM_USERNAME,
    limit,
  });

  return data;
}

// Wakatime last 7 days cache (client friendly fallback for Lanyard's code activity)
// Cache for 5 hours
const wakaLast7Cache = new LRUCache<string, WakaTimeData>({
  max: 1,
  ttl: 5 * 60 * 60 * 1000,
});
const WAKA_LAST_7_KEY = "wakatime_last_7_days";

export async function getWakaTimeLast7Days() {
  const cached = wakaLast7Cache.get(WAKA_LAST_7_KEY);

  if (cached) return cached;

  const res = await fetch(
    "https://wakatime.com/api/v1/users/current/stats/last_7_days?timeout=15",
    {
      headers: {
        Authorization: `Basic ${btoa(process.env.WAKATIME_API_KEY)}`,
      },
    },
  );

  if (!res.ok) return null;

  const data = (await res.json()).data as WakaTimeData;

  wakaLast7Cache.set(WAKA_LAST_7_KEY, data);
  return data;
}
