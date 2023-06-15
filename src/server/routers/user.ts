import { TRPCError } from "@trpc/server";
import { authedProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { authSchema } from "~/shared/validators/auth-validator";
import { user as userTable, account as accountTable } from "../db/schema";
import { hash } from "bcryptjs";
import { randomUUID } from "crypto";

const me = authedProcedure.query(async ({ ctx }) => {
  const user = await ctx.db.query.user.findFirst({
    where: (user, { eq }) => eq(user.email, ctx.session.user.email!),
  });

  return user;
});

const createUser = publicProcedure.input(authSchema).mutation(async ({ ctx, input }) => {
  const { db } = ctx;

  const existedUser = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.email, input.email),
  });

  if (existedUser) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Email đã tồn tại." });
  }

  const hashedPassword = await hash(input.password, 8);

  const id = randomUUID();

  await db.insert(userTable).values({
    email: input.email,
    id,
  });

  await db.insert(accountTable).values({
    hashedPassword,
    id: randomUUID(),
    provider: "credentials",
    providerAccountId: randomUUID(),
    type: "credentials",
    userId: id,
  });
});

const user = createTRPCRouter({
  me,
  createUser,
});

export default user;
