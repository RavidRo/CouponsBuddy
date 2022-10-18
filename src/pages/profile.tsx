import { NextPage } from "next";
import Link from "next/link";
import { FriendsLayout } from "../components/FriendsSideBar/FriendsLayout";

const Home: NextPage = () => {
	return (
		<FriendsLayout>
			<h1 className="mb-20 text-3xl">Profile Page</h1>

			<Link href={"/"}>
				<a href="#" className="mt-10 text-blue-800 hover:text-blue-600">
					Return to Home
				</a>
			</Link>
		</FriendsLayout>
	);
};

export default Home;
