import { authedProcedure, createTRPCRouter } from "../trpc";

const me = authedProcedure.query(async ({ ctx }) => {
  const user = await ctx.db.query.user.findFirst({
    where: (user, { eq }) => eq(user.email, ctx.session.user.email!),
  });

  return user;
});

const user = createTRPCRouter({
  me,
});

export default user;
