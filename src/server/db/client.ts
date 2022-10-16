// src/server/db/client.ts
import { PrismaClient } from "@prisma/client";
import { env } from "../../env/server";

declare global {
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined;
}

type LogLevel = "info" | "query" | "warn" | "error";
const logLevelsList: LogLevel[] = ["query", "info", "warn", "error"];
const logLevels: Record<LogLevel, LogLevel[]> = {
	query: logLevelsList,
	info: logLevelsList.slice(1),
	warn: logLevelsList.slice(2),
	error: logLevelsList.slice(3),
};

export const prisma =
	global.prisma || new PrismaClient({ log: logLevels[env.PRISMA_LOG_LEVEL] });

if (env.NODE_ENV !== "production") {
	global.prisma = prisma;
}
