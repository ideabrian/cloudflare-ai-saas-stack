CREATE TABLE `onboarding` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`headline` text NOT NULL,
	`emoji` text NOT NULL,
	`benefit_index` integer NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
