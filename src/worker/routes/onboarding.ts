import { zValidator } from "@hono/zod-validator";
import { db } from "@worker/db";
import { onboardingTable } from "@worker/db/schema";
import type { HonoContext } from "@worker/types/hono";
import { Hono } from "hono";
import { z } from "zod";

const onboardingRoute = new Hono<HonoContext>();

const trackOnboardingSchema = z.object({
	headline: z.string(),
	emoji: z.string(),
	benefitIndex: z.number().int().min(0),
});

onboardingRoute.post(
	"/track",
	zValidator("json", trackOnboardingSchema),
	async (c) => {
		const { headline, emoji, benefitIndex } = c.req.valid("json");
		
		const result = await db(c.env)
			.insert(onboardingTable)
			.values({
				headline,
				emoji,
				benefitIndex,
			})
			.returning({ id: onboardingTable.id });

		return c.json({ success: true, id: result[0].id });
	},
);

export { onboardingRoute };
