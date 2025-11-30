import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Lyrics } from "@/shared/types/lyrics";

type LyricsPayload = Lyrics | "no-lyrics" | "no-track-id";

interface LyricsState {
  cache: Record<string, LyricsPayload>;
  // recency list (most-recent first)
  order: string[];
  set: (trackId: string, payload: LyricsPayload) => void;
  remove: (trackId: string) => void;
  clear: () => void;
}

export const useLyricsStore = create<LyricsState>()(
  persist(
    (set) => ({
      cache: {},
      order: [],
      set: (trackId: string, payload: LyricsPayload) =>
        set((s) => {
          const MAX = 5;
          // copy cache
          const next = { ...s.cache, [trackId]: payload };
          // update recency order (unshift trackId as most recent)
          const curOrder = s.order ?? [];
          const nextOrder = [trackId, ...curOrder.filter((t) => t !== trackId)];
          // evict oldest if > MAX
          while (nextOrder.length > MAX) {
            const evict = nextOrder.pop();
            if (evict !== undefined) delete next[evict];
          }
          return { cache: next, order: nextOrder };
        }),
      remove: (trackId: string) =>
        set((s) => {
          const next = { ...s.cache };
          delete next[trackId];
          const curOrder = s.order ?? [];
          const nextOrder = curOrder.filter((t) => t !== trackId);
          return { cache: next, order: nextOrder };
        }),
      clear: () => set({ cache: {}, order: [] }),
    }),
    {
      name: "lyrics-storage-v1",
      // keep everything, lyrics can be large; leaving default options
    },
  ),
);

export default useLyricsStore;
