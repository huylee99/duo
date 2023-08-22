import { authedProcedure, createTRPCRouter } from "../trpc";
import { TRPCError } from "@trpc/server";
import { transaction as transactionSchema, wallet as walletSchema } from "../db/schema";
import { rechargeValidatorRequestSchema } from "../db/validator-schema";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";

const recharge = authedProcedure.input(rechargeValidatorRequestSchema).mutation(async ({ ctx, input }) => {
  const wallet = await ctx.db.query.wallet.findFirst({
    where: (wallet, { eq }) => eq(wallet.user_id, ctx.session.user.id),
  });

  if (!wallet) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Ví không tồn tại." });
  }

  await ctx.db.insert(transactionSchema).values({
    amount: input.amount,
    wallet_id: wallet.id,
    type: "deposit",
    payment_method: input.payment_method,
    status: "completed",
    user_id: ctx.session.user.id,
    id: createId(),
  });

  await ctx.db
    .update(walletSchema)
    .set({ balance: wallet.balance + input.amount })
    .where(eq(walletSchema.id, wallet.id));
});

const getBalance = authedProcedure.query(async ({ ctx }) => {
  const wallet = await ctx.db.query.wallet.findFirst({
    where: (wallet, { eq }) => eq(wallet.user_id, ctx.session.user.id),
  });

  if (!wallet) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Ví không tồn tại." });
  }

  return {
    balance: wallet.balance,
  };
});

const walletRouter = createTRPCRouter({
  recharge,
  getBalance,
});

export default walletRouter;
