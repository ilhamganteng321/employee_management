CREATE TABLE "salaries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" uuid NOT NULL,
	"month" integer NOT NULL,
	"year" integer NOT NULL,
	"basic_salary" integer NOT NULL,
	"allowance" integer DEFAULT 0,
	"bonus" integer DEFAULT 0,
	"deduction" integer DEFAULT 0,
	"total_salary" integer NOT NULL,
	"status" varchar(20) DEFAULT 'PAID',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "salaries" ADD CONSTRAINT "salaries_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;