import Head from "next/head";
import type { FC } from "react";

interface Props {
	children: React.ReactNode;
}

export const Layout: FC<Props> = (props) => {
	return (
		<>
			<Head>
				<title>Coupon Buddies</title>
				<meta name="description" content="Exchange coupons with your buddies" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="container relative mx-auto flex h-screen border-2 border-black">
				{props.children}
			</main>
		</>
	);
};
