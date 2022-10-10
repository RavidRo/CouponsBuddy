import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createProtectedRouter } from "./context";

export const friendsRouter = createProtectedRouter()
  .mutation("invite", {
    input: z.object({
      email: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      const userID = ctx.session.user.id;
      const friend = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });
      if (friend === null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invited used does not exist",
        });
      }

      // Check if a friend request already exists
      const friendRequest = await ctx.prisma.friendship.findFirst({
        where: {
          OR: [
            {
              invited: {
                id: userID,
              },
            },
            {
              inviter: {
                id: userID,
              },
            },
          ],
        },
      });

      const friendship = await ctx.prisma.friendship.create({
        include: {
          invited: true,
        },
        data: {
          invitedId: friend.id,
          inviterId: userID,
        },
      });
      return friendship;
    },
  })
  .query("getAll", {
    resolve: async ({ ctx }) => {
      const userID = ctx.session.user.id;
      const friendRequests = await ctx.prisma.friendship.findMany({
        include: {
          invited: true,
          inviter: true,
        },
        // Getting all the *accepted* friend requests where the use is the inviter/invited
        where: {
          AND: [
            {
              OR: [
                {
                  invited: {
                    id: userID,
                  },
                },
                {
                  inviter: {
                    id: userID,
                  },
                },
              ],
              status: "ACCEPTED",
            },
          ],
        },
      });
      return friendRequests.map((friendship) => {
        const friend =
          friendship.invitedId === userID
            ? friendship.inviter
            : friendship.invited;
        return {
          id: friendship.id,
          status: friendship.status,
          friend,
        };
      });
    },
  });
