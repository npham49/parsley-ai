CREATE TABLE IF NOT EXISTS "document_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"file_key" text NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "content_table" RENAME COLUMN "course_id" TO "document_id";--> statement-breakpoint
ALTER TABLE "content_table" DROP CONSTRAINT "content_table_course_id_course_table_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "document_table" ADD CONSTRAINT "document_table_course_id_course_table_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "content_table" ADD CONSTRAINT "content_table_document_id_document_table_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."document_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
