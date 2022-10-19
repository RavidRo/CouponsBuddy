import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "../../../env/server";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
	debug: env.NODE_ENV === "development" && env.NEXTAUTH_DEBUG === "true",
	callbacks: {
		// Include user.id on session
		session({ session, user }) {
			if (session.user) {
				session.user.id = user.id;
			}
			return session;
		},
	},
	adapter: PrismaAdapter(prisma),
	providers: [
		DiscordProvider({
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET,
		}),
		// Auth0Provider({
		//   clientId: env.AUTH0_CLIENT_ID,
		//   clientSecret: env.AUTH0_CLIENT_SECRET,
		//   issuer: env.AUTH0_ISSUER,
		// }),
	],
};

export default NextAuth(authOptions);

// Authorization with third-party providers:
// 1. Sign-in request from server

// Per Provider------------------
// ClientID:
// ClientSecret:

// ENV---------------------------
// NEXTAUTH_URL: canonical URL of your site
// NEXTAUTH_SECRET: to encrypt the NextAuth.js JWT

// Options-----------------------

// GET/POST /api/auth/callback/:provider: Handles returning requests *from* OAuth services during sign-in.
