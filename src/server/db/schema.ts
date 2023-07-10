import { mysqlTable, varchar, int, text, uniqueIndex, index, timestamp, date, primaryKey, boolean, time } from "drizzle-orm/mysql-core";
import { relations, InferModel } from "drizzle-orm";

export const user = mysqlTable(
  "users",
  {
    id: varchar("id", { length: 24 }).notNull(),
    username: varchar("username", { length: 48 }).notNull(),
    name: varchar("name", { length: 32 }),
    isBanned: boolean("is_banned").default(false).notNull(),
    role: varchar("role", { enum: ["admin", "user", "partner"], length: 8 })
      .notNull()
      .default("user"),
    email: varchar("email", { length: 191 }).notNull(),
    emailVerified: timestamp("emailVerified"),
    shortBio: varchar("shortBio", { length: 64 }),
    longBio: text("longBio"),
    facebook: varchar("facebook", { length: 191 }),
    instagram: varchar("instagram", { length: 191 }),
    discord: varchar("discord", { length: 191 }),
    banner: varchar("banner", { length: 191 }),
    image: varchar("image", { length: 191 }),
  },
  table => {
    return {
      emailIdx: uniqueIndex("email_idx").on(table.email),
      pk: primaryKey(table.id, table.email),
    };
  }
);

export type User = InferModel<typeof user, "select">;

export type ROLE = InferModel<typeof user, "select">["role"];

export const account = mysqlTable(
  "accounts",
  {
    id: varchar("id", { length: 24 }).primaryKey().notNull(),
    userId: varchar("userId", { length: 36 }).notNull(),
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
    id: varchar("id", { length: 24 }).primaryKey().notNull(),
    sessionToken: varchar("sessionToken", { length: 191 }).notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
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
    token: varchar("token", { length: 191 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  table => {
    return {
      compoundKey: primaryKey(table.indentifier, table.token),
    };
  }
);

export const service = mysqlTable("service", {
  id: varchar("id", { length: 24 }).primaryKey().notNull(),
  user_id: varchar("user_id", { length: 24 }).notNull(),
  discount_id: varchar("discount_id", { length: 24 }),
  service_desc: varchar("service_desc", { length: 191 }),
  service_name: varchar("service_name", { length: 191 }).notNull(),
  service_price: int("service_price").notNull(),
  minimum_hour: int("minimum_hour").notNull(),
  is_available: boolean("is_available").notNull(),
  unit: varchar("unit", { enum: ["game", "time"], length: 8 }).notNull(),
  apply_schedule: boolean("apply_schedule").notNull(),
  start_time: int("start_time").notNull(),
  end_time: int("end_time").notNull(),
});

export const discount = mysqlTable("discount", {
  id: varchar("id", { length: 24 }).primaryKey().notNull(),
  user_id: varchar("user_id", { length: 24 }).notNull(),
  discount_percent: int("discount_percent").notNull(),
  is_active: boolean("is_active").notNull(),
  start_date: timestamp("start_date", { mode: "date" }).notNull(),
  end_date: timestamp("end_date", { mode: "date" }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  deleted_at: timestamp("deleted_at", { mode: "date" }),
});

export const order = mysqlTable(
  "order",
  {
    id: varchar("id", { length: 24 }).notNull(),
    user_id: varchar("user_id", { length: 24 }).notNull(),
    partner_id: varchar("partner_id", { length: 24 }).notNull(),
    service_id: varchar("service_id", { length: 24 }).notNull(),
    code: varchar("code", { length: 8 }).notNull(),
    service_name: varchar("service_name", { length: 191 }).notNull(),
    service_price: int("service_price").notNull(),
    total_amount: int("total_amount").notNull(),
    refunded_amount: int("refunded_amount").notNull(),
    total_service_completed: int("total_service_completed").notNull(),
    total_service_requested: int("total_service_requested").notNull(),
    order_status: varchar("status", { enum: ["pending", "accepted", "rejected", "completed"], length: 8 }).notNull(),
    payment_status: varchar("payment_status", { enum: ["pending", "paid", "refunded"], length: 8 }).notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  table => {
    return {
      pk: primaryKey(table.id, table.code),
    };
  }
);

export const rating = mysqlTable("rating", {
  id: varchar("id", { length: 24 }).primaryKey().notNull(),
  user_id: varchar("user_id", { length: 24 }).notNull(),
  partner_id: varchar("partner_id", { length: 24 }).notNull(),
  rating: int("rating").notNull(),
  comment: varchar("comment", { length: 191 }),
  is_deleted: boolean("is_deleted").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const userRelations = relations(user, ({ many }) => ({
  accounts: many(account),
  sessions: many(session),
  orders: many(order),
  services: many(service),
  ratings: many(rating),
  discounts: many(discount),
}));

export const orderRelations = relations(order, ({ one }) => ({
  user: one(user, {
    fields: [order.user_id],
    references: [user.id],
  }),
  partner: one(user, {
    fields: [order.partner_id],
    references: [user.id],
  }),
  service: one(service, {
    fields: [order.service_id],
    references: [service.id],
  }),
}));

export const ratingRelations = relations(rating, ({ one }) => ({
  user: one(user, {
    fields: [rating.user_id],
    references: [user.id],
  }),
  partner: one(user, {
    fields: [rating.partner_id],
    references: [user.id],
  }),
}));

export const discountRelations = relations(discount, ({ one }) => ({
  user: one(user, {
    fields: [discount.user_id],
    references: [user.id],
  }),
  service: one(service, {
    fields: [discount.id],
    references: [service.id],
  }),
}));

export const serviceRelations = relations(service, ({ one }) => ({
  user: one(user, {
    fields: [service.user_id],
    references: [user.id],
  }),
  discount: one(discount, {
    fields: [service.discount_id],
    references: [discount.id],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
