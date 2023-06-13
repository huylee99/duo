import { db } from "~/server/db/root";
import { DrizzleAdapter } from "~/lib/auth-adapter";
import GoogleProvider from "next-auth/providers/google";
import NextAuth, { getServerSession, type NextAuthOptions } from "next-auth";
import { env } from "~/env.mjs";
import { GetServerSidePropsContext } from "next";

if (process.env["GOOGLE_CLIENT_ID"] === undefined || process.env["GOOGLE_CLIENT_SECRET"] === undefined) {
  throw new Error("Missing environment variables for Google OAuth");
}

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  session: {
    strategy: "jwt",
  },
  pages: {
    error: "/login",
    signIn: "/login",
  },
  secret: env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);

export const getServerAuthSession = (ctx: { req: GetServerSidePropsContext["req"]; res: GetServerSidePropsContext["res"] }) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
