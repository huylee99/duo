import { mysqlTable, varchar, int, text, uniqueIndex, index, timestamp, date, primaryKey } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

export const user = mysqlTable(
  "users",
  {
    id: varchar("id", { length: 36 }).notNull(),
    name: varchar("name", { length: 191 }),
    email: varchar("email", { length: 191 }).notNull(),
    emailVerified: timestamp("emailVerified"),
    image: varchar("image", { length: 191 }),
  },
  table => {
    return {
      emailIdx: uniqueIndex("email_idx").on(table.email),
      pk: primaryKey(table.id, table.email),
    };
  }
);

export const account = mysqlTable(
  "accounts",
  {
    id: varchar("id", { length: 36 }).primaryKey().notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    type: varchar("type", { length: 191 }).notNull(),
    provider: varchar("provider", { length: 191 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 191 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 191 }),
    scope: varchar("scope", { length: 191 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 191 }),
  },
  table => {
    return {
      providerAccountIdIndex: uniqueIndex("providerAccountId_idx").on(table.providerAccountId, table.provider),
      userIdIdx: uniqueIndex("userId_idx").on(table.userId),
    };
  }
);

export const session = mysqlTable(
  "sessions",
  {
    id: varchar("id", { length: 36 }).primaryKey().notNull(),
    sessionToken: varchar("sessionToken", { length: 191 }).notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    expires: date("expires").notNull(),
  },
  table => {
    return {
      userIdIdx: index("userId_idx").on(table.userId),
      sessionTokenIdx: uniqueIndex("sessionToken_idx").on(table.sessionToken),
    };
  }
);

export const verificationToken = mysqlTable(
  "verificationToken",
  {
    indentifier: varchar("identifier", { length: 191 }).notNull(),
    token: varchar("token", { length: 191 }).notNull().primaryKey(),
    expires: date("expires").notNull(),
  },
  table => {
    return { tokenIdx: uniqueIndex("token_idx").on(table.token) };
  }
);

export const userRelations = relations(user, ({ many }) => ({
  accounts: many(account),
  sessions: many(session),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user),
}));

export const accountRelations = relations(session, ({ one }) => ({
  user: one(user),
}));
