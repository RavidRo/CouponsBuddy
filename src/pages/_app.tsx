// src/pages/_app.tsx
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { createWSClient, wsLink } from "@trpc/client/links/wsLink";

import { withTRPC } from "@trpc/next";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/app";
import superjson from "superjson";
import { Layout } from "../components/Layout";
import type { AppRouter } from "../server/router";
import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
	Component,
	pageProps: { session, ...pageProps },
}) => {
	return (
		<SessionProvider session={session}>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</SessionProvider>
	);
};

const getDomainName = () => {
	if (process.env.VERCEL_URL) return `${process.env.VERCEL_URL}`; // SSR should use vercel url
	return `localhost`;
};

const getBaseUrl = () => {
	if (typeof window !== "undefined") return ""; // browser should use relative url
	const domain = getDomainName();
	if (process.env.VERCEL_URL) return `https://${domain}`; // SSR should use vercel url
	return `http://${domain}:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

function getEndingLink() {
	const url = `${getBaseUrl()}/api/trpc`;

	if (typeof window === "undefined") {
		return httpBatchLink({ url });
	}
	const client = createWSClient({
		url: `ws://${getDomainName()}:3001`,
	});
	return wsLink<AppRouter>({ client });
}

export default withTRPC<AppRouter>({
	config({ ctx }) {
		/**
		 * If you want to use SSR, you need to use the server's full URL
		 * @link https://trpc.io/docs/ssr
		 */

		return {
			links: [
				loggerLink({
					enabled: (opts) =>
						process.env.NODE_ENV === "development" ||
						(opts.direction === "down" && opts.result instanceof Error),
				}),
				getEndingLink(),
			],
			transformer: superjson,
			/**
			 * @link https://react-query.tanstack.com/reference/QueryClient
			 */
			// queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },

			headers() {
				if (ctx?.req) {
					return { ...ctx.req.headers };
				}
				return {};
			},

			// To use SSR properly you need to forward the client's headers to the server
			// headers: () => {
			//   if (ctx?.req) {
			//     const headers = ctx?.req?.headers;
			//     delete headers?.connection;
			//     return {
			//       ...headers,
			//       "x-ssr": "1",
			//     };
			//   }
			//   return {};
			// }
		};
	},
	/**
	 * @link https://trpc.io/docs/ssr
	 */
	ssr: false,
})(MyApp);
