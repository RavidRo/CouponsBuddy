import type { FC } from "react";

import { Friendship, useFriendships } from "../../hooks/useFriends";
import { FriendCard } from "./FriendCard";
import { ProfileCard } from "./ProfileCard";

export const Friends: FC = () => {
	const { friends, friendsToAccept, friendsWaitingForAcceptance } =
		useFriendships();

	return (
		<div className="h-full w-56 bg-gray-300">
			<ProfileCard />
			<FriendsList friends={friends} title="Buddies" />
			<FriendsList friends={friendsToAccept} title="Invites" />
			<FriendsList
				friends={friendsWaitingForAcceptance}
				title="Your invites"
				waitingForResponse
			/>
		</div>
	);
};

interface FriendsListProps {
	friends: Friendship[];
	title: string;
	waitingForResponse?: boolean;
}

const FriendsList: FC<FriendsListProps> = ({
	waitingForResponse = false,
	...props
}) => {
	return (
		<>
			<div hidden={props.friends.length === 0} className="bg-gray-400 p-1">
				<h5 className="text-sm font-medium">{props.title}</h5>
			</div>

			{props.friends.map((f) => (
				<FriendCard
					key={f.id}
					friendship={f}
					waitingForResponse={waitingForResponse}
				/>
			))}
		</>
	);
};
