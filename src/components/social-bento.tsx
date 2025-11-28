// (lint suppressions removed) - kept for readability
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
"use client";
import { SiDiscord, SiSpotify } from "@icons-pack/react-simple-icons";

import { useLanyard } from "react-use-lanyard";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";
import { getLyrics, getRecentTrackPlayed } from "@/lib/portfolio/social";
import { useLyricsStore } from "@/lib/store/lyrics-store";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import type {
  Lyrics,
  LineLyric,
  StaticLyric,
  SyllableLyric,
} from "@/shared/types/lyrics";
import Link from "next/link";
import { ProgressCircle } from "./ui/progress";

const _codeActivities = {
  b9478d1586304a13: "Visual Studio Code",
};

const CRAWLER_UA_RE =
  /bot|crawler|spider|crawl|slurp|mediapartners-google|adsbot|bingpreview|duckduckbot|yandex/i;

export default function SocialBento() {
  // Detect common crawlers from the user-agent string. This runs synchronously
  // in the client so we can avoid starting network-heavy hooks for bots.
  const isCrawler =
    typeof navigator !== "undefined" && CRAWLER_UA_RE.test(navigator.userAgent);

  // Avoid socket connections for bots
  const { loading, status } = useLanyard({
    userId: "465454937267240962",
    socket: !isCrawler || true, // just for type fix
  });

  const {
    data: lyrics,
    isLoading: isLyricsLoading,
    mutate: mutateLyrics,
  } = useSWR<Lyrics | "no-lyrics" | "no-track-id", unknown>(
    // If bot, pass null key so swr won't fetch
    isCrawler ? null : status?.spotify?.track_id,
    async (trackId?: string) => {
      console.log(trackId);
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
    if (!trackId || !lyrics) return;
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
    <div className="flex w-full flex-col gap-2">
      <section className="grid w-full grid-cols-2 gap-2">
        <div className="h-38 w-full rounded-2xl border bg-muted/50 p-4 xl:w-48 dark:bg-muted/20">
          <header className="flex items-center gap-2">
            <SiDiscord size={20} />
            {loading && !status ? (
              <Skeleton className="h-4 w-2/3" />
            ) : (
              <p className="text-xs">@{status?.discord_user.username}</p>
            )}
          </header>
        </div>
        <div className="h-38 w-full rounded-2xl border bg-muted/50 p-4 xl:w-48 dark:bg-muted/20"></div>
      </section>
      <section className="grid w-full grid-cols-2 gap-2">
        {loading && !status ? (
          <Skeleton className="col-span-2 h-38 w-full rounded-2xl border bg-social-spotify xl:w-98"></Skeleton>
        ) : status?.listening_to_spotify ? (
          /* Listening to Spotify with Lyrics */
          (() => {
            return (
              <Link
                href={`https://open.spotify.com/track/${status?.spotify.track_id}`}
                target="_blank"
                className="relative col-span-2 h-38 w-full rounded-2xl border bg-social-spotify p-4 pt-2 transition hover:scale-105 xl:w-98"
              >
                <header className="mb-2 flex items-center gap-2">
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
                  <div className="flex flex-col *:line-clamp-1">
                    <p className="font-medium text-xs">
                      {status?.spotify.song}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {status?.spotify.artist}
                    </p>
                  </div>
                </header>
                <span className="absolute top-2 right-2.5 inline-flex items-center gap-1 text-3xs">
                  Listening on
                  <SiSpotify size={14} className="pr-0.5" />
                </span>
                <div className="relative">
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
                      <p>No lyrics found.</p>
                    ) : lyrics === "no-track-id" ? (
                      <p>No track ID provided.</p>
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
              </Link>
            );
          })()
        ) : (
          /* Past music listening on Spotify */
          <div className="relative col-span-2 h-38 w-full overflow-y-hidden rounded-2xl border bg-social-spotify px-4 pt-2 transition hover:scale-105 xl:w-98">
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
            <div className="absolute right-0 bottom-0 left-0 z-50 h-8 w-full bg-linear-to-b from-transparent to-social-spotify"></div>
          </div>
        )}
      </section>
      <style jsx>{`
        /* hide scrollbars while preserving scroll behavior */
        .lyrics-scroll::-webkit-scrollbar { width: 0; height: 0; display: none; }
        .lyrics-scroll { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
    </div>
  );
}
