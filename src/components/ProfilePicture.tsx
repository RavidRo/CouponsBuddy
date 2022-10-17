import Image from "next/image";
import type { FC } from "react";

interface Props {
	image?: string | null;
}

export const ProfilePicture: FC<Props> = (props) => {
	return (
		<div className="relative h-full w-full overflow-hidden rounded-full">
			<Image
				layout="fill"
				src={props.image ?? "/images/default-profile.png"}
				alt="Friend's profile picture"
			/>
		</div>
	);
};
