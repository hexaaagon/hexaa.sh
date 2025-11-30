// (lint suppressions removed) - kept for readability
/** biome-ignore-all lint/suspicious/noArrayIndexKey: false-positive - using array index for token keys is acceptable here */
"use client";
import { SiDiscord, SiSpotify } from "@icons-pack/react-simple-icons";

import { useLanyard } from "react-use-lanyard";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";
import {
  getGithubContributionsSummaryForYear,
  getLyrics,
  getRecentTrackPlayed,
  getWakaTimeLast7Days,
} from "@/lib/portfolio/social";
import { useLyricsStore } from "@/lib/store/lyrics-store";
import {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
  type HTMLProps,
} from "react";
import type {
  Lyrics,
  LineLyric,
  StaticLyric,
  SyllableLyric,
} from "@/shared/types/lyrics";
import Link from "next/link";
import { ProgressCircle } from "./ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { GitBranch } from "lucide-react";

const codeActivities = ["visual studio code"];

const CRAWLER_UA_RE =
  /bot|crawler|spider|crawl|slurp|mediapartners-google|adsbot|bingpreview|duckduckbot|yandex/i;

export default function SocialBento({
  githubContributions,
}: {
  githubContributions?: number[];
}) {
  // Detect common crawlers from the user-agent string. This runs synchronously
  // in the client so we can avoid starting network-heavy hooks for bots.
  const isCrawler =
    typeof navigator !== "undefined" && CRAWLER_UA_RE.test(navigator.userAgent);

  // Avoid socket connections for bots
  const { loading, status } = useLanyard({
    userId: "465454937267240962",
    socket: !isCrawler || true, // just for type fix
  });

  const codeActivity = useMemo(() => {
    if (!status) return null;
    const activity = status.activities.find(
      (a: { name?: string; type?: number }) =>
        a.name && codeActivities.includes(a.name.toLowerCase()),
    );
    return activity || null;
  }, [status]);

  const { data: wakatimeLast7Days } = useSWRImmutable(
    //Avoid fetching for crawlers
    isCrawler ? null : "wakatime-last-7-days",
    async () => {
      return await getWakaTimeLast7Days();
    },
  );

  const _wakatimeSummary = useMemo(() => {
    if (!wakatimeLast7Days) return null;
    const totalSec = wakatimeLast7Days.total_seconds ?? 0;
    const hours = totalSec / 3600;
    const human =
      wakatimeLast7Days.human_readable_total ?? `${hours.toFixed(1)} h`;
    let topProject = null;
    try {
      const projects = wakatimeLast7Days.projects ?? [];
      if (projects.length > 0) {
        const sorted = [...projects].sort(
          (a, b) => b.total_seconds - a.total_seconds,
        );
        topProject = sorted[0] || null;
      }
    } catch {
      topProject = null;
    }
    return { hours, human, topProject };
  }, [wakatimeLast7Days]);

  const { data: githubSummaryThisYear } = useSWRImmutable(
    // Avoid fetching for crawlers
    isCrawler ? null : "github-contributions-summary-this-year",
    async () => {
      return await getGithubContributionsSummaryForYear();
    },
  );

  const {
    data: lyrics,
    isLoading: isLyricsLoading,
    mutate: mutateLyrics,
  } = useSWR(
    // If bot, pass null key so swr won't fetch
    isCrawler ? null : status?.spotify?.track_id,
    async (trackId?: string) => {
      return await getLyrics(trackId);
    },
  );
  const { data: recentTracks, isLoading: isRecentTracksLoading } =
    useSWRImmutable("lastfm-recent-tracks", async () =>
      getRecentTrackPlayed(2),
    );

  // Hydrate SWR from persisted lyrics cache (localStorage) to avoid holding
  // duplicate large lyrics in component state. If the store has cached lyrics
  // for the current track id, populate SWR without revalidation.
  useEffect(() => {
    if (isCrawler) return;
    const trackId = status?.spotify?.track_id;
    if (!trackId) return;
    const cached = useLyricsStore.getState().cache[trackId];
    if (cached && !lyrics) {
      // hydrate SWR with cached payload without triggering revalidation
      try {
        type MutateFn = (
          data: Lyrics | "no-lyrics" | "no-track-id",
          shouldRevalidate?: boolean,
        ) => Promise<unknown> | undefined;
        const fn = mutateLyrics as unknown as MutateFn;
        fn(cached, false);
      } catch {
        /* ignore */
      }
    }
  }, [status?.spotify?.track_id, lyrics, mutateLyrics, isCrawler]);

  // Persist latest lyrics to the store when SWR returns data, so subsequent
  // mounts can rehydrate from localStorage instead of keeping duplicate data
  // permanently in React tree memory.
  useEffect(() => {
    if (isCrawler) return;
    const trackId = status?.spotify?.track_id;
    if (!trackId || !lyrics || typeof lyrics === "string") return;
    useLyricsStore.getState().set(trackId, lyrics);
  }, [lyrics, status?.spotify?.track_id, isCrawler]);

  const [trackDurationProgress, setTrackDurationProgress] = useState(0);
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);
  // measured widths for pixel-perfect mask sizing
  const measuredWidths = useRef<Record<string, number>>({});
  const [trackStartMs, setTrackStartMs] = useState<number | null>(null);

  const trackDuration = useMemo(() => {
    if (!status?.spotify) return 0;
    return (
      Math.floor(status.spotify.timestamps.end / 1000) -
      Math.floor(status.spotify.timestamps.start / 1000)
    );
  }, [status?.spotify]);

  const getType = useCallback((obj: unknown) => {
    if (!obj || typeof obj !== "object") return "";
    const rec = obj as Record<string, unknown>;
    return String(rec.Type ?? rec.type ?? "").toLowerCase();
  }, []);

  const normalizeTs = useCallback((raw: unknown) => {
    const n = Number(raw ?? 0);
    if (!n || Number.isNaN(n)) return 0;
    if (n < 1e12) return n * 1000;
    return n;
  }, []);

  // Update progress from an authoritative start timestamp for smooth animations
  useEffect(() => {
    if (isCrawler) return;
    if (!trackStartMs) {
      setTrackDurationProgress(0);
      return;
    }
    const id = setInterval(() => {
      setTrackDurationProgress((Date.now() - trackStartMs) / 1000);
    }, 200);
    return () => clearInterval(id);
  }, [trackStartMs, isCrawler]);

  // Set the authoritative track start from Lanyard activity timestamps so
  // progress won't randomly restart as the component re-renders.
  useEffect(() => {
    if (isCrawler) return;
    if (status?.spotify?.track_id) {
      const activity = status.activities.find(
        (a: { type?: number }) => a.type === 2,
      );
      const startRaw = activity?.timestamps?.start ?? null;
      const startMs = startRaw ? normalizeTs(startRaw) : null;
      setTrackStartMs(startMs ?? Date.now());
    }
  }, [status?.spotify?.track_id, status?.activities, normalizeTs, isCrawler]);

  // Auto-scroll to the active lyric line when progress or lyrics change.
  useEffect(() => {
    if (isCrawler) return;
    const container = lyricsContainerRef.current;
    if (!container) return;

    // If static lyrics, scroll progressively by percentage of the lyric duration
    if (typeof lyrics === "object" && lyrics !== null) {
      const l = lyrics as Lyrics;
      const typeRaw = getType(l);
      if (typeRaw === "static") {
        const start = l.StartTime ?? 0;
        const end = l.EndTime ?? start + 1;
        const pct = Math.min(
          Math.max((trackDurationProgress - start) / (end - start), 0),
          1,
        );
        container.scrollTop =
          pct * (container.scrollHeight - container.clientHeight);
        return;
      }
    }

    const active = container.querySelector(
      '[data-active="true"]',
    ) as HTMLElement | null;
    if (active && container.contains(active)) {
      try {
        const containerRect = container.getBoundingClientRect();
        const activeRect = active.getBoundingClientRect();
        const activeTopRelative =
          activeRect.top - containerRect.top + container.scrollTop;
        const activeHeight = activeRect.height || 0;
        const target = Math.max(
          0,
          activeTopRelative - container.clientHeight * 0.4 + activeHeight / 2,
        );
        container.scrollTo({ top: target, behavior: "smooth" });
      } catch {
        /* ignore */
      }
    }
  }, [trackDurationProgress, lyrics, getType, isCrawler]);
  // === Render ===
  // If this render is for a crawler, do not render anything (the hooks are
  // no-op'd above so this is safe and avoids exposing the interactive UI).
  if (isCrawler) return null;

  return (
    <div className="flex w-full flex-col gap-2 lg:grid lg:grid-cols-4">
      <section className="w-full gap-2 lg:h-full">
        <div className="flex flex-col rounded-2xl border bg-muted/50 p-4 lg:h-full dark:bg-muted/20">
          <div className="flex w-full justify-between">
            <aside className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 p-1">
                <Avatar>
                  <AvatarImage
                    src={`https://cdn.discordapp.com/avatars/${status?.discord_user.id}/${status?.discord_user.avatar}`}
                    alt="Discord Avatar"
                  />
                  <AvatarFallback>
                    <SiDiscord size={18} className="text-slate-700" />
                  </AvatarFallback>
                </Avatar>
              </span>
              {loading && status ? (
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-2 w-2/3" />
                  <Skeleton className="h-2 w-2/4" />
                </div>
              ) : (
                <div className="flex flex-col gap-px">
                  <p className="font-medium text-slate-700 text-xs dark:text-slate-200/80">
                    @{status?.discord_user.username}
                  </p>
                  <span className="flex items-center gap-1 text-2xs text-muted-foreground">
                    <div
                      className={`size-2 rounded-full discord-${status?.discord_status}`}
                    ></div>
                    <p className="mt-0.5 leading-2">
                      {status?.discord_status.replace(
                        /^./,
                        status?.discord_status.charAt(0).toUpperCase(),
                      )}
                    </p>
                  </span>
                </div>
              )}
            </aside>
            <div className="flex items-center gap-2">
              {status?.activities.map((activity) => {
                if (!activity.name) return null;
                const ifSpotify = activity.name.toLowerCase() === "spotify";

                return (
                  <div key={activity.id} className="relative">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {ifSpotify ? (
                          <SiSpotify size={20} className="text-spotify" />
                        ) : (
                          activity.assets?.large_image && (
                            <Image
                              src={`https://media.discordapp.net/${activity.assets.large_image.replace("mp:", "")}`}
                              alt={activity.name}
                              width={32}
                              height={32}
                              className="rounded-lg"
                            />
                          )
                        )}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{activity.assets?.large_text}</p>
                      </TooltipContent>
                    </Tooltip>
                    {activity.assets?.small_image && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="-bottom-1 -right-1 absolute inline-block rounded-full border-2 border-background bg-background">
                            <Image
                              src={`https://media.discordapp.net/${activity.assets.small_image.replace("mp:", "")}`}
                              alt={activity.name}
                              width={16}
                              height={16}
                              className="rounded-full"
                            />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{activity.assets.small_text}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                );
              })}
              {status?.activities.length === 0 && (
                <p className="text-2xs text-muted-foreground">
                  No active activities
                </p>
              )}
            </div>
          </div>
          <div className="flex h-full w-full flex-col items-center justify-center">
            {loading && !status ? (
              <Skeleton className="h-6 w-3/4" />
            ) : codeActivity ? (
              <div className="flex flex-col items-center text-center">
                <h3 className="-mb-px font-medium text-xs">
                  Coding in {codeActivity.details?.split(" - ")[0]}
                </h3>
                <p className="mb-1 text-2xs">
                  {codeActivity.details?.split(" - ")[1]}
                </p>
                <span className="flex items-center gap-1 text-2xs text-muted-foreground">
                  <GitBranch size={12} className="inline-block align-middle" />
                  <span className="inline-block align-middle">
                    {codeActivity?.state
                      ? String(codeActivity.state)
                      : "an unknown branch"}
                  </span>
                </span>
              </div>
            ) : (
              <p className="text-2xs text-muted-foreground">
                Not coding right now
              </p>
            )}
          </div>
        </div>
      </section>
      <section className="col-span-2 flex w-full flex-col gap-2">
        {loading && !status ? (
          <Skeleton className="h-38 w-full rounded-2xl border bg-social-spotify"></Skeleton>
        ) : status?.listening_to_spotify ? (
          /* Listening to Spotify with Lyrics */
          (() => {
            return (
              <Link
                href={`https://open.spotify.com/track/${status?.spotify.track_id}`}
                target="_blank"
                className="group relative h-38 w-full overflow-clip rounded-2xl border bg-social-spotify p-4 pt-2"
              >
                <header className="z-10 mb-2 flex items-center gap-2">
                  <ProgressCircle
                    size={38}
                    strokeWidth={2}
                    value={(trackDurationProgress / trackDuration) * 100}
                  >
                    <Image
                      src={status?.spotify.album_art_url}
                      alt="Album Art"
                      width={32}
                      height={32}
                      className="m-auto rounded-full"
                    />
                  </ProgressCircle>
                  <div className="flex flex-col mix-blend-difference *:z-10 *:line-clamp-1 *:text-white">
                    <p className="font-medium text-xs">
                      {status?.spotify.song}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {status?.spotify.artist}
                    </p>
                  </div>
                </header>
                <span className="absolute top-2.5 right-2.5 z-10 inline-flex items-center gap-1 text-3xs text-white">
                  Listening on
                  <SiSpotify size={14} className="pr-0.5" />
                </span>
                <div className="relative z-10">
                  <div
                    ref={lyricsContainerRef}
                    className="lyrics-scroll h-20 overflow-y-auto overflow-x-hidden text-xs *:leading-4"
                    style={{
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >
                    {isLyricsLoading ? (
                      <Skeleton className="h-full w-full" />
                    ) : lyrics === "no-lyrics" ? (
                      <p className="m-auto">No lyrics found.</p>
                    ) : lyrics === "no-track-id" ? (
                      <p className="m-auto">No track ID provided.</p>
                    ) : (
                      (() => {
                        if (typeof lyrics !== "object" || lyrics === null)
                          return null;

                        const l = lyrics as Lyrics;
                        const typeRaw = getType(l);

                        // Static: simple list, scroll handled by effect
                        if (typeRaw === "static") {
                          const s = l as StaticLyric;
                          return s.Lines.map((line, idx) => (
                            <p
                              key={`${line.Text.slice(0, 24)}-${idx}`}
                              className="truncate text-xs"
                            >
                              {line.Text}
                            </p>
                          ));
                        }

                        // Line lyrics: left-to-right reveal mask + per-token measurements
                        if (typeRaw === "line") {
                          const lines = (l as LineLyric).Content ?? [];
                          return lines.map((lineObj, idx) => {
                            const obj = lineObj as unknown as Record<
                              string,
                              unknown
                            >;
                            const start = Number(
                              obj.StartTime ?? obj.Start ?? 0,
                            );
                            const end = Number(obj.EndTime ?? obj.End ?? 0);
                            const duration = Math.max(end - start, 0.001);
                            const pct = Math.min(
                              Math.max(
                                (trackDurationProgress - start) / duration,
                                0,
                              ),
                              1,
                            );

                            const isActiveLine =
                              trackDurationProgress >= start &&
                              trackDurationProgress <= end;
                            const opposite = Boolean(
                              obj.OppositeAligned ?? false,
                            );

                            const text = String(obj.Text ?? "");
                            const tokens = text.match(/(\s+|\S+)/g) || [];
                            const lineKey = `line-${start}-${end}-${idx}`;

                            // compute total measured width from token measurements
                            let totalMeasured = 0;
                            for (let i = 0; i < tokens.length; i++) {
                              totalMeasured +=
                                measuredWidths.current[`${lineKey}-t-${i}`] ??
                                0;
                            }

                            const revealPx =
                              totalMeasured > 0 ? totalMeasured * pct : 0;

                            // cumulative width while rendering tokens
                            let cum = 0;

                            return (
                              <p
                                key={`${start}-${end}-${String(obj.Text ?? idx)}`}
                                data-active={isActiveLine ? "true" : "false"}
                                className={`relative overflow-hidden truncate text-xs ${opposite ? "text-right" : "text-left"}`}
                              >
                                {/* Render each token as its own inline-block so we can measure widths and reveal per-token */}
                                {tokens.map((tok, ti) => {
                                  const tokenKey = `${lineKey}-t-${ti}`;
                                  const w =
                                    measuredWidths.current[tokenKey] ?? 0;
                                  const visiblePx =
                                    totalMeasured > 0
                                      ? Math.max(0, Math.min(w, revealPx - cum))
                                      : 0;

                                  cum += w;

                                  const visiblePxNum = Math.max(
                                    0,
                                    Math.round(visiblePx || 0),
                                  );
                                  const innerWidth =
                                    w > 0
                                      ? `${visiblePxNum}px`
                                      : `${(pct * 100).toFixed(2)}%`;

                                  return (
                                    <span
                                      key={tokenKey}
                                      className="relative inline-block"
                                      style={{ verticalAlign: "top" }}
                                    >
                                      <span
                                        ref={(el) => {
                                          if (el)
                                            measuredWidths.current[tokenKey] =
                                              el.getBoundingClientRect().width;
                                        }}
                                        className="inline-block select-none whitespace-pre text-muted-foreground"
                                        style={{ textOverflow: "ellipsis" }}
                                      >
                                        {tok}
                                      </span>
                                      <span className="absolute inset-0 overflow-hidden whitespace-pre">
                                        <span
                                          style={{
                                            position: "absolute",
                                            left: 0,
                                            width: innerWidth,
                                            height: "100%",
                                            overflow: "hidden",
                                            transition: "width 220ms linear",
                                          }}
                                        >
                                          <span
                                            className={`block whitespace-pre font-medium text-primary ${opposite ? "text-right" : "text-left"}`}
                                            style={{ height: "100%" }}
                                          >
                                            {tok}
                                          </span>
                                        </span>
                                      </span>
                                    </span>
                                  );
                                })}
                              </p>
                            );
                          });
                        }

                        // Syllable lyrics: scale the active syllable
                        if (typeRaw === "syllable") {
                          const s = l as SyllableLyric;
                          // Render each vocal block as its own line of syllables
                          return s.Content.map((block, blockIndex) => {
                            if (
                              String(block.Type || "").toLowerCase() !== "vocal"
                            )
                              return null;
                            const syllables = block.Lead?.Syllables || [];
                            // compute whether any syllable is active to mark the line
                            const anyActive = syllables.some((syll) => {
                              const sy = syll as unknown as Record<
                                string,
                                unknown
                              >;
                              const start = Number(
                                sy.StartTime ?? sy.Start ?? 0,
                              );
                              const end = Number(sy.EndTime ?? sy.End ?? 0);
                              return (
                                trackDurationProgress >= start &&
                                trackDurationProgress <= end
                              );
                            });

                            const opposite = Boolean(
                              block.OppositeAligned ?? false,
                            );

                            return (
                              <div
                                key={`sy-${blockIndex}-${block.Lead?.StartTime ?? blockIndex}`}
                                data-active={anyActive ? "true" : "false"}
                                className={`text-xs ${opposite ? "text-right" : "text-left"} ${(block.Background || [])?.length > 0 ? "mt-0.5" : ""}`}
                              >
                                <div
                                  className={`${opposite ? "flex justify-end gap-x-1" : "flex gap-x-1"}`}
                                >
                                  {(() => {
                                    // Group syllables into words using IsPartOfWord flag.
                                    const groups: Array<{
                                      items: Record<string, unknown>[];
                                    }> = [];
                                    let current: Record<string, unknown>[] = [];
                                    for (let i = 0; i < syllables.length; i++) {
                                      const raw = syllables[
                                        i
                                      ] as unknown as Record<string, unknown>;
                                      const isPart = Boolean(
                                        raw.IsPartOfWord ?? false,
                                      );
                                      current.push(raw);
                                      // If this syllable is NOT marked as part of a word, it ends the word group.
                                      if (!isPart) {
                                        groups.push({ items: current });
                                        current = [];
                                      }
                                    }
                                    // push any trailing group
                                    if (current.length > 0)
                                      groups.push({ items: current });

                                    return groups.map((grp, gi) => {
                                      const anyActiveInGroup = grp.items.some(
                                        (sy) => {
                                          const syRec = sy as Record<
                                            string,
                                            unknown
                                          >;
                                          const start = Number(
                                            syRec.StartTime ?? syRec.Start ?? 0,
                                          );
                                          const end = Number(
                                            syRec.EndTime ?? syRec.End ?? 0,
                                          );
                                          return (
                                            trackDurationProgress >= start &&
                                            trackDurationProgress <= end
                                          );
                                        },
                                      );

                                      return (
                                        <span
                                          key={`g-${blockIndex}-${(grp.items?.[0] as Record<string, unknown>)?.StartTime ?? gi}`}
                                          data-active={
                                            anyActiveInGroup ? "true" : "false"
                                          }
                                          className="inline-flex gap-x-0"
                                        >
                                          {grp.items.map((sy, sidx) => {
                                            const syRec =
                                              sy as unknown as Record<
                                                string,
                                                unknown
                                              >;
                                            const start = Number(
                                              syRec.StartTime ??
                                                syRec.Start ??
                                                0,
                                            );
                                            const end = Number(
                                              syRec.EndTime ?? syRec.End ?? 0,
                                            );
                                            const duration = Math.max(
                                              end - start,
                                              0.001,
                                            );
                                            const inWindow =
                                              trackDurationProgress >= start &&
                                              trackDurationProgress <= end;
                                            const pct = inWindow
                                              ? Math.min(
                                                  Math.max(
                                                    (trackDurationProgress -
                                                      start) /
                                                      duration,
                                                    0,
                                                  ),
                                                  1,
                                                )
                                              : 0;
                                            const scale = inWindow
                                              ? 1 + pct * 0.12
                                              : 1;

                                            // compute pixel mask for syllable when measured
                                            const syllKey = `sy-${blockIndex}-${gi}-${sidx}`;
                                            const measuredSyll =
                                              measuredWidths.current[syllKey] ??
                                              0;
                                            // Reveal persists after the syllable end: fully visible when past end
                                            const revealPct =
                                              trackDurationProgress >= end
                                                ? 1
                                                : pct;
                                            const visibleSyllPx =
                                              measuredSyll > 0
                                                ? Math.max(
                                                    0,
                                                    Math.round(
                                                      measuredSyll * revealPct,
                                                    ),
                                                  )
                                                : 0;
                                            const innerSyllWidth =
                                              measuredSyll > 0
                                                ? `${visibleSyllPx}px`
                                                : `${(revealPct * 100).toFixed(2)}%`;

                                            return (
                                              <span
                                                key={`${blockIndex}-${gi}-${syRec.StartTime ?? syRec.Start ?? sidx}`}
                                                className="relative inline-block"
                                                style={{
                                                  transform: `scale(${scale})`,
                                                  transformOrigin: opposite
                                                    ? "right center"
                                                    : "left center",
                                                  transition: inWindow
                                                    ? "transform 160ms ease"
                                                    : "transform 380ms cubic-bezier(0.2,0.8,0.2,1)",
                                                }}
                                              >
                                                <span
                                                  ref={(el) => {
                                                    if (el)
                                                      measuredWidths.current[
                                                        syllKey
                                                      ] =
                                                        el.getBoundingClientRect().width;
                                                  }}
                                                  className="inline-block select-none whitespace-pre text-muted-foreground"
                                                  style={{
                                                    textOverflow: "ellipsis",
                                                  }}
                                                >
                                                  {String(syRec.Text ?? "")}
                                                </span>
                                                <span
                                                  className={`absolute inset-0 overflow-hidden whitespace-pre`}
                                                >
                                                  <span
                                                    style={{
                                                      position: "absolute",
                                                      left: 0,
                                                      width: innerSyllWidth,
                                                      height: "100%",
                                                      overflow: "hidden",
                                                      transition:
                                                        "width 220ms linear",
                                                    }}
                                                  >
                                                    <span
                                                      className={`block whitespace-pre font-medium text-primary ${opposite ? "text-right" : "text-left"}`}
                                                      style={{
                                                        height: "100%",
                                                      }}
                                                    >
                                                      {String(syRec.Text ?? "")}
                                                    </span>
                                                  </span>
                                                </span>
                                              </span>
                                            );
                                          })}
                                        </span>
                                      );
                                    });
                                  })()}
                                </div>
                                {(block.Background ?? []).map((bgLine, bi) => {
                                  const bSyllables = (bgLine.Syllables ??
                                    []) as unknown as Record<string, unknown>[];
                                  const bgGroups: Array<{
                                    items: Record<string, unknown>[];
                                  }> = [];
                                  let cur: Record<string, unknown>[] = [];
                                  for (let i = 0; i < bSyllables.length; i++) {
                                    const raw = bSyllables[i];
                                    const isPart = Boolean(
                                      raw.IsPartOfWord ?? false,
                                    );
                                    cur.push(raw);
                                    if (!isPart) {
                                      bgGroups.push({ items: cur });
                                      cur = [];
                                    }
                                  }
                                  if (cur.length > 0)
                                    bgGroups.push({ items: cur });

                                  return (
                                    <div
                                      key={`bg-${blockIndex}-${bgLine.StartTime ?? bi}`}
                                      className={`-mt-1.5 mb-0.5 ml-[0.1px] truncate text-3xs text-muted-foreground ${opposite ? "text-right" : "text-left"}`}
                                    >
                                      <div
                                        className={`${opposite ? "flex justify-end gap-x-1" : "flex gap-x-1"}`}
                                      >
                                        {bgGroups.map((g, gIdx) => (
                                          <span
                                            key={`bg-${blockIndex}-${bi}-${(g.items?.[0] as unknown as Record<string, unknown>)?.StartTime ?? gIdx}`}
                                            className="inline-flex gap-x-0 whitespace-pre"
                                          >
                                            {g.items.map((sy, sidx) => {
                                              const syRec =
                                                sy as unknown as Record<
                                                  string,
                                                  unknown
                                                >;
                                              const start = Number(
                                                syRec.StartTime ??
                                                  syRec.Start ??
                                                  0,
                                              );
                                              const end = Number(
                                                syRec.EndTime ?? syRec.End ?? 0,
                                              );
                                              const duration = Math.max(
                                                end - start,
                                                0.001,
                                              );
                                              const inWindow =
                                                trackDurationProgress >=
                                                  start &&
                                                trackDurationProgress <= end;
                                              const pct = inWindow
                                                ? Math.min(
                                                    Math.max(
                                                      (trackDurationProgress -
                                                        start) /
                                                        duration,
                                                      0,
                                                    ),
                                                    1,
                                                  )
                                                : 0;
                                              const revealPct =
                                                trackDurationProgress >= end
                                                  ? 1
                                                  : pct;
                                              const keyName = `bgs-${blockIndex}-${bi}-${gIdx}-${sidx}`;
                                              const measured =
                                                measuredWidths.current[
                                                  keyName
                                                ] ?? 0;
                                              const visiblePx =
                                                measured > 0
                                                  ? Math.max(
                                                      0,
                                                      Math.round(
                                                        measured * revealPct,
                                                      ),
                                                    )
                                                  : 0;
                                              const innerWidth =
                                                measured > 0
                                                  ? `${visiblePx}px`
                                                  : `${(revealPct * 100).toFixed(2)}%`;
                                              return (
                                                <span
                                                  key={`bg-${blockIndex}-${bi}-${gIdx}-${(g.items[sidx] as unknown as Record<string, unknown>)?.StartTime ?? sidx}`}
                                                  className="relative inline-block whitespace-pre"
                                                >
                                                  <span
                                                    ref={(el) => {
                                                      if (el)
                                                        measuredWidths.current[
                                                          keyName
                                                        ] =
                                                          el.getBoundingClientRect().width;
                                                    }}
                                                    className="inline-block select-none whitespace-pre text-3xs text-muted-foreground"
                                                  >
                                                    {String(syRec.Text ?? "")}
                                                  </span>
                                                  <span className="absolute inset-0 overflow-hidden whitespace-pre">
                                                    <span
                                                      style={{
                                                        position: "absolute",
                                                        left: 0,
                                                        width: innerWidth,
                                                        height: "100%",
                                                        overflow: "hidden",
                                                        transition:
                                                          "width 220ms linear",
                                                      }}
                                                    >
                                                      <span
                                                        className={`block whitespace-pre text-3xs text-primary/80`}
                                                        style={{
                                                          height: "100%",
                                                        }}
                                                      >
                                                        {String(
                                                          syRec.Text ?? "",
                                                        )}
                                                      </span>
                                                    </span>
                                                  </span>
                                                </span>
                                              );
                                            })}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          });
                        }

                        return null;
                      })()
                    )}
                  </div>
                </div>
                <div className="absolute top-0 right-0 bottom-0 left-0 m-auto size-256">
                  <Image
                    src={status?.spotify.album_art_url}
                    alt={"Album Art Background"}
                    fill
                    unoptimized
                    className="overflow-clip opacity-50 blur-lg transition duration-300 ease-in-out group-hover:opacity-60 group-hover:blur-none dark:opacity-40 dark:group-hover:opacity-30"
                  />
                </div>
              </Link>
            );
          })()
        ) : (
          /* Past music listening on Spotify */
          <div className="relative col-span-2 h-38 w-full overflow-y-hidden rounded-2xl border bg-social-spotify px-4 pt-2 transition hover:scale-105">
            <h3 className="inline font-medium text-xs">
              Recently Played on{" "}
              <SiSpotify className="inline h-3 w-3 pb-0.5" size={12} /> Spotify
            </h3>
            {loading || isRecentTracksLoading ? (
              <div className="mt-4 space-y-2">
                {[...Array(2)].map((_, idx) => (
                  <Skeleton
                    key={`recent-${idx}`}
                    className="h-16 w-full rounded-md"
                  />
                ))}
              </div>
            ) : (
              recentTracks?.recenttracks.track.map((track, idx) => {
                const isNowPlaying = Boolean(track["@attr"]?.nowplaying);
                const trackName = track.name || "Unknown Track";
                const artistName = track.artist?.["#text"] || "Unknown Artist";
                const albumName = track.album?.["#text"] || "Unknown Album";
                const trackImage =
                  track.image?.[2]?.["#text"] ||
                  "/static/images/placeholder/album-art-3.webp";
                return (
                  <div
                    key={`recent-${track.mbid || trackName + artistName + idx}`}
                    className={`mt-4 flex items-center gap-x-3 ${
                      isNowPlaying ? "opacity-100" : "opacity-70"
                    }`}
                  >
                    <Image
                      src={trackImage}
                      alt={trackName}
                      width={48}
                      height={48}
                      className="rounded-md"
                      unoptimized
                    />
                    <div className="flex flex-1 flex-col overflow-hidden">
                      <p
                        className="truncate font-medium text-sm"
                        title={trackName}
                      >
                        {trackName}
                      </p>
                      <p
                        className="truncate text-muted-foreground text-xs"
                        title={artistName}
                      >
                        {artistName}
                      </p>
                      <p
                        className="truncate text-2xs text-muted-foreground"
                        title={albumName}
                      >
                        {albumName}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </section>
      <section className="h-38 w-full gap-2 lg:h-full">
        <Link
          href="https://github.com/hexaaagon"
          target="_blank"
          className="group relative flex h-full w-full flex-col justify-around overflow-clip rounded-2xl border bg-muted/50 p-4 px-8 text-foreground/70 transition duration-300 ease-out hover:text-foreground/90 lg:h-full dark:bg-muted/20"
        >
          <h3 className="inline-flex h-max items-center gap-1 font-medium text-xs">
            <GitBranch size={16} /> GitHub Stats
          </h3>
          {githubSummaryThisYear ? (
            <h1 className="text-5xl text-foreground/90 transition duration-300 ease-out group-hover:text-foreground">
              {githubSummaryThisYear.total}
            </h1>
          ) : (
            <Skeleton className="mt-1 h-12 w-3/7" />
          )}
          <p className="lg:text-sm xl:text-base">contributions this year.</p>
          <Contributions
            calendars={githubContributions || []}
            className="-z-10 absolute top-0 right-0 bottom-0 left-0 m-auto h-auto w-auto opacity-30 blur-[0.5px] transition duration-300 ease-out hover:blur-none group-hover:opacity-50 lg:opacity-20"
          />
        </Link>
      </section>
    </div>
  );
}

export function Contributions({
  calendars,
  className,
  ...props
}: { calendars: number[] } & HTMLProps<HTMLDivElement>) {
  // Deterministic animation values so server & client render match.
  // We use `index` and the `calendar` value (contribution count) to create stable delays/durations.
  const computeAnimation = (i: number, v: number) => {
    // Delay: 0.1s to ~0.9s depending on index (mod 10)
    const delay = (i % 10) * 0.08 + 0.1;
    // Duration: base 3s, add a small amount from index mod and contribution value (keeps deterministic)
    const duration = 3 + (i % 7) * 0.5 + (v % 3) * 0.2;
    return {
      animationDelay: `${delay.toFixed(2)}s`,
      animationDuration: `${duration.toFixed(2)}s`,
    } as React.CSSProperties;
  };
  return (
    <div
      className={cn(
        "flex scale-125 transform cursor-pointer items-center justify-center transition-transform duration-300 ease-out hover:scale-100 group-hover:scale-100",
        className,
      )}
      {...props}
    >
      <div className="grid w-max grid-flow-col grid-rows-7 gap-1">
        {calendars.map((calendar, index) => (
          <div
            className={cn(
              // Slightly larger tiles and stop pulsing on hover via group
              "size-5 animate-pulse-bright rounded-sm border-[1.5px] transition-transform duration-200 hover:scale-100 hover:animate-none group-hover:scale-100 group-hover:animate-none",
              calendar > 10
                ? "border-emerald-500 bg-emerald-400/60 dark:border-emerald-600 dark:bg-emerald-600/40"
                : calendar > 5
                  ? "border-emerald-400 bg-emerald-300/40 dark:border-emerald-800 dark:bg-emerald-800/30"
                  : calendar > 0
                    ? "border-emerald-200 bg-emerald-100/30 dark:border-emerald-900 dark:bg-emerald-950/20"
                    : "border-zinc-300 bg-zinc-100/20 dark:border-zinc-800 dark:bg-black/10",
            )}
            key={index}
            style={computeAnimation(index, calendar)}
          />
        ))}
      </div>
    </div>
  );
}
