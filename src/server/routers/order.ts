import { createTRPCRouter, authedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { order as orderSchema, wallet as walletSchema, notification as notificationSchema, notificationRecepients } from "../db/schema";
import { createId } from "@paralleldrive/cuid2";
import { and, or } from "drizzle-orm";
import { orderValidatorSchema, getOrderByIdValidatorSchema } from "../db/validator-schema";
import { pusherServer } from "~/lib/pusher-server";

const create = authedProcedure.input(orderValidatorSchema).mutation(async ({ ctx, input }) => {
  const { db } = ctx;
  const { service_id, partner_id, total_amount, total_service_requested } = input;

  const service = await db.query.service.findFirst({
    where: (service, { eq }) => eq(service.id, input.service_id),
  });

  if (!service) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Không tìm thấy dữ liệu" });
  }

  // check if any order is pending

  const pendingOrder = await db.query.order.findFirst({
    where: (order, { eq }) => and(eq(order.user_id, ctx.session.user.id), eq(order.order_status, "pending")),
  });

  if (pendingOrder) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Bạn đang có yêu cầu đang chờ xử lý" });
  }

  const totalAmount = service.service_price * total_service_requested;

  if (totalAmount !== total_amount) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Yêu cầu không hợp lệ" });
  }

  const wallet = await db.query.wallet.findFirst({
    where: (wallet, { eq }) => eq(wallet.user_id, ctx.session.user.id),
  });

  if (!wallet) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Xảy ra lỗi trong quá trình xác nhận, vui lòng thử lại" });
  }

  if (wallet.balance < totalAmount) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Số dư trong ví không đủ" });
  }

  const id = createId();

  // generate order code with 8 characters using crypto
  const orderCode = Math.random().toString(36).substring(2, 10).toUpperCase();

  // charge wallet
  const chargeWallet = db.update(walletSchema).set({
    balance: wallet.balance - totalAmount,
  });

  // create order
  const createOrder = db.insert(orderSchema).values({
    code: orderCode,
    order_status: "pending",
    partner_id: partner_id,
    service_id: service_id,
    total_amount: total_amount,
    total_service_requested: total_service_requested,
    user_id: ctx.session.user.id,
    id: id,
    payment_status: "paid",
    refunded_amount: 0,
    total_service_completed: 0,
  });

  await Promise.all([chargeWallet, createOrder]);

  // create notification

  const notificationId = createId();

  await db.insert(notificationSchema).values({
    id: notificationId,
    entityId: id,
    entityType: 1,
    type: "order",
    senderId: ctx.session.user.id,
  });

  // create notification recepients

  await db.insert(notificationRecepients).values({
    id: createId(),
    notificationId: notificationId,
    recipientId: partner_id,
  });

  const notification = await db.query.notification.findFirst({
    where: (notification, { eq }) => eq(notification.id, notificationId),
    with: {
      sender: {
        columns: {
          id: true,
          username: true,
          name: true,
          image: true,
        },
      },
    },
  });

  if (!notification) {
    return {
      id: id,
    };
  }

  await pusherServer.sendToUser(partner_id, "notification", { notification });

  return {
    id: id,
  };
});

const getOrderById = authedProcedure.input(getOrderByIdValidatorSchema).query(async ({ ctx, input }) => {
  const { db } = ctx;
  const { id } = input;

  const order = await db.query.order.findFirst({
    where: (orderSchema, { eq }) => eq(orderSchema.id, id),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          username: true,
        },
      },
      partner: {
        columns: {
          id: true,
          name: true,
          username: true,
        },
      },
      service: {
        columns: {
          id: true,
          service_name: true,
          service_price: true,
          unit: true,
        },
      },
    },
  });

  if (!order) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Không tìm thấy yêu cầu" });
  }

  return order;
});

const orderRouter = createTRPCRouter({
  create,
  getOrderById,
});

export default orderRouter;
