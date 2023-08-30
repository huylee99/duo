import { createTRPCRouter, authedProcedure } from "../trpc";
import { notification as notificationSchema, user, notificationRecepients } from "../db/schema";
import { eq } from "drizzle-orm";

const getNotifications = authedProcedure.query(async ({ ctx }) => {
  const { db } = ctx;

  const notifications = await db
    .select({
      id: notificationSchema.id,
      type: notificationSchema.type,
      entityId: notificationSchema.entityId,
      entityType: notificationSchema.entityType,
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

const notificationRouter = createTRPCRouter({
  getNotifications,
});

export default notificationRouter;
