// src/server/router/context.ts
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { NodeHTTPCreateContextFnOptions } from "@trpc/server/adapters/node-http";
import EventEmitter from "events";
import { IncomingMessage } from "http";
import { Session } from "next-auth";
import ws from "ws";

import { getSession } from "next-auth/react";
import { prisma } from "../db/client";

const ee = new EventEmitter();

type CreateContextOptions = {
	session: Session | null;
};

/** Use this helper for:
 * - testing, where we dont have to Mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
	return {
		session: opts.session,
		prisma,
		ee,
	};
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (
	opts:
		| trpcNext.CreateNextContextOptions
		| NodeHTTPCreateContextFnOptions<IncomingMessage, ws>
) => {
	const { req } = opts;

	// Get the session from the server using the unstable_getServerSession wrapper function
	// const session = await getServerAuthSession({ req, res });
	const session = await getSession({ req });

	return await createContextInner({
		session,
	});
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();

/**
 * Creates a tRPC router that asserts all queries and mutations are from an authorized user. Will throw an unauthorized error if a user is not signed in.
 **/
export function createProtectedRouter() {
	return createRouter().middleware(({ ctx, next }) => {
		if (!ctx.session || !ctx.session.user) {
			throw new trpc.TRPCError({ code: "UNAUTHORIZED" });
		}
		return next({
			ctx: {
				...ctx,
				// infers that `session` is non-nullable to downstream resolvers
				session: { ...ctx.session, user: ctx.session.user },
			},
		});
	});
}
