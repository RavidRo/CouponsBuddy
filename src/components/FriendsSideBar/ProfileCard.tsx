import { FC, useState } from "react";
import { Send, UserPlus } from "react-feather";

import { trpc } from "../../utils/trpc";

import { useAuthorizedSession } from "../../hooks/useAuthorizedSession";
import { IconButton } from "../IconButton";
import { ProfilePicture } from "../ProfilePicture";

export const ProfileCard: FC = () => {
	const { data, status } = useAuthorizedSession();
	const [inviting, setInviting] = useState(false);

	if (status === "loading") {
		return <p>Loading...</p>;
	}

	if (data?.user?.id === undefined) {
		return <p>Error: Could not get your id</p>;
	}

	return (
		<div>
			<div className="flex flex-row items-center justify-between p-1 pr-4">
				<span className="h-10 w-10">
					<ProfilePicture image={data?.user?.image} />
				</span>
				<IconButton onClick={() => setInviting((prev) => !prev)}>
					<UserPlus />
				</IconButton>
			</div>
			<div
				className={
					"overflow-hidden transition-all " + (inviting ? "h-14" : "h-0")
				}
			>
				<InviteSection myId={data.user.id} />
			</div>
		</div>
	);
};

interface InviteSectionProps {
	myId: string;
}

const InviteSection: FC<InviteSectionProps> = (props) => {
	const invite = trpc.useMutation("friends.invite");
	const accept = trpc.useMutation("friends.accept");

	const [invitedEmail, setInvitedID] = useState("");

	const handleInvite = async () => {
		try {
			const f = await invite.mutateAsync({ email: invitedEmail });
			if (f.invitedId === props.myId) {
				accept.mutateAsync({ friendshipID: f.id });
			}
		} catch (e) {
		} finally {
			setInvitedID("");
		}
	};

	return (
		<div className="flex flex-col  p-2">
			<div className="flex flex-row gap-1">
				<input
					type={"text"}
					placeholder={"Buddy's email..."}
					autoComplete={"email"}
					value={invitedEmail}
					onChange={(e) => setInvitedID(e.target.value)}
				/>
				<IconButton>
					<Send onClick={handleInvite} />
				</IconButton>
			</div>

			{invite.isSuccess ? (
				<p className="text-green-500">Invited!</p>
			) : invite.isLoading ? (
				<p>Loading...</p>
			) : invite.error ? (
				<p className="text-red-500">{invite.error.message}</p>
			) : null}
		</div>
	);
};
