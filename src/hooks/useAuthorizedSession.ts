import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export function useAuthorizedSession(redirectUrl = "/") {
	const router = useRouter();
	const { status, data } = useSession({
		required: true,
		onUnauthenticated() {
			router.push(redirectUrl);
		},
	});

	return { status, data };
}
