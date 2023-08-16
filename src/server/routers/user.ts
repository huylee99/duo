import { authedProcedure, createTRPCRouter } from "../trpc";
import { updateSingleImageValidatorSchema, updateUsernameValidatorSchema, updateProfileValidatorSchema, updateSocialsValidatorSchema, updateLongBioValidatorSchema } from "~/shared/validators/update-profile-validator";
import { user as userSchema, rating as ratingSchema, service as serviceSchema } from "../db/schema";
import { eq, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import * as z from "zod";

const me = authedProcedure.query(async ({ ctx }) => {
  const user = await ctx.db.query.user.findFirst({
    where: (user, { eq }) => eq(user.email, ctx.session.user.email!),
  });

  return user;
});

const getUsers = authedProcedure.input(z.object({ pageSize: z.number(), pageIdx: z.number() })).query(async ({ ctx, input }) => {
  const { db } = ctx;

  const users = await db.query.user.findMany({
    limit: input.pageSize,
    offset: input.pageIdx * input.pageSize,
  });

  const total = await ctx.db.select({ count: sql<number>`count(*)` }).from(userSchema);

  const pageCount = Math.ceil(total[0].count / input.pageSize);

  return { users, total: total[0].count, pageCount };
});

const getUserByUsername = authedProcedure.input(z.object({ username: z.string() })).query(async ({ ctx, input }) => {
  const { db } = ctx;

  const user = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.username, input.username),
    with: {
      services: true,
    },
  });

  if (!user) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Không tìm thấy người dùng." });
  }

  return user;
});

const updateAvatar = authedProcedure.input(updateSingleImageValidatorSchema).mutation(async ({ ctx, input }) => {
  const { db } = ctx;

  await db.update(userSchema).set({ image: input.image }).where(eq(userSchema.id, ctx.session.user.id));
});

const updateBanner = authedProcedure.input(updateSingleImageValidatorSchema).mutation(async ({ ctx, input }) => {
  const { db } = ctx;

  await db.update(userSchema).set({ banner: input.image }).where(eq(userSchema.id, ctx.session.user.id));
});

const updateUsername = authedProcedure.input(updateUsernameValidatorSchema).mutation(async ({ ctx, input }) => {
  const { db } = ctx;

  const existedUsername = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.username, input.username),
  });

  if (existedUsername) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Username đã tồn tại." });
  }

  await db.update(userSchema).set({ username: input.username }).where(eq(userSchema.id, ctx.session.user.id));

  return input.username;
});

const updateProfile = authedProcedure.input(updateProfileValidatorSchema).mutation(async ({ ctx, input }) => {
  const { db } = ctx;

  await db
    .update(userSchema)
    .set({
      name: input.name,
      shortBio: input.shortBio,
    })
    .where(eq(userSchema.id, ctx.session.user.id));

  return { ...input };
});

const updateSocials = authedProcedure.input(updateSocialsValidatorSchema).mutation(async ({ ctx, input }) => {
  const { db } = ctx;

  await db
    .update(userSchema)
    .set({
      facebook: input.facebook,
      instagram: input.instagram,
      discord: input.discord,
    })
    .where(eq(userSchema.id, ctx.session.user.id));

  return { ...input };
});

const updateLongBio = authedProcedure.input(updateLongBioValidatorSchema).mutation(async ({ ctx, input }) => {
  const { db } = ctx;

  await db
    .update(userSchema)
    .set({
      longBio: input.longBio,
    })
    .where(eq(userSchema.id, ctx.session.user.id));

  return { longBio: input.longBio as string };
});

const user = createTRPCRouter({
  me,
  updateAvatar,
  updateBanner,
  updateUsername,
  updateProfile,
  updateSocials,
  updateLongBio,
  getUsers,
  getUserByUsername,
});

export default user;
