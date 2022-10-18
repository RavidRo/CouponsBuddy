import Link from "next/link";
import { FC } from "react";

export enum Page {
	Home,
	Profile,
	Chat,
	Coupons,
}

interface NavigationBarProps {
	page: Page;
}

export const NavigationBar: FC<NavigationBarProps> = (props) => {
	return (
		<div
			id="navigation-bar"
			className="flex h-12 flex-row items-center bg-gray-100"
		>
			<NavigationLink
				title="Coupons"
				href="/coupons"
				selected={props.page === Page.Coupons}
			/>
			<NavigationLink
				title="Chat"
				href="/chat"
				selected={props.page === Page.Chat}
			/>
		</div>
	);
};

interface NavigationLinkProps {
	title: string;
	href: string;
	selected: boolean;
}

const NavigationLink: FC<NavigationLinkProps> = (props) => {
	return (
		<div className="m-8">
			<Link href={props.href}>
				<h2
					className={
						"cursor-pointer text-xl transition-colors hover:text-gray-600 " +
						(props.selected ? "font-semibold" : "font-normal")
					}
				>
					{props.title}
				</h2>
			</Link>
		</div>
	);
};
