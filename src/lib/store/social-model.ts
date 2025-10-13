import { type Action, action, persist, type Thunk, thunk } from "easy-peasy";
import {
  type DiscordResponse,
  isSpotifySessionData,
  isSpotifyStatusData,
  isSpotifyTrackData,
  type SpotifyLyricsData,
  type SpotifySessionData,
} from "@/shared/types/social";
import { SocialWebsocket } from "../websocket/social";
import store from "./social";

export type SpotifyState = Omit<SpotifySessionData, "type">;

export interface StoreModel {
  discord: DiscordResponse | null;
  spotify: SpotifyState | null;
  lyrics: SpotifyLyricsData | null;
  websocketInstance: SocialWebsocket | null;

  setDiscord: Action<this, DiscordResponse>;
  setSpotify: Action<this, SpotifyState>;
  setLyrics: Action<this, SpotifyLyricsData>;
  setWebsocketInstance: Action<this, SocialWebsocket | null>;

  init: Thunk<this, void>;
  socialWS: Thunk<this, void>;
  cleanup: Thunk<this, void>;
}

const model: StoreModel = persist(
  {
    discord: null,
    spotify: null,
    lyrics: null,
    websocketInstance: null,

    setDiscord: action((state, payload) => {
      state.discord = payload;
    }),
    setSpotify: action((state, payload) => {
      state.spotify = payload;
    }),
    setLyrics: action((state, payload) => {
      state.lyrics = payload;
    }),
    setWebsocketInstance: action((state, payload) => {
      state.websocketInstance = payload;
    }),

    init: thunk(async (actions) => {
      actions.socialWS();
    }),
    cleanup: thunk(async (actions, _payload, { getState }) => {
      const state = getState();
      if (state.websocketInstance) {
        state.websocketInstance.close();
        actions.setWebsocketInstance(null);
      }
    }),
    socialWS: thunk(async (actions, _payload, { getState }) => {
      const currentState = getState();
      if (currentState.websocketInstance) {
        currentState.websocketInstance.close();
      }

      const social = new SocialWebsocket({
        userId: "465454937267240962",
      });

      actions.setWebsocketInstance(social);

      social.on("discord", (data) => {
        actions.setDiscord(data);
      });
      social.on("spotify", ({ type: _, ...data }) => {
        if (isSpotifySessionData(data.data)) {
          const { type, ...sessionData } = data.data;
          actions.setSpotify(sessionData);
        } else if (isSpotifyTrackData(data.data)) {
          const { type, ...trackData } = data.data;

          const state = store.getState();
          if (!state.spotify) return;

          actions.setSpotify({
            ...state.spotify,
            ...trackData,
          });
        }
        if (isSpotifyStatusData(data.data)) {
          const state = store.getState();
          if (!state.spotify) return;

          actions.setSpotify({
            ...state.spotify,
            spotify: {
              ...state.spotify.spotify,
              status: {
                ...state.spotify.spotify.status,
                ...data.data.spotify.status,
              } as any,
            },
          });
        } else {
          console.warn("Unknown Spotify data type received:", data.data);
        }
      });
      social.on("spotify-lyrics", (data) => {
        actions.setLyrics(data);
      });

      return social;
    }),
  },
  {
    allow: ["discord", "spotify", "lyrics"],
  },
);

export default model;
