import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware } from "better-auth/api";

import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema/auth";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    },
  },
  plugins: [nextCookies()],
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const newSession = ctx.context.newSession;

      if (!newSession) {
        return;
      }

      // Store auth event data in response headers for client-side tracking
      const { user } = newSession;
      const authEvent: Record<string, string> = {
        userId: user.id,
        userEmail: user.email || "",
        userName: user.name || "",
        userCreatedAt: user.createdAt?.toString() || "",
      };

      // Determine event type based on path
      if (ctx.path === "/sign-up/email") {
        authEvent.eventType = "user_signed_up";
        authEvent.method = "email";
      } else if (ctx.path === "/sign-in/email") {
        authEvent.eventType = "user_signed_in";
        authEvent.method = "email";
      } else if (ctx.path.startsWith("/callback/github")) {
        const isNewUser =
          newSession.session.createdAt.getTime() === user.createdAt.getTime();
        authEvent.eventType = isNewUser ? "user_signed_up" : "user_signed_in";
        authEvent.method = "github";
      } else if (ctx.path.startsWith("/callback/discord")) {
        const isNewUser =
          newSession.session.createdAt.getTime() === user.createdAt.getTime();
        authEvent.eventType = isNewUser ? "user_signed_up" : "user_signed_in";
        authEvent.method = "discord";
      }

      // Set custom header for client to read
      if (authEvent.eventType && ctx.context.responseHeaders) {
        ctx.context.responseHeaders.set(
          "X-Auth-Event",
          JSON.stringify(authEvent),
        );
      }
    }),
    before: createAuthMiddleware(async (ctx) => {
      // Store request path for error tracking
      if (ctx.context.responseHeaders) {
        ctx.context.responseHeaders.set("X-Auth-Path", ctx.path);
      }
    }),
  },
});
