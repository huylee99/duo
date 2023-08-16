import { authedProcedure, createTRPCRouter } from "../trpc";
import { insertServiceRequestSchema } from "../db/validator-schema";
import { service as serviceSchema } from "../db/schema";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

const create = authedProcedure.input(insertServiceRequestSchema).mutation(async ({ ctx, input }) => {
  const { db } = ctx;
  const data = { ...input, id: createId(), user_id: ctx.session.user.id };
  await db.insert(serviceSchema).values(data);

  const service = await db.select().from(serviceSchema).where(eq(serviceSchema.id, data.id));

  return service[0];
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

const getServicesByUserId = authedProcedure.input(z.object({ user_id: z.string().length(24) })).query(async ({ ctx, input }) => {
  const { db } = ctx;
  const data = await db.query.service.findMany({
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

const getManyByUsername = authedProcedure.input(z.object({ username: z.string() })).query(async ({ ctx, input }) => {
  const { db } = ctx;
  const data = await db.query.service.findMany({
    where: (service, { eq }) => eq(service.user_id, input.username),
  });

  if (!data) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Không tìm thấy dữ liệu" });
  }

  return data;
});

const update = authedProcedure.input(insertServiceRequestSchema.merge(z.object({ id: z.string().length(24) }))).mutation(async ({ ctx, input }) => {
  const { db } = ctx;

  if (input.apply_schedule === "all-day") {
    input.start_time = null;
    input.end_time = null;
  }

  await db.update(serviceSchema).set(input).where(eq(serviceSchema.id, input.id));

  return input;
});

const remove = authedProcedure.input(z.object({ id: z.string().length(24) })).mutation(async ({ ctx, input }) => {
  const { db } = ctx;

  await db.delete(serviceSchema).where(eq(serviceSchema.id, input.id));

  return input.id;
});

const serviceRouter = createTRPCRouter({
  create,
  get,
  getMany,
  update,
  remove,
  getServicesByUserId,
  getManyByUsername,
});

export default serviceRouter;
