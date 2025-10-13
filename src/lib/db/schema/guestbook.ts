import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "@/lib/db/schema/user";
import { nanoid } from "@/lib/utils";

export const guestbookTable = pgTable("guestbook", {
  id: text("id")
    .primaryKey()
    .unique()
    .$defaultFn(() => nanoid(10)),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "no action", // "restrict",
    }),
  message: text("message").notNull(),
  createdAt: timestamp()
    .notNull()
    .$defaultFn(() => new Date()),
});
