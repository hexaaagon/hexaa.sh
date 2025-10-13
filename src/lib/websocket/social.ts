import {
  type ClientWebSocketResponse,
  type ConnectionResponse,
  type DiscordResponse,
  type ErrorResponse,
  isSpotifyLyricsData,
  type SpotifyLyricsData,
  type SpotifyResponse,
} from "@/shared/types/social";
import { EventEmitter } from "../helpers";

export interface SocialWebsocketOptions {
  userId: string;
  heartbeatInterval?: number;
  socketUrl?: string;
}

export class SocialWebsocket extends EventEmitter<{
  connected: [ConnectionResponse];
  error: [ErrorResponse];
  discord: [DiscordResponse];
  spotify: [SpotifyResponse];
  "spotify-lyrics": [SpotifyLyricsData];
}> {
  private socket: WebSocket | null = null;
  private heartbeat: NodeJS.Timeout | null = null;
  private closed: boolean = false;
  private visibilityTimeout: NodeJS.Timeout | null = null;
  private visibilityHandler: (() => void) | null = null;
  public loading: boolean;
  public readonly userId: string;
  public readonly heartbeatInterval: number;
  public readonly socketUrl: string;

  constructor(options: SocialWebsocketOptions) {
    super();

    this.loading = true;
    this.userId = options.userId;
    this.heartbeatInterval = options.heartbeatInterval || 30_000;
    this.socketUrl = options.socketUrl || `wss://api.hexaa.sh/personal/social`;

    this.connect();
    this.setupVisibilityHandling();
  }

  public close() {
    this.closed = true;
    this.cleanupVisibilityHandling();
    this.disconnect();
  }

  private connect() {
    if (this.socket?.readyState === WebSocket.OPEN) return;

    this.socket = new WebSocket(this.socketUrl);
    this.socketConnect();
  }

  private disconnect() {
    if (this.heartbeat) {
      clearInterval(this.heartbeat);
      this.heartbeat = null;
    }

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  private setupVisibilityHandling() {
    if (typeof document === "undefined") return; // SSR safety

    this.visibilityHandler = () => {
      if (document.visibilityState === "hidden") {
        this.visibilityTimeout = setTimeout(() => {
          if (!this.closed && document.visibilityState === "hidden") {
            console.log("Disconnecting websocket after 30s of inactivity");
            this.disconnect();
          }
        }, 30000);
      } else if (document.visibilityState === "visible") {
        if (this.visibilityTimeout) {
          clearTimeout(this.visibilityTimeout);
          this.visibilityTimeout = null;
        }

        if (
          !this.closed &&
          (!this.socket || this.socket.readyState !== WebSocket.OPEN)
        ) {
          console.log("Reconnecting websocket on tab focus");
          this.connect();
        }
      }
    };

    document.addEventListener("visibilitychange", this.visibilityHandler);
  }

  private cleanupVisibilityHandling() {
    if (this.visibilityTimeout) {
      clearTimeout(this.visibilityTimeout);
      this.visibilityTimeout = null;
    }

    if (this.visibilityHandler && typeof document !== "undefined") {
      document.removeEventListener("visibilitychange", this.visibilityHandler);
      this.visibilityHandler = null;
    }
  }

  private socketConnect() {
    if (!this.socket) return;

    this.socket.addEventListener("open", () => {
      if (!this.socket) return;

      this.heartbeat = setInterval(() => {
        if (this.socket?.readyState === WebSocket.OPEN) {
          this.socket.send(
            JSON.stringify({
              type: "heartbeat",
            }),
          );
        }
      }, this.heartbeatInterval);
    });

    this.socket.addEventListener("message", (event: MessageEvent<string>) => {
      const socketData: ClientWebSocketResponse = JSON.parse(event.data);

      switch (socketData.type) {
        case "connected":
          this.emit("connected", socketData as ConnectionResponse);
          break;
        case "error":
          this.emit("error", socketData as ErrorResponse);
          break;
        case "discord":
          this.emit("discord", socketData as DiscordResponse);
          break;
        case "spotify":
          if (isSpotifyLyricsData(socketData.data)) {
            this.emit("spotify-lyrics", socketData.data as SpotifyLyricsData);
          } else {
            this.emit("spotify", socketData as SpotifyResponse);
          }
          break;
        default:
          // Optionally handle unknown types
          break;
      }
      this.loading = false;
    });

    this.socket.addEventListener("close", () => {
      if (!this.closed) {
        if (
          typeof document === "undefined" ||
          document.visibilityState === "visible"
        ) {
          setTimeout(() => this.connect(), 1000);
        }
      }
    });

    this.socket.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
    });
  }
}
