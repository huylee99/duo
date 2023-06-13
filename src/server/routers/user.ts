import { authedProcedure } from "../trpc";

const me = authedProcedure.query(async ({ ctx }) => {
  const user = await ctx.db.query.user.findFirst({
    where: (user, { eq }) => eq(user.email, ctx.session.user.email!),
  });

  return user;
});

export { me };
