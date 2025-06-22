import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const onboardingTable = sqliteTable("onboarding", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	headline: text("headline").notNull(),
	emoji: text("emoji").notNull(),
	benefitIndex: integer("benefit_index").notNull(),
	createdAt: text("created_at")
		.notNull()
		.default(sql`(datetime('now'))`),
});