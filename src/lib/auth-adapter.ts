import type { Adapter } from "next-auth/adapters";
import type { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless";
import { user, account, session, verificationToken } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";
import * as schema from "../server/db/schema";

export function DrizzleAdapter(db: PlanetScaleDatabase<typeof schema>): Adapter {
  return {
    createUser: async data => {
      await db.insert(user).values({
        email: data.email,
        emailVerified: data.emailVerified,
        image: data.image,
        name: data.name,
        id: randomUUID(),
      });
      const rows = await db.select().from(user).where(eq(user.email, data.email)).limit(1);

      if (!rows[0]) {
        throw new Error("Failed to create user");
      }

      return rows[0];
    },
    getUser: async id => {
      const result = await db.select().from(user).where(eq(user.id, id)).limit(1);

      return result[0];
    },
    getUserByEmail: async email => {
      const result = await db.select().from(user).where(eq(user.email, email)).limit(1);
      return result[0];
    },
    getUserByAccount: async data => {
      const result = await db
        .select()
        .from(user)
        .innerJoin(account, eq(account.userId, user.id))
        .where(and(eq(account.providerAccountId, data.providerAccountId), eq(account.provider, data.provider)))
        .limit(1);

      if (result[0] && result[0].users) {
        return result[0].users;
      }

      return null;
    },

    updateUser: async ({ id, ...data }) => {
      await db.update(user).set(data).where(eq(user.id, id));
      const rows = await db.select().from(user).where(eq(user.id, id)).limit(1);

      return rows[0];
    },
    deleteUser: async id => {
      await db.delete(user).where(eq(user.id, id));
    },
    linkAccount: async data => {
      await db.insert(account).values({ ...data, id: randomUUID() });
    },
    unlinkAccount: async ({ provider, providerAccountId }) => {
      await db.delete(account).where(and(eq(account.provider, provider), eq(account.providerAccountId, providerAccountId)));
    },
    getSessionAndUser: async sessionToken => {
      const result = await db.select().from(session).where(eq(session.sessionToken, sessionToken)).leftJoin(user, eq(session.userId, user.id)).limit(1);

      if (result[0] && result[0].sessions && result[0].users) {
        return { session: result[0].sessions, user: result[0].users };
      }

      return null;
    },
    createSession: async data => {
      await db.insert(session).values({ ...data, id: randomUUID() });
      const insertedSession = await db.select().from(session).where(eq(session.sessionToken, data.sessionToken)).limit(1);

      return insertedSession[0];
    },
    updateSession: async data => {
      await db.update(session).set(data).where(eq(session.sessionToken, data.sessionToken));
      const rows = await db.select().from(session).where(eq(session.sessionToken, data.sessionToken)).limit(1);

      return rows[0];
    },
    deleteSession: async sessionToken => {
      await db.delete(session).where(eq(session.sessionToken, sessionToken));
    },
    createVerificationToken: async data => {
      await db.insert(verificationToken).values({ expires: data.expires, indentifier: data.identifier, token: data.token });

      const rows = await db.select().from(verificationToken).where(eq(verificationToken.token, data.token)).limit(1);

      const token = rows[0];

      return {
        expires: token.expires,
        identifier: token.indentifier,
        token: token.token,
      };
    },
    useVerificationToken: async data => {
      try {
        const token = await db.select().from(verificationToken).where(eq(verificationToken.token, data.token)).limit(1);
        await db.delete(verificationToken).where(eq(verificationToken.token, data.token));

        return {
          expires: token[0].expires,
          identifier: token[0].indentifier,
          token: token[0].token,
        };
      } catch (error) {
        return null;
      }
    },
  };
}
