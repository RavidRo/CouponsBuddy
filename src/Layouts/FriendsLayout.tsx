import type { FC } from "react";
import { Friends } from "../components/FriendsSideBar/Friends";

interface Props {
	children: React.ReactNode;
}

export const FriendsLayout: FC<Props> = (props) => {
	return (
		<div className="flex h-full w-full flex-row">
			<Friends />
			<div className="flex-1">{props.children}</div>
		</div>
	);
};
