DROP INDEX IF EXISTS "user_email_unique";--> statement-breakpoint
ALTER TABLE `media` ALTER COLUMN "createdAt" TO "createdAt" integer NOT NULL DEFAULT '"2024-10-17T04:08:52.648Z"';--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `media` ALTER COLUMN "updatedAt" TO "updatedAt" integer NOT NULL DEFAULT '"2024-10-17T04:08:52.648Z"';--> statement-breakpoint
ALTER TABLE `role` ALTER COLUMN "createdAt" TO "createdAt" integer NOT NULL DEFAULT '"2024-10-17T04:08:52.648Z"';--> statement-breakpoint
ALTER TABLE `role` ALTER COLUMN "updatedAt" TO "updatedAt" integer NOT NULL DEFAULT '"2024-10-17T04:08:52.648Z"';--> statement-breakpoint
ALTER TABLE `user` ALTER COLUMN "createdAt" TO "createdAt" integer NOT NULL DEFAULT '"2024-10-17T04:08:52.648Z"';--> statement-breakpoint
ALTER TABLE `user` ALTER COLUMN "updatedAt" TO "updatedAt" integer NOT NULL DEFAULT '"2024-10-17T04:08:52.648Z"';