import { FC } from "react";
import { NavigationBar, type Page } from "../components/NavigationBar";

interface Props {
	children: React.ReactNode;
	page: Page;
}

export const NavigationBarLayout: FC<Props> = (props) => {
	return (
		<div className="flex h-full w-full flex-col items-stretch">
			<NavigationBar page={props.page} />
			<div>{props.children}</div>
		</div>
	);
};
