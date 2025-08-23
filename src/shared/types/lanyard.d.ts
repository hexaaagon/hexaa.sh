export type ExtendedLanyardData = Omit<LanyardData, "spotify"> & {
  discord_user: {
    avatar_url: string;
    avatar_decoration_data: {
      decoration_url?: string;
    } | null;
    primary_guild: {
      icon_url: string;
    } | null;
  };
  spotify: {
    timestamps: {
      duration: number;
    };
  } | null;
};

export type LanyardData = {
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
    timestamps?: {
      start?: number;
      end?: number;
    };
    sync_id?: string;
    session_id?: string;
    party?: {
      id: string;
      size?: [number, number];
    };
    details?: string;
    buttons?: string[];
    assets?: {
      large_text: string;
      large_image: string;
      small_text?: string;
      small_image?: string;
    };
  }>;
  discord_status: "online" | "idle" | "dnd" | "offline";
  active_on_discord_web: boolean;
  active_on_discord_mobile: boolean;
  active_on_discord_desktop: boolean;
  active_on_discord_embedded: boolean;
} & (
  | {
      discord_status: {
        discriminator: "0";
        bot: false;
      };
    }
  | {
      discord_status: {
        discriminator: string;
        bot: true;
      };
    }
) &
  SpotifyData;

export type SpotifyData =
  | {
      listening_to_spotify: true;
      spotify: {
        track_id: string;
        timestamps: {
          start: number;
          end: number;
        };
        song: string;
        artist: string;
        album_art_url: string;
        album: string;
      };
    }
  | {
      listening_to_spotify: false;
      spotify: null;
    };
