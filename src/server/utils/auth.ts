import { db } from "~/server/db/root";
import { DrizzleAdapter } from "~/lib/auth-adapter";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import EmailProvider from "~/lib/email-provider";

import NextAuth, { getServerSession, type NextAuthOptions, type DefaultUser, DefaultSession } from "next-auth";
import { env } from "~/env.mjs";
import { GetServerSidePropsContext } from "next";
import type { ROLE } from "../db/schema";
import { DefaultJWT } from "next-auth/jwt";
import { user } from "../db/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "~/lib/email";
import MagicLinkEmail from "~/components/email/magic-link-email";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

declare module "next-auth" {
  interface User extends DefaultUser {
    role: ROLE;
    isBanned: boolean;
    username: string;
  }

  interface Session extends DefaultSession {
    user: {
      role: ROLE;
      id: string;
      isBanned: boolean;
      username: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
      authorization: env.DISCORD_AUTH_URL,
    }),
    EmailProvider({
      async sendVerificationRequest({ identifier, url }) {
        await sendEmail({
          to: identifier,
          from: "onboarding@resend.dev",
          subject: "Link đăng nhập vnpal.gg",
          react: MagicLinkEmail({ magicLink: url }),
        });
      },
    }),
  ],
  callbacks: {
    signIn: async ({ user: adapterUser, account, profile }) => {
      const email = adapterUser.email;

      if (!email) {
        return false;
      }

      const isUserBanned = await db.query.user.findFirst({
        where: (user, { eq, and }) => and(eq(user.email, email), eq(user.isBanned, true)),
      });

      if (isUserBanned) {
        return false;
      }

      if (account?.provider === "google") {
        await db.update(user).set({ image: profile?.image, name: profile?.name }).where(eq(user.email, email));
      }

      return true;
    },
    session: async ({ session, user, trigger }) => {
      const email = user.email;

      if (!email) {
        throw new Error("SessionExpired");
      }

      const existedUser = await db.query.user.findFirst({
        where: (user, { eq, and }) => and(eq(user.email, email), eq(user.isBanned, false)),
      });

      if (!existedUser) {
        throw new Error("BannedUser");
      }

      if (trigger === "update") {
        session.user = {
          id: existedUser.id,
          role: existedUser.role,
          isBanned: existedUser.isBanned,
          email: existedUser.email,
          image: existedUser.image,
          name: existedUser.name,
          username: existedUser.username,
        };
      }

      if (user) {
        const { emailVerified, ...rest } = user;
        session.user = rest;
      }

      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
  debug: env.NODE_ENV === "development",
  pages: {
    signIn: "/login",
  },
  secret: env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);

export const getServerAuthSession = (ctx: { req: GetServerSidePropsContext["req"]; res: GetServerSidePropsContext["res"] }) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
