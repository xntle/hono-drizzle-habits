CREATE TABLE "habits" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"streak" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
