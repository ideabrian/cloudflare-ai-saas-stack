import { drizzle } from "drizzle-orm/d1";

export const db = (env: Env) => drizzle(env.DB);
