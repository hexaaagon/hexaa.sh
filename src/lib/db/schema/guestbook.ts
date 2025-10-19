import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { nanoid } from "@/lib/utils";

export const guestbookTable = pgTable("guestbook_message", {
  id: text("id")
    .primaryKey()
    .unique()
    .$defaultFn(() => nanoid(10)),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "no action",
    }),
  anonymous: boolean("anonymous").default(false),
  message: text("message").notNull(),

  threadId: text("thread_id"),

  editHistory: text("edit_history")
    .$type<
      {
        message: string;
        createdAt: Date;
      }[]
    >()
    .array(),
  editedAt: timestamp(),

  createdAt: timestamp()
    .notNull()
    .$defaultFn(() => new Date()),
});

export const guestbookReactionTable = pgTable("guestbook_reaction", {
  id: text("id")
    .primaryKey()
    .unique()
    .$defaultFn(() => nanoid(10)),
  guestbookId: text("guestbook_id")
    .notNull()
    .references(() => guestbookTable.id, {
      onDelete: "cascade",
    }),
  userIds: text("user_id").notNull().array(),
  emoji: text("emoji").notNull(),

  lastUpdatedAt: timestamp()
    .notNull()
    .$defaultFn(() => new Date()),
  createdAt: timestamp()
    .notNull()
    .$defaultFn(() => new Date()),
});
