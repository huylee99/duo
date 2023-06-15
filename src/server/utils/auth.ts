import { db } from "~/server/db/root";
import { DrizzleAdapter } from "~/lib/auth-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { getServerSession, type NextAuthOptions, type DefaultUser, DefaultSession } from "next-auth";
import { env } from "~/env.mjs";
import { GetServerSidePropsContext } from "next";
import { compare } from "bcryptjs";
import type { ROLE } from "../db/schema";
import { DefaultJWT } from "next-auth/jwt";
import { account, user } from "../db/schema";
import { eq } from "drizzle-orm";
import { sign, verify } from "jsonwebtoken";
import dayjs from "dayjs";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

declare module "next-auth" {
  interface User extends DefaultUser {
    role: ROLE;
    isBanned: boolean;
    refreshToken: string;
    accessToken: string;
    expires_at: number;
  }

  interface Session extends DefaultSession {
    user: {
      role?: ROLE;
      id?: string;
    } & DefaultSession["user"];
    error?: "RefreshAccessTokenError";
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    user?: {
      role?: ROLE;
      is_banned?: boolean;
      id?: string;
    };
    accessToken?: string;
    expires_at?: number;
    error?: "RefreshAccessTokenError";
  }
}

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    // GoogleProvider({
    //   clientId: env.GOOGLE_CLIENT_ID,
    //   clientSecret: env.GOOGLE_CLIENT_SECRET,
    //   allowDangerousEmailAccountLinking: true,
    // }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await db.query.user.findFirst({
          where: (user, { eq }) => eq(user.email, credentials.email),
          with: {
            accounts: {
              // @ts-ignore type error, probably drizzle's bug
              where: (account, { eq }) => eq(account.provider, "credentials"),
            },
          },
        });

        if (!user) {
          throw new Error("Tài khoản không tồn tại");
        }
        const { ...rest } = user;

        const userAccount = user.accounts[0];

        const isPasswordMatched = await compare(credentials.password, userAccount.hashedPassword!);

        if (!isPasswordMatched) {
          throw new Error("Sai tài khoản hoặc mật khẩu");
        }

        const accessToken = sign({ user_id: user.id }, env.NEXTAUTH_SECRET, { expiresIn: "30s" });
        const refreshToken = sign({ user_id: user.id }, env.NEXTAUTH_SECRET, { expiresIn: "7d" });
        const expires_at = Math.floor(Date.now() / 1000) + 30;

        await db.update(account).set({ access_token: accessToken, refresh_token: refreshToken }).where(eq(account.userId, user.id));

        return { ...rest, refreshToken, accessToken, expires_at };
      },
    }),
  ],
  callbacks: {
    signIn: async ({ user: adapterUser, account, profile }) => {
      if (!adapterUser.email) {
        return false;
      }

      const isUserBanned = await db.query.user.findFirst({
        where: (user, { eq, and }) => and(eq(user.email, adapterUser.email!), eq(user.isBanned, true)),
      });

      if (isUserBanned) {
        return false;
      }

      if (account?.provider === "google") {
        await db.update(user).set({ image: profile?.image, name: profile?.name }).where(eq(user.email, adapterUser.email));
      }

      return true;
    },
    jwt: async ({ token, user: adapterUser, trigger }) => {
      const email = token.email;

      if (!email) {
        return {};
      }

      const user = await db.query.user.findFirst({
        where: (user, { eq, and }) => and(eq(user.email, email), eq(user.isBanned, false)),
      });

      if (!user) {
        return {};
      }

      if (trigger === "update") {
        token.name = user?.name;
        token.email = user?.email;
        token.picture = user?.image;
        token.user = {
          id: user?.id,
          is_banned: user?.isBanned,
          role: user?.role,
        };
      }

      if (adapterUser) {
        token.user = {
          id: adapterUser.id,
          role: adapterUser.role,
          is_banned: adapterUser.isBanned,
        };
        token.email = adapterUser.email;
        token.name = adapterUser.name;
        token.picture = adapterUser.image;
        token.expires_at = adapterUser.expires_at;
        token.accessToken = adapterUser.accessToken;
      } else if (token.expires_at && token.expires_at > Date.now() / 1000) {
        return token;
      } else {
        try {
          const userAccount = await db.query.account.findFirst({
            // @ts-ignore type error, probably drizzle's bug
            where: (account, { eq, and }) => and(eq(account.userId, user.id), eq(account.provider, "credentials")),
          });

          if (userAccount && userAccount.refresh_token) {
            const isTokenValid = verify(userAccount.refresh_token, env.NEXTAUTH_SECRET);

            if (!isTokenValid) {
              throw new Error("RefreshAccessTokenError");
            }

            const newAccessToken = sign({ user_id: user.id }, env.NEXTAUTH_SECRET, { expiresIn: "30s" });
            const expires_at = Math.floor(Date.now() / 1000) + 30;

            return {
              ...token,
              user: {
                id: user.id,
                role: user.role,
                is_banned: user.isBanned,
              },
              accessToken: newAccessToken,
              expires_at,
            };
          }
        } catch (error) {
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }

      return token;
    },

    session: ({ session, token }) => {
      if (token) {
        session.user = {
          ...session.user,
          id: token.sub,
          role: token.user?.role,
          email: token.email,
          image: token.picture,
          name: token.name,
        };
        session.error = token.error;
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
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);

export const getServerAuthSession = (ctx: { req: GetServerSidePropsContext["req"]; res: GetServerSidePropsContext["res"] }) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
