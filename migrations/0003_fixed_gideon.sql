ALTER TABLE `session` RENAME COLUMN "twoFactorVerified" TO "twoFactorVerifiedAt";--> statement-breakpoint
DROP INDEX IF EXISTS "user_email_unique";--> statement-breakpoint
ALTER TABLE `session` ALTER COLUMN "twoFactorVerifiedAt" TO "twoFactorVerifiedAt" integer;--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `session` ADD `passwordConfirmedAt` integer;--> statement-breakpoint
ALTER TABLE `media` ALTER COLUMN "createdAt" TO "createdAt" integer NOT NULL DEFAULT '"2024-10-21T05:52:58.178Z"';--> statement-breakpoint
ALTER TABLE `media` ALTER COLUMN "updatedAt" TO "updatedAt" integer NOT NULL DEFAULT '"2024-10-21T05:52:58.178Z"';--> statement-breakpoint
ALTER TABLE `role` ALTER COLUMN "createdAt" TO "createdAt" integer NOT NULL DEFAULT '"2024-10-21T05:52:58.178Z"';--> statement-breakpoint
ALTER TABLE `role` ALTER COLUMN "updatedAt" TO "updatedAt" integer NOT NULL DEFAULT '"2024-10-21T05:52:58.178Z"';--> statement-breakpoint
ALTER TABLE `user` ALTER COLUMN "createdAt" TO "createdAt" integer NOT NULL DEFAULT '"2024-10-21T05:52:58.178Z"';--> statement-breakpoint
ALTER TABLE `user` ALTER COLUMN "updatedAt" TO "updatedAt" integer NOT NULL DEFAULT '"2024-10-21T05:52:58.178Z"';