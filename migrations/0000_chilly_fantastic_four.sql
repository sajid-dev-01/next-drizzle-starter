CREATE TABLE `accounts` (
	`userId` text NOT NULL,
	`accountType` text NOT NULL,
	`provider` text NOT NULL,
	`providerAccountId` text NOT NULL,
	PRIMARY KEY(`provider`, `providerAccountId`),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`mediaName` text(50) NOT NULL,
	`mediaHash` text(50) NOT NULL,
	`mediaAltText` text(100),
	`mediaExt` text(10) NOT NULL,
	`mediaMime` text(20) NOT NULL,
	`mediaSize` integer NOT NULL,
	`mediaUrl` text NOT NULL,
	`mediaHeight` integer,
	`mediaWidth` integer,
	`formats` text,
	`createdAt` integer DEFAULT '"2024-10-15T04:35:35.279Z"' NOT NULL,
	`updatedAt` integer DEFAULT '"2024-10-15T04:35:35.279Z"' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `role` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`permissions` text,
	`createdAt` integer DEFAULT '"2024-10-15T04:35:35.279Z"' NOT NULL,
	`updatedAt` integer DEFAULT '"2024-10-15T04:35:35.279Z"' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`ipAddress` text,
	`userAgent` text,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`roleId` text,
	`name` text,
	`email` text,
	`password` text,
	`emailVerifiedAt` integer,
	`image` text,
	`createdAt` integer DEFAULT '"2024-10-15T04:35:35.279Z"' NOT NULL,
	`updatedAt` integer DEFAULT '"2024-10-15T04:35:35.279Z"' NOT NULL,
	FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`email` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`token` text NOT NULL,
	`expiresAt` integer NOT NULL
);
