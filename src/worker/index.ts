import { auth } from "@worker/auth";
import { sessionMiddleware } from "@worker/middleware/session";
import { aiRoute } from "@worker/routes/ai";
import { authDemoRoute } from "@worker/routes/auth-demo";
import { onboardingRoute } from "@worker/routes/onboarding";
import { postsRoute } from "@worker/routes/posts";
import type { HonoContext } from "@worker/types/hono";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono<HonoContext>();

app.use("*", logger());
app.use("*", cors({
	origin: ["http://localhost:5173", "https://hey.builders"],
	credentials: true,
}));
app.use("*", sessionMiddleware());

const apiRoutes = app
	.basePath("/api")
	.get("/", (c) => c.text("Hey.Builders API"))
	.route("/posts", postsRoute)
	.route("/ai", aiRoute)
	.route("/auth-demo", authDemoRoute)
	.route("/onboarding", onboardingRoute)
	.all("/auth/*", (c) => {
		const authHandler = auth(c.env).handler;
		return authHandler(c.req.raw);
	});

export default app;
export type ApiRoutes = typeof apiRoutes;
