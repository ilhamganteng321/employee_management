import {
  pgTable,
  uuid,
  integer,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { employees } from "./employees";

export const salaries = pgTable("salaries", {
  id: uuid("id").defaultRandom().primaryKey(),

  employeeId: uuid("employee_id")
    .notNull()
    .references(() => employees.id, { onDelete: "cascade" }),

  // Periode gaji
  month: integer("month").notNull(), // 1 - 12
  year: integer("year").notNull(),

  // Komponen gaji
  basicSalary: integer("basic_salary").notNull(),
  allowance: integer("allowance").default(0),
  bonus: integer("bonus").default(0),
  deduction: integer("deduction").default(0),

  // Total otomatis dihitung di backend
  totalSalary: integer("total_salary").notNull(),

  status: varchar("status", { length: 20 }).default("PAID"),
  // PAID | PENDING

  createdAt: timestamp("created_at").defaultNow(),
});
