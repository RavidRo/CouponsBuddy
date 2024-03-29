// @ts-check
import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
	DATABASE_URL: z.string().url(),
	PORT: z.string(),
	DEV_WSS_PORT: z.string(),
	NODE_ENV: z.enum(["development", "test", "production"]),
	NEXTAUTH_SECRET: z.string(),
	NEXTAUTH_URL: z.string().url(),
	NEXTAUTH_DEBUG: z.enum(["true", "false"]),
	DISCORD_CLIENT_ID: z.string(),
	DISCORD_CLIENT_SECRET: z.string(),
	AUTH0_CLIENT_ID: z.string(),
	AUTH0_CLIENT_SECRET: z.string(),
	AUTH0_ISSUER: z.string(),
	PRISMA_LOG_LEVEL: z.enum(["query", "info", "warn", "error"]),
	POSTGRES_PASSWORD: z.string(),
	POSTGRES_USER: z.string(),
	POSTGRES_DB: z.string(),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
	// NEXT_PUBLIC_BAR: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
	// NEXT_PUBLIC_BAR: process.env.NEXT_PUBLIC_BAR,
};
