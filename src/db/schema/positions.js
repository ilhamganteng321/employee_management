import { pgTable, uuid, varchar } from "drizzle-orm/pg-core"

export const positions = pgTable("positions", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),
  name: varchar("name", { length: 100 }).notNull()
})
