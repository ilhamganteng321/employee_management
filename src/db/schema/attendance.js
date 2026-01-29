import {
  pgTable,
  uuid,
  date,
  timestamp,
  varchar,
  boolean,
  integer
} from "drizzle-orm/pg-core"
import { employees } from "./employees"

export const attendances = pgTable("attendances", {
  id: uuid("id").defaultRandom().primaryKey(),

  employeeId: uuid("employee_id")
    .notNull()
    .references(() => employees.id, { onDelete: "cascade" }),

  date: date("date").notNull(), // YYYY-MM-DD

  checkIn: timestamp("check_in"),
  checkOut: timestamp("check_out"),

  isLate: boolean("is_late").default(false),

  workMinutes: integer("work_minutes"), // total menit kerja

  status: varchar("status", { length: 20 })
    .default("hadir"),

  note: varchar("note", { length: 255 }),

  createdAt: timestamp("created_at").defaultNow(),
})