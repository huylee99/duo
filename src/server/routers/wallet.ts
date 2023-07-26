import { authedProcedure, createTRPCRouter } from "../trpc";
import { TRPCError } from "@trpc/server";
import { wallet as walletSchema, transaction as transactionSchema } from "../db/schema";
import * as z from "zod";
import { rechargeValidatorRequestSchema } from "../db/validator-schema";
import { createId } from "@paralleldrive/cuid2";

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
    payment_method: "momo",
    status: "pending",
    user_id: ctx.session.user.id,
    id: createId(),
  });
});

const walletRouter = createTRPCRouter({
  recharge,
});

export default walletRouter;
