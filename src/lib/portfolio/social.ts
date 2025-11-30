"use server";
import { LastFmClient } from "lastfm-client-ts";
import type { Lyrics } from "@/shared/types/lyrics";
import type { WakaTimeData } from "@/lib/actions/wakatime";
import { LRUCache } from "lru-cache";
import { Octokit } from "@octokit/rest";

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

// GitHub contributions cache (server side)
const contributionsCache = new LRUCache<string, number[]>({
  max: 10,
  ttl: 60 * 60 * 1000, // 1 hour
});

export async function getGithubContributions(username = "hexaaagon") {
  const existing = contributionsCache.get(username);
  if (existing) return existing;

  const token = process.env.GITHUB_TOKEN ?? null;
  if (token) {
    try {
      const octokit = new Octokit({ auth: token });

      const toDate = new Date().toISOString();
      const fromDate = new Date(
        Date.now() - 365 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const query = `query ($login: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $login) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }`;

      // Prefer the graphql helper if present (returns direct payload), otherwise fall back to request
      let response: unknown = null;
      let usedGraphql = false;
      const graphqlFn = (
        octokit as unknown as {
          graphql?: (
            q: string,
            v?: Record<string, unknown>,
          ) => Promise<unknown>;
        }
      ).graphql;
      if (graphqlFn) {
        try {
          response = await graphqlFn(query, {
            login: username,
            from: fromDate,
            to: toDate,
          });
          usedGraphql = true;
        } catch (e) {
          console.error(
            "octokit.graphql call failed, falling back to octokit.request:",
            e,
          );
        }
      }

      if (!response) {
        response = await octokit.request("POST /graphql", {
          query,
          variables: { login: username, from: fromDate, to: toDate },
        });
      }

      let maybeResponseRoot = response as unknown;
      if (
        (maybeResponseRoot as unknown as { data?: unknown })?.data !== undefined
      ) {
        maybeResponseRoot = (maybeResponseRoot as unknown as { data?: unknown })
          ?.data;
      }

      if (
        (maybeResponseRoot as unknown as { data?: unknown })?.data !== undefined
      ) {
        maybeResponseRoot = (maybeResponseRoot as unknown as { data?: unknown })
          ?.data;
      }
      const rootHasUser = !!(
        maybeResponseRoot &&
        typeof maybeResponseRoot === "object" &&
        (maybeResponseRoot as Record<string, unknown>).user !== undefined
      );

      if (usedGraphql && !rootHasUser) {
        response = await octokit.request("POST /graphql", {
          query,
          variables: { login: username, from: fromDate, to: toDate },
        });

        maybeResponseRoot = response as unknown;
        if (
          (maybeResponseRoot as unknown as { data?: unknown })?.data !==
          undefined
        ) {
          maybeResponseRoot = (
            maybeResponseRoot as unknown as { data?: unknown }
          )?.data;
        }
        if (
          (maybeResponseRoot as unknown as { data?: unknown })?.data !==
          undefined
        ) {
          maybeResponseRoot = (
            maybeResponseRoot as unknown as { data?: unknown }
          )?.data;
        }
      }

      const root =
        typeof maybeResponseRoot !== "undefined"
          ? maybeResponseRoot
          : (response as unknown);
      let weeks =
        (
          root as unknown as {
            user?: {
              contributionsCollection?: {
                contributionCalendar?: { weeks?: unknown[] };
              };
            };
          }
        )?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
      const counts: number[] = [];

      const typedWeeks = weeks as unknown as Array<{
        contributionDays?: Array<{ contributionCount?: number; date?: string }>;
      }>;

      if (!weeks || weeks.length === 0) {
        try {
          const _contribObj = (
            response as unknown as {
              data?: { user?: { contributionsCollection?: unknown } };
            }
          )?.data?.user?.contributionsCollection;
        } catch {
          // ignore stringify failures
        }
      }
      for (const week of typedWeeks) {
        const days = week?.contributionDays || [];
        for (const day of days) {
          counts.push(Number(day?.contributionCount ?? 0));
        }
      }

      if (usedGraphql && (!weeks || weeks.length === 0)) {
        try {
          response = await octokit.request("POST /graphql", {
            query,
            variables: { login: username, from: fromDate, to: toDate },
          });
          // re-normalize root and weeks from new response
          let newMaybeRoot = response as unknown;
          if (
            (newMaybeRoot as unknown as { data?: unknown })?.data !== undefined
          ) {
            newMaybeRoot = (newMaybeRoot as unknown as { data?: unknown })
              ?.data;
          }
          if (
            (newMaybeRoot as unknown as { data?: unknown })?.data !== undefined
          ) {
            newMaybeRoot = (newMaybeRoot as unknown as { data?: unknown })
              ?.data;
          }
          const newRoot = newMaybeRoot;
          weeks =
            (
              newRoot as unknown as {
                user?: {
                  contributionsCollection?: {
                    contributionCalendar?: { weeks?: unknown[] };
                  };
                };
              }
            )?.user?.contributionsCollection?.contributionCalendar?.weeks || [];

          const newTypedWeeks = weeks as unknown as Array<{
            contributionDays?: Array<{
              contributionCount?: number;
              date?: string;
            }>;
          }>;
          if (newTypedWeeks && newTypedWeeks.length > 0) {
            counts.length = 0;
            for (const week of newTypedWeeks) {
              const days = week?.contributionDays || [];
              for (const day of days) {
                counts.push(Number(day?.contributionCount ?? 0));
              }
            }
          }
        } catch (e) {
          console.error("Fallback request also failed:", e);
        }
      }

      if (counts.length > 0) {
        contributionsCache.set(username, counts);
        return counts;
      }
    } catch (err) {
      console.error("GraphQL contributions fetch failed:", err);
    }
  }

  // Fallback: fetch the contributions SVG from GitHub public profile and scrape
  const url = `https://github.com/users/${username}/contributions`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "personal-web",
      Accept: "text/html,application/xhtml+xml,application/xml",
    },
  });

  if (!res.ok) return null;
  const text = await res.text();

  const regexp = /<rect[^>]*data-count="([0-9]+)"[^>]*>/g;
  const out: number[] = [];
  let match: RegExpExecArray | null;
  for (;;) {
    match = regexp.exec(text);
    if (!match) break;
    out.push(Number(match[1] ?? 0));
  }

  const result = out.length > 0 ? out : [];
  contributionsCache.set(username, result);
  return result;
}

// Cache for contributions by date range
const contributionsDateCache = new LRUCache<
  string,
  Array<{ date: string; count: number }>
>({
  max: 20,
  ttl: 60 * 60 * 1000,
});

function makeDateRangeKey(username: string, from: string, to: string) {
  return `${username}:${from}:${to}`;
}

export async function getGithubContributionsByDate(
  username = "hexaaagon",
  fromDate?: string,
  toDate?: string,
) {
  const toIso = toDate || new Date().toISOString();
  const fromIso =
    fromDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();
  const cacheKey = makeDateRangeKey(username, fromIso, toIso);
  const cached = contributionsDateCache.get(cacheKey);
  if (cached) return cached;

  const token = process.env.GITHUB_TOKEN ?? null;
  if (token) {
    try {
      const octokit = new Octokit({ auth: token });
      const query = `query ($login: String!, $from: DateTime!, $to: DateTime!) {\n        user(login: $login) {\n          contributionsCollection(from: $from, to: $to) {\n            contributionCalendar {\n              weeks {\n                contributionDays {\n                  date\n                  contributionCount\n                }\n              }\n            }\n          }\n        }\n      }`;
      // Prefer octokit.graphql if available
      const graphqlFn = (
        octokit as unknown as {
          graphql?: (
            q: string,
            v?: Record<string, unknown>,
          ) => Promise<unknown>;
        }
      ).graphql;
      let response: unknown = null;
      if (graphqlFn) {
        try {
          response = await graphqlFn(query, {
            login: username,
            from: fromIso,
            to: toIso,
          });
        } catch (err) {
          console.error("octokit.graphql failed", err);
        }
      }
      if (!response) {
        response = await octokit.request("POST /graphql", {
          query,
          variables: { login: username, from: fromIso, to: toIso },
        });
      }

      const raw = (response as unknown as { data?: unknown })?.data ?? response;
      const root =
        raw && (raw as unknown as { data?: unknown })?.data !== undefined
          ? (raw as unknown as { data?: unknown })?.data
          : raw;
      const weeks =
        (
          root as unknown as {
            user?: {
              contributionsCollection?: {
                contributionCalendar?: {
                  weeks?: Array<{
                    contributionDays?: Array<{
                      date?: string;
                      contributionCount?: number;
                    }>;
                  }>;
                };
              };
            };
          }
        )?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
      const out: Array<{ date: string; count: number }> = [];
      for (const week of weeks) {
        for (const day of week?.contributionDays || []) {
          out.push({
            date: String(day?.date ?? ""),
            count: Number(day?.contributionCount ?? 0),
          });
        }
      }
      contributionsDateCache.set(cacheKey, out);
      return out;
    } catch (err) {
      console.error("Error fetching contributionsByDate via GraphQL:", err);
    }
  }

  // Fallback scraping: parse data-date & data-count attributes
  const url = `https://github.com/users/${username}/contributions`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "personal-web",
      Accept: "text/html,application/xhtml+xml,application/xml",
    },
  });
  if (!res.ok) return [];
  const text = await res.text();
  const regex =
    /<rect[^>]*data-date="([0-9-]+)"[^>]*data-count="([0-9]+)"[^>]*>/g;
  const out: Array<{ date: string; count: number }> = [];
  let m: RegExpExecArray | null;
  while (true) {
    m = regex.exec(text);
    if (!m) break;
    out.push({ date: String(m[1]), count: Number(m[2]) });
  }
  contributionsDateCache.set(cacheKey, out);
  return out;
}

// Get contributions summary for a given calendar year (total contributions)
export async function getGithubContributionsSummaryForYear(
  username = "hexaaagon",
  year?: number,
) {
  const y = year ?? new Date().getFullYear();
  const from = new Date(`${y}-01-01T00:00:00.000Z`).toISOString();
  const to = new Date(`${y}-12-31T23:59:59.999Z`).toISOString();
  const days = await getGithubContributionsByDate(username, from, to);
  const total = days.reduce((acc, d) => acc + (d.count || 0), 0);
  return { year: y, total, daysCount: days.length };
}
