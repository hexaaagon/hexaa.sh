import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "@/lib/utils";

export const user = pgTable("user", {
  provider: text("provider")
    .notNull()
    .$type<"github" /*| "discord" | "google" */>(),
  id: text("id")
    .primaryKey()
    .unique()
    .$defaultFn(() => nanoid(10)),
  name: text("username").unique().notNull(),
  displayName: text("display_name").notNull(),
  image: text("image_url"),
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date()),
});
