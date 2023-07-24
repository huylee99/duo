import { insertDiscountRequestSchema } from "../db/validator-schema";
import { authedProcedure, createTRPCRouter } from "../trpc";
import { TRPCError } from "@trpc/server";
import { discount as discountSchema } from "../db/schema";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { z } from "zod";

const getMany = authedProcedure.query(async ({ ctx }) => {
  const { db } = ctx;
  const data = await db.query.discount.findMany({
    where: (discount, { eq }) => eq(discount.user_id, ctx.session.user.id),
    columns: {
      created_at: false,
      deleted_at: false,
    },
  });

  if (!data) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Không tìm thấy dữ liệu" });
  }

  return data;
});

const create = authedProcedure.input(insertDiscountRequestSchema).mutation(async ({ ctx, input }) => {
  const { db } = ctx;

  const id = createId();
  const data = { ...input, id, user_id: ctx.session.user.id };

  await db.insert(discountSchema).values(data);
  const discount = await db.query.discount.findFirst({
    where: (discount, { eq }) => eq(discount.id, id),
    columns: {
      created_at: false,
      deleted_at: false,
    },
  });

  if (!discount) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Không tìm thấy dữ liệu" });
  }

  return discount;
});

const update = authedProcedure.input(insertDiscountRequestSchema.merge(z.object({ id: z.string().length(24) }))).mutation(async ({ ctx, input }) => {
  const { db } = ctx;

  await db.update(discountSchema).set(input).where(eq(discountSchema.id, input.id));

  return input;
});

const remove = authedProcedure.input(z.object({ id: z.string().length(24) })).mutation(async ({ ctx, input }) => {
  const { db } = ctx;

  await db.update(discountSchema).set({ deleted_at: new Date() }).where(eq(discountSchema.id, input.id));

  return input.id;
});

const discountRouter = createTRPCRouter({
  create,
  getMany,
  update,
  remove,
});

export default discountRouter;
