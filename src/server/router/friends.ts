import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createProtectedRouter } from "./context";

async function accept(
  prisma: PrismaClient,
  userID: string,
  friendshipID: string
) {
  // Check if the friendship exists
  const friendship = await prisma.friendship.findUnique({
    where: {
      id: friendshipID,
    },
  });

  if (friendship === null) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Friendship not found",
    });
  }

  // Check if the user is the invited user
  if (friendship.invitedId !== userID) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "The friendship was not sent to you",
    });
  }

  return await prisma.friendship.update({
    where: {
      id: friendshipID,
    },
    data: {
      status: "ACCEPTED",
    },
  });
}

async function invite(prisma: PrismaClient, userID: string, email: string) {
  // Find the invited user
  const friend = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (friend === null) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invited used does not exist",
    });
  }

  // Check if a friend request already exists
  const friendship = await prisma.friendship.findFirst({
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

  if (friendship !== null) {
    return friendship;
  }

  const newFriendship = await prisma.friendship.create({
    include: {
      invited: true,
    },
    data: {
      invitedId: friend.id,
      inviterId: userID,
    },
  });

  return newFriendship;
}

async function getAll(prisma: PrismaClient, userID: string) {
  const friendRequests = await prisma.friendship.findMany({
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
      friendship.invitedId === userID ? friendship.inviter : friendship.invited;
    return {
      id: friendship.id,
      status: friendship.status,
      friend,
    };
  });
}

export const friendsRouter = createProtectedRouter()
  .mutation("invite", {
    input: z.object({
      email: z.string(),
    }),
    resolve: async ({ ctx, input }) =>
      invite(ctx.prisma, ctx.session.user.id, input.email),
  })
  .mutation("accept", {
    input: z.object({
      friendshipID: z.string(),
    }),
    resolve: async ({ ctx, input }) =>
      accept(ctx.prisma, ctx.session.user.id, input.friendshipID),
  })
  .query("getAll", {
    resolve: async ({ ctx }) => getAll(ctx.prisma, ctx.session.user.id),
  });
