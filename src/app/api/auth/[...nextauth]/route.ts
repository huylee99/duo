import { db } from "~/db/root";
import { DrizzleAdapter } from "~/lib/auth-adapter";
import GoogleProvider from "next-auth/providers/google";
import NextAuth, { getServerSession, type NextAuthOptions } from "next-auth";

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
  secret: "abc",
};

const handler = NextAuth(authOptions);

export const getSession = () => getServerSession(authOptions);

export { handler as GET, handler as POST };
