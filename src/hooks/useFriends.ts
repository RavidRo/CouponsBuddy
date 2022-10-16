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

export const useFriends = () => {
	const { data: sessionData, status } = useAuthorizedSession();
	const [friendships, setFriendships] = useState<ServerFriendship[]>([]);
	trpc.useSubscription(["friends.subscribeFriends"], {
		onNext(f) {
			setFriendships((prev) => [...prev, f]);
		},
	});
	const initFriendships = trpc.useQuery(["friends.getFriends"]);

	const totalFriendships = (initFriendships.data ?? []).concat(friendships);

	const totalFriends = useMemo(() => {
		if (status === "loading") return [];
		if (!sessionData?.user?.id) {
			console.error("Session data is not available");
			return [];
		}
		const myId = sessionData.user.id;

		return totalFriendships.map((f) => prismaToFriendship(f, myId));
	}, [sessionData, status, totalFriendships]);

	return totalFriends;
};

export const useFriendsRequests = () => {
	const { data: sessionData, status } = useAuthorizedSession();
	const [friendshipRequests, setFriendshipRequests] = useState<
		ServerFriendship[]
	>([]);
	trpc.useSubscription(["friends.subscribeFriendRequests"], {
		onNext(f) {
			setFriendshipRequests((prev) => [...prev, f]);
		},
	});
	const initFriendshipRequests = trpc.useQuery(["friends.getFriendRequests"]);

	const totalFriendshipRequests = (initFriendshipRequests.data ?? []).concat(
		friendshipRequests
	);

	const totalFriendRequests = useMemo(() => {
		if (status === "loading") return [];
		if (!sessionData?.user?.id) {
			console.error("Session data is not available");
			return [];
		}
		const myId = sessionData.user.id;

		return totalFriendshipRequests.map((f) => prismaToFriendship(f, myId));
	}, [sessionData, status, totalFriendshipRequests]);

	return totalFriendRequests;
};
