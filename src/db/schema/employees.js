import { users } from "./users";
import { departments } from "./departments";
import { positions } from "./positions";
import {
  pgTable,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const employees = pgTable("employees", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),

  departmentId: uuid("department_id")
    .references(() => departments.id),

  positionId: uuid("position_id")
    .references(() => positions.id),

  phone: varchar("phone", { length: 20 }),
  address: varchar("address", { length: 255 }),
});
