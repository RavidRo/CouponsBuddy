import type { FC } from "react";

interface Props {
	children: React.ReactNode;
	onClick?: () => void;
}

export const IconButton: FC<Props> = (props) => {
	return (
		<div
			className="cursor-pointer transition-colors hover:text-gray-600"
			onClick={props.onClick}
		>
			{props.children}
		</div>
	);
};
