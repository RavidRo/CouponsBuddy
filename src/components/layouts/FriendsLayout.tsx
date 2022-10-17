import type { FC } from "react";
import { Friends } from "../Friends";

interface Props {
	children: React.ReactNode;
}

export const FriendsLayout: FC<Props> = (props) => {
	return (
		<div className="flex h-full w-full flex-row">
			<Friends />
			<div>{props.children}</div>
		</div>
	);
};
