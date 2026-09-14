ALTER TABLE "users" ADD COLUMN "resetPasswordTokenHash" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "resetPasswordExpiresAt" timestamp;