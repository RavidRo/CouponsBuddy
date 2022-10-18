import { useState, type FC } from "react";
import { Friends } from "../components/FriendsSideBar/Friends";
import { ActiveFriendContext, SetActiveFriendContext } from "../contexts";

interface Props {
	children: React.ReactNode;
}

export const FriendsLayout: FC<Props> = (props) => {
	const [activeFriend, setActiveFriend] = useState<string | null>(null);
	return (
		<SetActiveFriendContext.Provider value={setActiveFriend}>
			<ActiveFriendContext.Provider value={activeFriend}>
				<div className="flex h-full w-full flex-row">
					<Friends />
					<div className="flex-1">{props.children}</div>
				</div>
			</ActiveFriendContext.Provider>
		</SetActiveFriendContext.Provider>
	);
};
