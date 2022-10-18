import { FC, useContext } from "react";

import { trpc } from "../../utils/trpc";

import { ActiveFriendContext, SetActiveFriendContext } from "../../contexts";
import type { Friendship } from "../../hooks/useFriends";
import { ProfilePicture } from "../ProfilePicture";

interface FriendProps {
	friendship: Friendship;
	waitingForResponse: boolean;
}

export const FriendCard: FC<FriendProps> = (props) => {
	const friendship = props.friendship;
	const friend = friendship.friend;

	const accept = trpc.useMutation("friends.accept");

	const areFriends = friendship.status === "ACCEPTED";

	const Description = () => {
		if (areFriends) {
			return <p>No Coupons</p>;
		}
		if (friendship.status === "PENDING" && props.waitingForResponse) {
			return <p>Waiting for acceptance...</p>;
		}
		return (
			<>
				<button
					onClick={() => accept.mutate({ friendshipID: friendship.id })}
					disabled={accept.isLoading}
				>
					Accept
				</button>
				<p hidden={!accept.isError} className="text-red-300">
					{accept.error?.message}
				</p>
			</>
		);
	};

	const activeFriend = useContext(ActiveFriendContext);
	const setActiveFriend = useContext(SetActiveFriendContext);
	const handleSelection = () => {
		if (areFriends) {
			setActiveFriend(friend.id);
		}
	};

	return (
		<div
			className={`p-1 ${
				areFriends ? "cursor-pointer transition-colors hover:bg-gray-100" : ""
			} ${activeFriend === friend.id ? "bg-gray-100" : ""}`}
			onClick={handleSelection}
		>
			<div className="flex h-12 flex-row gap-5">
				<div className="relative w-12 flex-shrink-0">
					<div className="relative h-full w-full">
						<ProfilePicture image={friend.image} />
					</div>
				</div>
				<div>
					<h6>{friend.name}</h6>
					<span className="text-xs">
						<Description />
					</span>
				</div>
			</div>
		</div>
	);
};
