import { User } from "@prisma/client";
import { useMemo, useState } from "react";
import type { Friendship as ServerFriendship } from "../server/db/repositories/friends";
import { trpc } from "../utils/trpc";
import { useAuthorizedSession } from "./useAuthorizedSession";

export type Friendship = {
	id: ServerFriendship["id"];
	status: ServerFriendship["status"];
	friend: User;
};

function removeDuplicates<T>(
	arr: T[],
	transform: (e: T) => unknown = (e) => e
): T[] {
	return arr.filter((f1, index) => {
		const f1Transformed = transform(f1);
		return arr.slice(index + 1).every((f2) => f1Transformed !== transform(f2));
	});
}

function split<T>(
	arr: T[],
	predicate: (e: T) => boolean
): { passed: T[]; failed: T[] } {
	const passed = arr.filter(predicate);
	const negPredicate = (e: T) => !predicate(e);
	const failed = arr.filter(negPredicate);

	return { passed, failed };
}

const prismaToFriendship = (
	prismaFriendship: ServerFriendship & {
		inviter: User;
		invited: User;
	},
	myId: string
): Friendship => {
	const friend =
		prismaFriendship.invitedId === myId
			? prismaFriendship.inviter
			: prismaFriendship.invited;
	return {
		id: prismaFriendship.id,
		status: prismaFriendship.status,
		friend,
	};
};

export const useFriendships = (): {
	friends: Friendship[];
	friendsToAccept: Friendship[];
	friendsWaitingForAcceptance: Friendship[];
} => {
	const { data: sessionData, status } = useAuthorizedSession();

	const [allFriendship, setAllFriendship] = useState<ServerFriendship[]>([]);
	const getFriendshipsRequest = trpc.useQuery(["friends.getFriendships"], {
		onSuccess(data) {
			setAllFriendship((prev) => prev.concat(data));
		},
	});

	trpc.useSubscription(["friends.subscribeFriendships"], {
		enabled: status === "authenticated" && getFriendshipsRequest.isSuccess,
		onNext(newFriendship) {
			//! Adding the new friendship to the end overrides the old one (Later removing duplicates from start)
			setAllFriendship((prev) => [...prev, newFriendship]);
		},
	});

	return useMemo(() => {
		const defaultReturn = {
			friends: [],
			friendsToAccept: [],
			friendsWaitingForAcceptance: [],
		};

		if (status === "loading") return defaultReturn;
		if (!sessionData?.user?.id) {
			console.error("Session data is not available");
			return defaultReturn;
		}
		const myId = sessionData.user.id;

		// ! Its important that the removal of the duplicates will be from the start
		const friendships = removeDuplicates(allFriendship, (f) => f.id);

		const { passed: friends, failed: friendRequests } = split(
			friendships,
			(f) => f.status === "ACCEPTED"
		);
		const { passed: friendsToAccept, failed: friendsWaitingForAcceptance } =
			split(friendRequests, (f) => f.invitedId === myId);
		const toFriendship = (f: ServerFriendship) => prismaToFriendship(f, myId);

		return {
			friendsToAccept: friendsToAccept.map(toFriendship),
			friendsWaitingForAcceptance:
				friendsWaitingForAcceptance.map(toFriendship),
			friends: friends.map(toFriendship),
		};
	}, [sessionData?.user?.id, status, allFriendship]);
};
