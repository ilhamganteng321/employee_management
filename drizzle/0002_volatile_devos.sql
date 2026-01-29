CREATE TABLE "attendances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" uuid NOT NULL,
	"date" date NOT NULL,
	"check_in" timestamp,
	"check_out" timestamp,
	"is_late" boolean DEFAULT false,
	"work_minutes" integer,
	"status" varchar(20) DEFAULT 'hadir',
	"note" varchar(255),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;