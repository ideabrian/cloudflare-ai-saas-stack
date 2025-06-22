import { db } from "@worker/db";
import { account, session, user, verification } from "@worker/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = (env: Env) => {
	return betterAuth({
		secret: env.BETTER_AUTH_SECRET,
		database: drizzleAdapter(db(env), {
			provider: "sqlite",
			schema: {
				account,
				session,
				user,
				verification,
			},
		}),
		baseUrl: env.BETTER_AUTH_URL,
		trustedOrigins: [env.BETTER_AUTH_URL],
		session: {
			expiresIn: 60 * 60 * 24 * 7, // 7 days
			updateAge: 60 * 60 * 24, // 1 day (session expiration is updated every day)
			cookieCache: {
				enabled: true, // Enable cookie caching to reduce database calls
				maxAge: 5 * 60, // Cache for 5 minutes
			},
		},
		advanced: {
			cookieDomain: new URL(env.BETTER_AUTH_URL).hostname,
			useSecureCookies: env.ENVIRONMENT === "production",
			sameSite: "lax",
		},
		emailAndPassword: {
			enabled: true,
		},
		socialProviders: {
			google: {
				clientId: env.GOOGLE_CLIENT_ID,
				clientSecret: env.GOOGLE_CLIENT_SECRET,
			},
		},
	});
};
