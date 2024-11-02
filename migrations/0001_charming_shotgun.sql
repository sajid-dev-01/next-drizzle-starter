DROP INDEX IF EXISTS "user_email_unique";--> statement-breakpoint
ALTER TABLE `media` ALTER COLUMN "createdAt" TO "createdAt" integer NOT NULL DEFAULT '"2024-10-17T03:47:31.053Z"';--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `media` ALTER COLUMN "updatedAt" TO "updatedAt" integer NOT NULL DEFAULT '"2024-10-17T03:47:31.053Z"';--> statement-breakpoint
ALTER TABLE `role` ALTER COLUMN "createdAt" TO "createdAt" integer NOT NULL DEFAULT '"2024-10-17T03:47:31.053Z"';--> statement-breakpoint
ALTER TABLE `role` ALTER COLUMN "updatedAt" TO "updatedAt" integer NOT NULL DEFAULT '"2024-10-17T03:47:31.053Z"';--> statement-breakpoint
ALTER TABLE `user` ALTER COLUMN "name" TO "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ALTER COLUMN "email" TO "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ALTER COLUMN "createdAt" TO "createdAt" integer NOT NULL DEFAULT '"2024-10-17T03:47:31.053Z"';--> statement-breakpoint
ALTER TABLE `user` ALTER COLUMN "updatedAt" TO "updatedAt" integer NOT NULL DEFAULT '"2024-10-17T03:47:31.053Z"';--> statement-breakpoint
ALTER TABLE `session` ADD `twoFactorVerified` integer DEFAULT false;