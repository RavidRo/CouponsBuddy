import {
	Friendship as PrismaFriendship,
	PrismaClient,
	User,
} from "@prisma/client";
import { TRPCError } from "@trpc/server";

export type Friendship = PrismaFriendship & {
	inviter: User;
	invited: User;
};

// export type Friendship = {
//   id: PrismaFriendship["id"];
//   status: PrismaFriendship["status"];
//   friend: User;
// };

// const prismaToFriendship = (
//   prismaFriendship: PrismaFriendship & {
//     inviter: User;
//     invited: User;
//   },
//   myId: string
// ): Friendship => {
//   const friend =
//     prismaFriendship.invitedId === myId
//       ? prismaFriendship.inviter
//       : prismaFriendship.invited;
//   return {
//     id: prismaFriendship.id,
//     status: prismaFriendship.status,
//     friend,
//   };
// };

export async function accept(
	prisma: PrismaClient,
	userID: string,
	friendshipID: string
): Promise<Friendship> {
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
		include: {
			inviter: true,
			invited: true,
		},
		where: {
			id: friendshipID,
		},
		data: {
			status: "ACCEPTED",
		},
	});
	// .then((f) => prismaToFriendship(f, userID));
}

export async function invite(
	prisma: PrismaClient,
	userID: string,
	email: string
): Promise<Friendship> {
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

	if (friend.id === userID) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "You can't invite yourself",
		});
	}

	// Check if a friend request already exists
	const friendship = await prisma.friendship.findFirst({
		include: {
			invited: true,
			inviter: true,
		},
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
		// return prismaToFriendship(friendship, userID);
		return friendship;
	}

	const newFriendship = await prisma.friendship.create({
		include: {
			invited: true,
			inviter: true,
		},
		data: {
			invitedId: friend.id,
			inviterId: userID,
		},
	});

	// return prismaToFriendship(newFriendship, userID);
	return newFriendship;
}

export async function getFriendRequests(
	prisma: PrismaClient,
	userID: string
): Promise<Friendship[]> {
	const friendRequests = await prisma.friendship.findMany({
		include: {
			inviter: true,
			invited: true,
		},
		// Getting all the *accepted* friend requests where the use is the inviter/invited
		where: {
			AND: [
				{
					invited: {
						id: userID,
					},
					status: "PENDING",
				},
			],
		},
	});
	return friendRequests;
	// .map((friendship) => {
	// 	return {
	// 		id: friendship.id,
	// 		status: friendship.status,
	// 		friend: friendship.inviter,
	// 	};
	// });
}

export async function getFriends(
	prisma: PrismaClient,
	userID: string
): Promise<Friendship[]> {
	const friendRequests = await prisma.friendship.findMany({
		include: {
			inviter: true,
			invited: true,
		},
		// Getting all the *accepted* friend requests where the use is the inviter/invited
		where: {
			AND: [
				{
					OR: [{ invitedId: userID }, { inviterId: userID }],
					status: "ACCEPTED",
				},
			],
		},
	});
	return friendRequests;
	// .map((f) => prismaToFriendship(f, userID));
}
