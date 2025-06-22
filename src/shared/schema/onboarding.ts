import { z } from "zod";

export const trackOnboardingSchema = z.object({
	headline: z.string().min(1, "Headline is required"),
	emoji: z.union([z.literal("❤️"), z.literal("🔥"), z.literal("none")]),
	benefitIndex: z.number().int().min(0),
});

export const onboardingSessionSchema = z.object({
	sessionId: z.string(),
	headlineInteraction: z.object({
		headline: z.string(),
		headlineIndex: z.number(),
		timestamp: z.number(),
	}).optional(),
	emojiReactions: z.array(z.object({
		benefitIndex: z.number(),
		emoji: z.union([z.literal("❤️"), z.literal("🔥")]),
		timestamp: z.number(),
	})),
	completedAt: z.number().optional(),
	userAgent: z.string(),
});

export type TrackOnboardingRequest = z.infer<typeof trackOnboardingSchema>;
export type OnboardingSession = z.infer<typeof onboardingSessionSchema>;