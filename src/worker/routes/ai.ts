import { zValidator } from "@hono/zod-validator";
import { generateContentRequestSchema, generateCopyRequestSchema } from "@shared/schema/ai";
import { requireAuth } from "@worker/middleware";
import type { HonoContext } from "@worker/types/hono";
import { generateText } from "ai";
import { Hono } from "hono";
import { createWorkersAI } from "workers-ai-provider";

export const aiRoute = new Hono<HonoContext>()
	.post(
		"/generate-content",
		requireAuth(),
		zValidator("json", generateContentRequestSchema),
		async (c) => {
			const { title } = c.req.valid("json");

			try {
				const workersai = createWorkersAI({ binding: c.env.AI });
				const result = await generateText({
					model: workersai("@cf/meta/llama-3.2-1b-instruct"),
					prompt: `Write a single paragraph (maximum 200 words) expanding on this topic: "${title}". Make it informative and engaging. Do not include a title or heading.`,
					maxTokens: 250,
					temperature: 0.7,
				});

				return c.json({
					success: true,
					data: { content: result.text },
				});
			} catch (_error) {
				return c.json(
					{
						success: false,
						error: {
							code: "INTERNAL_SERVER_ERROR",
							message: "Failed to generate content. Please try again.",
						},
					},
					500,
				);
			}
		},
	)
	.post(
		"/generate-copy",
		zValidator("json", generateCopyRequestSchema),
		async (c) => {
			const { selectedHeadline, previousChoices, sectionType } = c.req.valid("json");

			const prompts = {
				opening: `You are Joanna Wiebe from CopyHackers writing a personal sales letter. A reader chose this headline: "${selectedHeadline}"

Write 3 opening options. Each should have:
- "preview": A short, first-person phrase (3-6 words) like "I'm tired of building alone" that captures their inner voice
- "text": A compelling 3-4 sentence paragraph in Joanna's conversational style

Make the full text emotionally resonant and personally validating. Use "you" language and make them feel understood.

Format as JSON array: [{"id": 1, "preview": "...", "text": "..."}, {"id": 2, "preview": "...", "text": "..."}, {"id": 3, "preview": "...", "text": "..."}]`,

				problem: `You are Joanna Wiebe writing intimately to someone who chose: "${selectedHeadline}" and resonated with: "${previousChoices[previousChoices.length - 1]}"

Write 3 problem options. Each should have:
- "preview": A short, first-person phrase (3-6 words) like "I'm building in a vacuum" that captures their frustration
- "text": A compelling 3-4 sentence paragraph that agitates their specific pain point

Make the full text emotionally resonant and specific to their situation.

Format as JSON array: [{"id": 1, "preview": "...", "text": "..."}, {"id": 2, "preview": "...", "text": "..."}, {"id": 3, "preview": "...", "text": "..."}]`,

				solution: `You are Joanna Wiebe writing to someone who has this story: "${selectedHeadline}" → ${previousChoices.join(" → ")}

Write 3 solution options. Each should have:
- "preview": A short, first-person phrase (3-6 words) like "I need people who get it" that captures their desire
- "text": A compelling 3-4 sentence paragraph that positions Hey.Builders naturally

Make it feel inevitable, not salesy. Paint a picture of what becomes possible.

Format as JSON array: [{"id": 1, "preview": "...", "text": "..."}, {"id": 2, "preview": "...", "text": "..."}, {"id": 3, "preview": "...", "text": "..."}]`,

				social_proof: `You are Joanna Wiebe writing to someone whose journey is: "${selectedHeadline}" → ${previousChoices.join(" → ")}

Write 3 social proof options. Each should have:
- "preview": A short, first-person phrase (3-6 words) like "People like me are here" that captures belonging
- "text": A compelling 3-4 sentence paragraph about community and belonging

Make them feel "these are my people" not just customer testimonials.

Format as JSON array: [{"id": 1, "preview": "...", "text": "..."}, {"id": 2, "preview": "...", "text": "..."}, {"id": 3, "preview": "...", "text": "..."}]`,

				urgency: `You are Joanna Wiebe writing the final push for someone whose story is: "${selectedHeadline}" → ${previousChoices.join(" → ")}

Write 3 urgency options. Each should have:
- "preview": A short, first-person phrase (3-6 words) like "I'm losing momentum alone" that captures their urgency
- "text": A compelling 3-4 sentence paragraph about the real cost of waiting

Make it personal and honest - no fake scarcity, just opportunity cost.

Format as JSON array: [{"id": 1, "preview": "...", "text": "..."}, {"id": 2, "preview": "...", "text": "..."}, {"id": 3, "preview": "...", "text": "..."}]`,
			};

			try {
				const workersai = createWorkersAI({ binding: c.env.AI });
				const result = await generateText({
					model: workersai("@cf/meta/llama-3.2-1b-instruct"),
					prompt: prompts[sectionType as keyof typeof prompts],
					maxTokens: 400,
					temperature: 0.8,
				});

				// Try to parse JSON, fallback to manual parsing if needed
				let options: { id: number; preview?: string; text: string }[];
				try {
					options = JSON.parse(result.text);
				} catch {
					// Fallback: extract preview and text between quotes
					const previews = result.text.match(/"preview":\s*"([^"]+)"/g) || [];
					const texts = result.text.match(/"text":\s*"([^"]+)"/g) || [];
					options = texts.map((match, i) => ({
						id: i + 1,
						preview: previews[i] ? previews[i].replace(/"preview":\s*"([^"]+)"/, '$1') : undefined,
						text: match.replace(/"text":\s*"([^"]+)"/, '$1'),
					}));
				}

				return c.json({
					success: true,
					data: { options: options || [] },
				});
			} catch (_error) {
				return c.json(
					{
						success: false,
						error: {
							code: "INTERNAL_SERVER_ERROR",
							message: "Failed to generate copy options. Please try again.",
						},
					},
					500,
				);
			}
		},
	);
