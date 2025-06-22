import { z } from "zod";

export const generateContentRequestSchema = z.object({
	title: z.string().min(5, "Title is required").max(200, "Title too long"),
});

export const generateContentResponseSchema = z.object({
	content: z.string().optional(),
	error: z.string().optional(),
	success: z.boolean(),
});

export const generateCopyRequestSchema = z.object({
	selectedHeadline: z.string().min(1, "Headline is required"),
	previousChoices: z.array(z.string()),
	sectionType: z.enum(["opening", "problem", "solution", "social_proof", "urgency"]),
});

export const copyOptionSchema = z.object({
	id: z.number(),
	preview: z.string(), // Short, scannable text for selection
	text: z.string(),    // Full compelling copy for final letter
});

export const generateCopyResponseSchema = z.object({
	options: z.array(copyOptionSchema).optional(),
	error: z.string().optional(),
	success: z.boolean(),
});

export type GenerateContentRequest = z.infer<
	typeof generateContentRequestSchema
>;
export type GenerateContentResponse = z.infer<
	typeof generateContentResponseSchema
>;
export type GenerateCopyRequest = z.infer<typeof generateCopyRequestSchema>;
export type GenerateCopyResponse = z.infer<typeof generateCopyResponseSchema>;
export type CopyOption = z.infer<typeof copyOptionSchema>;
