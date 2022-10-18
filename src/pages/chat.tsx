import { NextPage } from "next";
import Link from "next/link";
import { Page } from "../components/NavigationBar";
import { FriendsLayout } from "../Layouts/FriendsLayout";
import { NavigationBarLayout } from "../Layouts/NavigationBarLayout";

const Home: NextPage = () => {
	return (
		<FriendsLayout>
			<NavigationBarLayout page={Page.Chat}>
				<Link href={"/"}>
					<a href="#" className="mt-10 text-blue-800 hover:text-blue-600">
						Return to Home
					</a>
				</Link>
			</NavigationBarLayout>
		</FriendsLayout>
	);
};

export default Home;
