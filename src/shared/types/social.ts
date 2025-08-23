// Client-side WebSocket types for personal API
// All types are redeclared here for complete client-side independence

// ========================= REDECLARED SPOTIFY TYPES =========================

export type ProcessedSpotifyData =
  | {
      track: {
        id: string;
        url: string;
        title: string;
        artists: string;
        album: {
          name: string;
          cover: string;
        };
        duration: number;
      };
      status: {
        progress: number;
        timestamp: {
          start: number;
          end: number;
        };
      } & (
        | {
            isPlaying: true;
            isPaused: false;
          }
        | {
            isPlaying: false;
            isPaused: true;
          }
      );
    }
  | {
      track: null;
      status: {
        isPlaying: false;
        lastPlayed: number;
      };
    };

// ========================= REDECLARED LANYARD TYPES =========================

export interface LanyardData {
  kv: {
    [key: string]: any;
  };
  discord_user: {
    id: string;
    username: string;
    clan: null;
    primary_guild: {
      tag: string;
      identity_guild_id: string;
      badge: string;
      identity_enabled: boolean;
    } | null;
    avatar_decoration_data: {
      sku_id: string;
      asset: string;
      expires_at: string | null;
    };
    collectibles: {
      nameplate: {
        label: string;
        sku_id: string;
        asset: string;
        expires_at: string | null;
        palette: string;
      };
    };
    avatar: string;
    global_name: string;
    display_name: string;
    public_flags: number;
  };
  activities: Array<{
    type: number;
    state: string;
    name: string;
    id: string;
    flags?: number;
    emoji?: {
      name: string;
      id?: string | null;
      animated?: boolean | null;
    };
    created_at: number;
    application_id?: string;
    details?: string;
    assets?: {
      large_image?: string;
      large_text?: string;
      small_image?: string;
      small_text?: string;
    };
    timestamps?: {
      start?: number;
      end?: number;
    };
    party?: {
      id?: string;
      size?: [number, number];
    };
    secrets?: {
      join?: string;
      spectate?: string;
      match?: string;
    };
    instance?: boolean;
    sync_id?: string;
    session_id?: string;
    buttons?: string[];
  }>;
  discord_status: "online" | "idle" | "dnd" | "offline";
  active_on_discord_web: boolean;
  active_on_discord_desktop: boolean;
  active_on_discord_mobile: boolean;
}

// ========================= REDECLARED LASTFM TYPES =========================

export interface LastfmData {
  totalScrobbles: number;
  artistCount: number;
  albumCount: number;
  trackCount: number;
  avgScrobblesPerDay?: number;
  currentStreak?: number;
  longestStreak?: number;
  scrobblesToday?: number;
  topArtists: Array<{
    name: string;
    playcount: number;
    url: string;
    image?: string;
  }>;
  topAlbums: Array<{
    name: string;
    artist: string;
    playcount: number;
    url: string;
    image?: string;
  }>;
  topTracks: Array<{
    name: string;
    artist: string;
    playcount: number;
    url: string;
    image?: string;
  }>;
  recentTracks: Array<{
    name: string;
    artist: string;
    album?: string;
    url: string;
    image?: string;
    date?: string;
    nowplaying?: boolean;
  }>;
}

export interface LastfmCacheInfo {
  lastFetch: number;
  ttl: number;
  nextFetch: number;
  source: "cache" | "api";
  cacheAge: number;
}

// ========================= REQUEST TYPES =========================

export type ClientWebSocketRequest =
  | HeartbeatRequest
  | DiscordRequest
  | LyricsRequest;

export interface HeartbeatRequest {
  type: "heartbeat";
}

export interface DiscordRequest {
  type: "discord";
}

export interface LyricsRequest {
  type: "lyrics";
  action?: "requestChunk";
  data?: any;
}

// ========================= RESPONSE TYPES =========================

export type ClientWebSocketResponse =
  | ConnectionResponse
  | ErrorResponse
  | SpotifyResponse
  | DiscordResponse;

// Connection establishment response
export interface ConnectionResponse {
  type: "connected";
  heartbeat: number; // Heartbeat interval in milliseconds
}

// Generic error response
export interface ErrorResponse {
  type: "error";
  data: {
    message: string;
    error: string;
    details?: any;
    received?: any;
  };
}

// ========================= SPOTIFY RESPONSES =========================

export interface SpotifyResponse {
  type: "spotify";
  data: SpotifyResponseData;
}

export type SpotifyResponseData =
  | SpotifySessionData
  | SpotifyTrackData
  | SpotifyStatusData
  | SpotifyLyricsData
  | SpotifyErrorData;

// Initial session data with Spotify info and Last.fm stats
export interface SpotifySessionData {
  type: "session";
  spotify: ProcessedSpotifyData;
  stats: LastfmData;
  cache: LastfmCacheInfo;
}

// Track change data
export interface SpotifyTrackData {
  type: "track";
  spotify: ProcessedSpotifyData;
}

// Status update (play/pause) without track change
export interface SpotifyStatusData {
  type: "status";
  spotify: {
    status: ProcessedSpotifyData["status"];
  };
}

// Lyrics data with chunking support
export interface SpotifyLyricsData {
  type: "lyrics";
  lyrics: Lyrics;
  pagination: PaginationInfo;
  meta: {
    trackId: string;
    currentDuration: number;
    totalDuration: number;
    chunked: boolean;
  };
}

// Spotify-related error
export interface SpotifyErrorData {
  type: "error";
  error: string;
  message?: string;
  retryCount?: number;
  trackId?: string;
}

// ========================= DISCORD RESPONSES =========================

export interface DiscordResponse {
  type: "discord";
  data: LanyardData | null;
}

// ========================= LYRICS TYPES =========================

export type LyricType = "vocal";

export interface SyllableDictionary {
  text: string;
  isPartOfWord: boolean;
  startTime: number;
  endTime: number;
}

export interface SyllableLine {
  syllables: Array<SyllableDictionary>;
  startTime: number;
  endTime: number;
}

export interface SyllableLyric {
  type: "syllable";
  content: Array<{
    type: LyricType;
    oppositeAligned: boolean;
    lead: SyllableLine;
    background?: Array<SyllableLine>;
  }>;
}

export interface LineDictionary
  extends Omit<SyllableDictionary, "isPartOfWord"> {
  type: LyricType;
  oppositeAligned: boolean;
}

export interface LineLyric {
  type: "line";
  content: Array<LineDictionary>;
}

export interface StaticLyric {
  type: "static";
  lines: Array<{
    text: string;
  }>;
}

export type Lyrics = {
  startTime: number;
  endTime: number;
} & (SyllableLyric | LineLyric | StaticLyric);

// Cache types
export type CacheType = "LRU" | "REDIS";

export interface CacheHIT {
  rate: "HIT";
  date: Date;
  views: number;
}

export interface CacheMISS {
  rate: "MISS";
  created: boolean;
}

export type LyricsCacheInfo = {
  totalSize: number; // KB
  currentSize: number; // KB
  nextSize: number; // KB
  type: CacheType;
} & (CacheHIT | CacheMISS);

// Pagination types
export interface PaginationInfo {
  lyrics: {
    backward: number;
    current: number;
    future: number;
  };
  cache: LyricsCacheInfo;
  nextFetch: number;
  recommendedNextFetch: number;
  currentIndex?: number; // Index of currently playing line/syllable within the chunk
}

// Simple LyricsChunk for basic client usage (kept for backward compatibility)
export interface LyricsChunk {
  startTime: number;
  endTime: number;
  text: string;
  duration: number;
}

// ========================= UTILITY TYPES =========================

// Union of all possible message types
export type WebSocketMessage = ClientWebSocketRequest | ClientWebSocketResponse;

// Type guards for responses
export function isConnectionResponse(msg: any): msg is ConnectionResponse {
  return msg.type === "connected";
}

export function isErrorResponse(msg: any): msg is ErrorResponse {
  return msg.type === "error";
}

export function isSpotifyResponse(msg: any): msg is SpotifyResponse {
  return msg.type === "spotify";
}

export function isDiscordResponse(msg: any): msg is DiscordResponse {
  return msg.type === "discord";
}

// Type guards for Spotify response data
export function isSpotifySessionData(
  data: SpotifyResponseData,
): data is SpotifySessionData {
  return data.type === "session";
}

export function isSpotifyTrackData(
  data: SpotifyResponseData,
): data is SpotifyTrackData {
  return data.type === "track";
}

export function isSpotifyStatusData(
  data: SpotifyResponseData,
): data is SpotifyStatusData {
  return data.type === "status";
}

export function isSpotifyLyricsData(
  data: SpotifyResponseData,
): data is SpotifyLyricsData {
  return data.type === "lyrics";
}

export function isSpotifyErrorData(
  data: SpotifyResponseData,
): data is SpotifyErrorData {
  return data.type === "error";
}

// ========================= CLIENT HELPER TYPES =========================

// WebSocket connection states
export type WebSocketState =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

// Client-side connection info
export interface ClientConnection {
  state: WebSocketState;
  lastHeartbeat?: Date;
  lastActivity?: Date;
  retryCount?: number;
}

// Event handlers for client-side usage
export interface WebSocketEventHandlers {
  onConnect?: (response: ConnectionResponse) => void;
  onDisconnect?: (event: CloseEvent) => void;
  onError?: (error: ErrorResponse) => void;
  onSpotify?: (data: SpotifyResponseData) => void;
  onDiscord?: (data: LanyardData | null) => void;
  onMessage?: (message: ClientWebSocketResponse) => void;
}
