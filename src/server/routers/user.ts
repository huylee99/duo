import { authedProcedure, createTRPCRouter } from "../trpc";
import { updateSingleImageValidatorSchema, updateUsernameValidatorSchema, updateProfileValidatorSchema, updateSocialsValidatorSchema, updateLongBioValidatorSchema } from "~/shared/validators/update-profile-validator";
import { user as userSchema } from "../db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

const me = authedProcedure.query(async ({ ctx }) => {
  const user = await ctx.db.query.user.findFirst({
    where: (user, { eq }) => eq(user.email, ctx.session.user.email!),
  });

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
});

export default user;
