"use server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { verifyTurnstileToken } from "@/lib/actions/turnstile";

import emojiRegex from "emoji-regex";
import stringLength from "string-length";
import { LRUCache } from "lru-cache";

import { eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  guestbookTable,
  guestbookReactionTable,
} from "@/lib/db/schema/guestbook";
import { user as userTable } from "../db/schema/auth";

// LRU Cache with 5 minute TTL for guestbook messages
const guestbookCache = new LRUCache<string, MessageWithReactions[]>({
  max: 100, // Maximum number of cache entries
  ttl: 1000 * 60 * 5, // 5 minutes in milliseconds
});

// === User Actions === //

export async function submitMessage(
  turnstileToken: string,
  message: string,
  props: { threadId?: string; anonymous?: boolean } = {},
) {
  if (message.trim().length === 0) return "empty-message";
  if (message.length > 1024) return "message-too-long";
  if (message.split("\n").length > 3) return "message-too-many-lines";

  const verified = await verifyTurnstileToken(turnstileToken);
  if (!verified) return "turnstile-failed";

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return "not-authenticated";

  const guestbook: typeof guestbookTable.$inferInsert = {
    userId: session.user.id,
    message: message,
    threadId: props.threadId,
    anonymous: props.anonymous,
  };

  await db.insert(guestbookTable).values(guestbook);

  // Invalidate cache after new message
  guestbookCache.delete("guestbook:messages");

  return "success";
}

export async function editMessage(id: string, message: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return "not-authenticated";

  const oldMessage = await db
    .select()
    .from(guestbookTable)
    .where(eq(guestbookTable.id, id));

  const guestbook: typeof guestbookTable.$inferInsert = {
    userId: session.user.id,
    message: message,
    editHistory:
      oldMessage.length === 0
        ? [
            // add the original message to history
            {
              message: oldMessage[0].message,
              createdAt: oldMessage[0].createdAt,
            },
            {
              message: message,
              createdAt: new Date(),
            },
          ]
        : [
            ...(oldMessage[0].editHistory || []),
            {
              message: message,
              createdAt: new Date(),
            },
          ],
    editedAt: new Date(),
  };

  await db
    .update(guestbookTable)
    .set(guestbook)
    .where(eq(guestbookTable.id, id));

  // Invalidate cache after edit
  guestbookCache.delete("guestbook:messages");

  return "success";
}

export async function reactMessage(
  action: "add" | "remove",
  id: string,
  emoji: string,
  turnstileToken?: string,
) {
  if (action === "add") {
    if (turnstileToken) {
      const verified = await verifyTurnstileToken(turnstileToken);
      if (!verified) return "turnstile-failed";
    } else {
      return "turnstile-failed";
    }
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return "not-authenticated";

  // validate emoji and limit length
  if (!emojiRegex().test(emoji)) return "invalid-emoji";
  if (stringLength(emoji) > 1) return "emoji-too-long";

  const reaction = await db
    .select()
    .from(guestbookReactionTable)
    .where(eq(guestbookReactionTable.guestbookId, id));

  const isEmojiExist = reaction.find((r) => r.emoji === emoji);

  if (action === "add") {
    if (isEmojiExist) {
      if ((isEmojiExist.userIds ?? []).includes(session.user.id)) {
        return "success";
      }

      // add user to existing reaction
      await db
        .update(guestbookReactionTable)
        .set({
          userIds: [...(isEmojiExist.userIds ?? []), session.user.id],
          lastUpdatedAt: new Date(),
        })
        .where(eq(guestbookReactionTable.id, isEmojiExist.id));
    } else {
      // create new reaction
      const newReaction: typeof guestbookReactionTable.$inferInsert = {
        guestbookId: id,
        userIds: [session.user.id],
        emoji: emoji,
      };
      await db.insert(guestbookReactionTable).values(newReaction);
    }
  } else {
    if (isEmojiExist) {
      if (!(isEmojiExist.userIds ?? []).includes(session.user.id)) {
        return "success";
      }

      const updatedUserIds = (isEmojiExist.userIds || []).filter(
        (userId) => userId !== session.user.id,
      );
      if (updatedUserIds.length === 0) {
        // remove reaction if no users left
        await db
          .delete(guestbookReactionTable)
          .where(eq(guestbookReactionTable.id, isEmojiExist.id));
      } else {
        // update reaction by removing user
        await db
          .update(guestbookReactionTable)
          .set({
            userIds: updatedUserIds,
            lastUpdatedAt: new Date(),
          })
          .where(eq(guestbookReactionTable.id, isEmojiExist.id));
      }
    }
  }

  // Invalidate cache after reaction change
  guestbookCache.delete("guestbook:messages");

  return "success";
}

// === User Actions === //

// === Server Actions === //

export type MessageWithReactions = typeof guestbookTable.$inferSelect & {
  reactions: (typeof guestbookReactionTable.$inferSelect & {
    users: Omit<
      typeof userTable.$inferSelect,
      "email" | "emailVerified" | "createdAt" | "updatedAt"
    >[];
  })[];
  user: Omit<
    typeof userTable.$inferSelect,
    "email" | "emailVerified" | "createdAt" | "updatedAt"
  >;
};

export async function getMessages(): Promise<MessageWithReactions[]> {
  const cacheKey = "guestbook:messages";

  // Check if data is in cache
  const cached = guestbookCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const dbMessages = await db
    .select()
    .from(guestbookTable)
    .orderBy(guestbookTable.createdAt);

  const messages: MessageWithReactions[] = [];

  for (const message of dbMessages) {
    const reactions = await db
      .select()
      .from(guestbookReactionTable)
      .where(eq(guestbookReactionTable.guestbookId, message.id));

    const user = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, message.userId))
      .limit(1);

    const reactionUsers: MessageWithReactions["reactions"][0]["users"] = [];

    for (const reaction of reactions) {
      const users = await db
        .select()
        .from(userTable)
        .where(
          (reaction?.userIds || []).length > 0
            ? inArray(userTable.id, reaction.userIds || [])
            : eq(userTable.id, ""),
        );

      for (const user of users) {
        reactionUsers.push({
          id: user.id,
          name: user.name,
          image: user.image,
        });
      }
    }

    messages.push({
      ...message,
      reactions: reactions.map((reaction) => ({
        users: reactionUsers.filter((u) => reaction.userIds?.includes(u.id)),
        ...reaction,
      })),
      user: {
        id: user[0].id,
        name: user[0].name,
        image: user[0].image,
      },
    });
  }

  // Store in cache
  guestbookCache.set(cacheKey, messages);

  return messages;
}

export async function clearGuestbookCache() {
  guestbookCache.clear();
  return { success: true, message: "Guestbook cache cleared" };
}

// === Server Actions === //
