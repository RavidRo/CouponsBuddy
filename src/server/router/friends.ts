import { Subscription } from "@trpc/server";

import { z } from "zod";
import { Events } from "../../constants/events";
import {
	accept,
	getFriendRequests,
	getFriends,
	invite,
	type Friendship,
} from "../db/repositories/friends";
import { createProtectedRouter } from "./context";

export const friendsRouter = createProtectedRouter()
	.mutation("invite", {
		input: z.object({
			email: z.string(),
		}),
		async resolve({ ctx, input }) {
			const f = await invite(ctx.prisma, ctx.session.user.id, input.email);
			ctx.ee.emit(Events.INVITE, f);
			return f;
		},
	})
	.mutation("accept", {
		input: z.object({
			friendshipID: z.string(),
		}),
		async resolve({ ctx, input }) {
			const f = await accept(
				ctx.prisma,
				ctx.session.user.id,
				input.friendshipID
			);
			ctx.ee.emit(Events.ACCEPT, f);
			return f;
		},
	})
	.query("getFriendRequests", {
		resolve: ({ ctx }) => getFriendRequests(ctx.prisma, ctx.session.user.id),
	})
	.query("getFriends", {
		resolve: ({ ctx }) => getFriends(ctx.prisma, ctx.session.user.id),
	})
	.subscription("subscribeFriendRequests", {
		resolve({ ctx }) {
			return new Subscription<Friendship>((emit) => {
				const onInvite = async (friendship: Friendship) => {
					if (
						[friendship.invitedId, friendship.inviterId].includes(
							ctx.session.user.id
						)
					) {
						emit.data(friendship);
					}
				};

				ctx.ee.on(Events.INVITE, onInvite);

				return () => {
					ctx.ee.off(Events.INVITE, onInvite);
				};
			});
		},
	})
	.subscription("subscribeFriends", {
		resolve({ ctx }) {
			return new Subscription<Friendship>((emit) => {
				const onAccept = async (friendship: Friendship) => {
					if (
						[friendship.invitedId, friendship.inviterId].includes(
							ctx.session.user.id
						)
					) {
						emit.data(friendship);
					}
				};

				ctx.ee.on(Events.ACCEPT, onAccept);

				return () => {
					ctx.ee.off(Events.ACCEPT, onAccept);
				};
			});
		},
	});
