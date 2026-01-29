import { pgTable, uuid, varchar } from "drizzle-orm/pg-core"

export const departments = pgTable("departments", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),
  name: varchar("name", { length: 100 }).notNull()
})
