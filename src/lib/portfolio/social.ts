"use server";
import { LastFmClient } from "lastfm-client-ts";
import type { Lyrics } from "@/shared/types/lyrics";

const lastfm = new LastFmClient({
  apiKey: process.env.LASTFM_API_KEY,
});

export async function getLyrics(trackId?: string) {
  if (!trackId) return "no-track-id";

  const data = await fetch(
    `https://public-api.verseify.workers.dev/lyrics/${trackId}`,
  )
    .then((res) => res.json())
    .then((data) => data as Lyrics)
    .catch(() => null);

  if (!data) return "no-lyrics";

  return data;
}

export async function getLastMusicPlayed(limit = 5) {
  const data = await lastfm.user.getRecentTracks({
    user: process.env.LASTFM_USERNAME,
    limit,
  });

  return data;
}
