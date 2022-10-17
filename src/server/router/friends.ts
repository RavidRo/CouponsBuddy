import { Subscription } from "@trpc/server";

import { z } from "zod";
import { Events } from "../../constants/events";
import {
	accept,
	getFriendships,
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
			const result = await invite(ctx.prisma, ctx.session.user.id, input.email);
			if (result.created) {
				ctx.ee.emit(Events.INVITE, result.friendship);
			}
			return result.friendship;
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
	.query("getFriendships", {
		resolve: ({ ctx }) => getFriendships(ctx.prisma, ctx.session.user.id),
	})
	.subscription("subscribeFriendships", {
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
				ctx.ee.on(Events.ACCEPT, onAccept);

				return () => {
					ctx.ee.off(Events.ACCEPT, onAccept);
					ctx.ee.off(Events.INVITE, onInvite);
				};
			});
		},
	});
