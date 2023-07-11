import { authedProcedure, createTRPCRouter } from "../trpc";
import { insertServiceRequestSchema } from "../db/validator-schema";
import { service as serviceSchema } from "../db/schema";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const create = authedProcedure.input(insertServiceRequestSchema).mutation(async ({ ctx, input }) => {
  const { db } = ctx;
  const data = { ...input, id: createId(), user_id: ctx.session.user.id };
  await db.insert(serviceSchema).values(data);

  console.log("Created successfully", data);

  return data;
});

const get = authedProcedure.input(z.object({ user_id: z.string().length(24) })).query(async ({ ctx, input }) => {
  const { db } = ctx;
  const data = await db.query.service.findFirst({
    where: (service, { eq }) => eq(service.user_id, input.user_id),
  });

  if (!data) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Không tìm thấy dữ liệu" });
  }

  return data;
});

const getMany = authedProcedure.query(async ({ ctx }) => {
  const { db } = ctx;
  const data = await db.query.service.findMany({
    where: (service, { eq }) => eq(service.user_id, ctx.session.user.id),
  });

  if (!data) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Không tìm thấy dữ liệu" });
  }

  return data;
});

const serviceRouter = createTRPCRouter({
  create,
  get,
  getMany,
});

export default serviceRouter;
