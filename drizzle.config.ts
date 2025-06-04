import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import path from "node:path";
import fs from "node:fs";

function getLocalD1DB() {
	try {
		const basePath = path.resolve("./.wrangler/state/v3/d1");
		const dbFile = fs
			.readdirSync(basePath, { encoding: "utf-8", recursive: true })
			.find((f) => f.endsWith(".sqlite"));

		if (!dbFile) {
			throw new Error(`.sqlite file not found in ${basePath}`);
		}

		const url = path.resolve(basePath, dbFile);
		return url;
	} catch (err) {
		console.error(err);

		return null;
	}
}

export default defineConfig({
	out: "./src/worker/db/migrations",
	schema: "./src/worker/db/schema/index.ts",
	dialect: "sqlite",
	...(process.env.NODE_ENV === "production"
		? {
				driver: "d1-http",
			}
		: {
				dbCredentials: {
					url: getLocalD1DB(),
				},
			}),
});
