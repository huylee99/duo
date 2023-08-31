import { createTRPCRouter, authedProcedure } from "../trpc";
import { notification as notificationSchema, user, notificationRecepients } from "../db/schema";
import { eq, sql } from "drizzle-orm";
import { markAsClickValidatorSchema } from "../db/validator-schema";

const getNotifications = authedProcedure.query(async ({ ctx }) => {
  const { db } = ctx;

  const notifications = await db
    .select({
      id: notificationSchema.id,
      type: notificationSchema.type,
      entityId: notificationSchema.entityId,
      entityType: notificationSchema.entityType,
      seen: notificationSchema.seen,
      clicked: notificationSchema.clicked,
      created_at: notificationSchema.created_at,
      sender: {
        id: user.id,
        name: user.name,
        username: user.username,
        image: user.image,
      },
    })
    .from(notificationSchema)
    .innerJoin(notificationRecepients, eq(notificationRecepients.recipientId, ctx.session.user.id))
    .leftJoin(user, eq(user.id, notificationSchema.senderId))
    .where(eq(notificationRecepients.notificationId, notificationSchema.id));
  return notifications;
});

const countUnreadNotifications = authedProcedure.query(async ({ ctx }) => {
  const { db } = ctx;

  const count = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(notificationSchema)
    .innerJoin(notificationRecepients, eq(notificationRecepients.recipientId, ctx.session.user.id))
    .where(eq(notificationSchema.seen, false));

  return count[0];
});

const markAsSeen = authedProcedure.mutation(async ({ ctx, input }) => {
  const { db } = ctx;

  await db.update(notificationSchema).set({ seen: true }).where(eq(notificationSchema.seen, false));

  return {
    success: true,
  };
});

const markAsClicked = authedProcedure.input(markAsClickValidatorSchema).mutation(async ({ ctx, input }) => {
  const { db } = ctx;
  const { id } = input;

  await db.update(notificationSchema).set({ clicked: true }).where(eq(notificationSchema.id, id));

  return {
    id,
  };
});

const notificationRouter = createTRPCRouter({
  getNotifications,
  countUnreadNotifications,
  markAsSeen,
  markAsClicked,
});

export default notificationRouter;
