import { ExtendedLanyardData, LanyardData } from "@/shared/types/lanyard";
import { EventEmitter } from "./helpers";

export interface LanyardWebsocketOptions {
  userId: string;
  heartbeatInterval?: number;
  socketUrl?: string;
}

export class LanyardWebsocket extends EventEmitter {
  private socket: WebSocket;
  private heartbeat: NodeJS.Timeout;
  private closed: boolean = false;
  public loading: boolean;
  public readonly userId: string;
  public readonly heartbeatInterval: number;
  public readonly socketUrl: string;

  constructor(options: LanyardWebsocketOptions) {
    super();

    this.loading = true;
    this.userId = options.userId;
    this.heartbeatInterval = options.heartbeatInterval || 30_000;
    this.socketUrl = options.socketUrl || `wss://api.lanyard.rest/socket`;

    this.socket = new WebSocket(this.socketUrl);
    this.heartbeat = setInterval(() => {
      this.heartbeat = setInterval(() => {
        this.socket.send(
          JSON.stringify({
            op: 3,
          }),
        );
      }, this.heartbeatInterval);
    }, this.heartbeatInterval);

    this.socketConnnect();
  }

  public close() {
    clearInterval(this.heartbeat);
    this.socket.close();
    this.closed = true;
  }

  private socketConnnect() {
    this.socket = new WebSocket(this.socketUrl);

    this.socket.addEventListener("open", () => {
      this.socket.send(
        JSON.stringify({
          op: 2,
          d: {
            subscribe_to_id: this.userId,
          },
        }),
      );
    });

    this.socket.addEventListener("message", (event: MessageEvent<string>) => {
      const socketData: {
        t: "INIT_STATE" | "PRESENCE_UPDATE";
        d: LanyardData;
      } = JSON.parse(event.data);

      if (socketData.t === "INIT_STATE" || socketData.t === "PRESENCE_UPDATE") {
        this.emit("update", this.formatData(socketData.d));
        this.loading = false;
      }
    });

    this.socket.addEventListener("close", () => {
      if (!this.closed) this.socketConnnect();
    });
  }

  private formatData(
    data: LanyardData,
    options?: {
      size?: {
        avatar?: number;
        guild_icon?: number;
      };
    },
  ): ExtendedLanyardData {
    return {
      ...data,
      discord_user: {
        ...data.discord_user,
        avatar_url: `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png?size=${options?.size?.avatar || 256}`,
        avatar_decoration_data: data.discord_user.avatar_decoration_data
          ? {
              ...data.discord_user.avatar_decoration_data,
              decoration_url: `https://cdn.discordapp.com/assets/${data.discord_user.avatar_decoration_data.asset}?size=${options?.size?.avatar || 256}&passthrough=true`,
            }
          : data.discord_user.avatar_decoration_data,
        primary_guild: data.discord_user.primary_guild
          ? {
              ...data.discord_user.primary_guild,
              icon_url: `https://cdn.discordapp.com/clan-badges/${data.discord_user.primary_guild.identity_guild_id}/${data.discord_user.primary_guild.badge}.png?size=${options?.size?.guild_icon || 32}`,
            }
          : data.discord_user.primary_guild,
      },
      spotify: data.listening_to_spotify
        ? {
            ...data.spotify,
            timestamps: {
              ...data.spotify.timestamps,
              duration:
                (data.spotify.timestamps.end - data.spotify.timestamps.start) /
                1000,
            },
          }
        : null,
    };
  }
}
