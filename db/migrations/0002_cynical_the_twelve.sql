CREATE TABLE IF NOT EXISTS "content_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"embedding" vector(1536)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "content_table" ADD CONSTRAINT "content_table_course_id_course_table_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "embeddingIndex" ON "content_table" USING hnsw ("embedding" vector_cosine_ops);