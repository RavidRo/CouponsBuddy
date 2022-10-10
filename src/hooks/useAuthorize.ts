import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function useAuthorize(redirectUrl = "/") {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      // Make sure we're in the browser
      if (typeof window !== "undefined") {
        router.push(redirectUrl);
      } else {
        console.error(
          "Tried to do a client-redirect in a non-browser environment"
        );
      }
    }
  }, [redirectUrl, router, status]);

  return [status];
}
