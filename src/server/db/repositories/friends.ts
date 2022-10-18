import {
	Friendship as PrismaFriendship,
	Prisma,
	PrismaClient,
	User,
} from "@prisma/client";
import { TRPCError } from "@trpc/server";

export type Friendship = PrismaFriendship & {
	inviter: User;
	invited: User;
};

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
}

export async function invite(
	prisma: PrismaClient,
	userID: string,
	email: string
): Promise<{ friendship: Friendship; created: boolean }> {
	const friend = await prisma.user.findUnique({
		where: {
			email,
		},
	});

	if (friend === null) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Invited user does not exist",
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
					invitedId: userID,
					inviterId: friend.id,
				},
				{
					invitedId: friend.id,
					inviterId: userID,
				},
			],
		},
	});

	if (friendship !== null) {
		return { friendship, created: false };
	}

	const newFriendship = await createFriendship(prisma, {
		invitedId: friend.id,
		inviterId: userID,
	});

	return { friendship: newFriendship, created: true };
}

const createFriendship = async (
	prisma: PrismaClient,
	input: { invitedId: string; inviterId: string }
): Promise<Friendship> => {
	const { invitedId, inviterId } = input;
	const idToBank = (
		id: string
	): Prisma.ResourcesCreateWithoutFriendshipInput => {
		return {
			couponBank: {
				create: {},
			},
			user: { connect: { id } },
		};
	};
	return await prisma.friendship.create({
		include: {
			invited: true,
			inviter: true,
		},
		data: {
			invitedId,
			inviterId,
			resources: {
				create: [idToBank(invitedId), idToBank(inviterId)],
			},
		},
	});
};

export async function getFriendships(
	prisma: PrismaClient,
	userID: string
): Promise<Friendship[]> {
	const friendRequests = await prisma.friendship.findMany({
		include: {
			inviter: true,
			invited: true,
		},
		where: {
			AND: [
				{
					OR: [{ invitedId: userID }, { inviterId: userID }],
				},
			],
		},
	});
	return friendRequests;
}
