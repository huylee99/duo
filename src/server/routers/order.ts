import { createTRPCRouter, authedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { order as orderSchema } from "../db/schema";
import { createId } from "@paralleldrive/cuid2";

import { orderValidatorSchema } from "../db/validator-schema";

const create = authedProcedure.input(orderValidatorSchema).mutation(async ({ ctx, input }) => {
  const { db } = ctx;
  const { service_id, partner_id, total_amount, total_service_requested } = input;

  const service = await db.query.service.findFirst({
    where: (service, { eq }) => eq(service.id, input.service_id),
  });

  if (!service) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Không tìm thấy dữ liệu" });
  }

  const totalAmount = service.service_price * total_service_requested;

  if (totalAmount !== total_amount) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Số tiền không hợp lệ" });
  }

  const id = createId();

  // generate order code with 8 characters using crypto
  const orderCode = Math.random().toString(36).substring(2, 10).toUpperCase();

  await db.insert(orderSchema).values({
    code: orderCode,
    order_status: "pending",
    partner_id: partner_id,
    service_id: service_id,
    total_amount: total_amount,
    total_service_requested: total_service_requested,
    user_id: ctx.session.user.id,
    id: id,
    payment_status: "pending",
    refunded_amount: 0,
    total_service_completed: 0,
  });

  return {
    id: id,
  };
});

const orderRouter = createTRPCRouter({
  create,
});

export default orderRouter;
