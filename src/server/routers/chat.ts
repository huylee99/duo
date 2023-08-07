import { createTRPCRouter, authedProcedure } from "../trpc";
import { chatValidatorRequestSchema } from "../db/validator-schema";
import { message as messageSchema, conversation as conversationSchema, user as userSchema } from "../db/schema";
import { createId } from "@paralleldrive/cuid2";
import { eq, and, or, sql, desc, like } from "drizzle-orm";
import { pusherServer } from "~/lib/pusher-server";
import { z } from "zod";
import { alias } from "drizzle-orm/mysql-core";

const sendMessage = authedProcedure.input(chatValidatorRequestSchema).mutation(async ({ ctx, input }) => {
  const { message, recipient_id, conversation_id } = input;
  const { id } = ctx.session.user;

  let conversationId = conversation_id;

  if (conversationId === "") {
    const newConversationId = createId();

    await ctx.db.insert(conversationSchema).values({ id: newConversationId, latest_message_id: null, user1_id: id, user2_id: recipient_id, updated_at: new Date() });

    const createdConversation = await ctx.db.query.conversation.findFirst({
      where: eq(conversationSchema.id, newConversationId),
      with: {
        user1: {
          columns: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        user2: {
          columns: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        latestMessage: true,
      },
    });

    if (createdConversation) {
      await Promise.allSettled([pusherServer.sendToUser(recipient_id, "conversation:new", { conversation: { ...createdConversation, unreadCount: 1 } }), pusherServer.sendToUser(id, "conversation:new", { conversation: { ...createdConversation, unreadCount: 0 } })]);
    }

    conversationId = newConversationId;
  }

  const messageId = createId();

  const insertNewMessage = ctx.db.insert(messageSchema).values({ conversation_id: conversationId, sender_id: id, recipient_id, message, id: messageId });

  const updateLatestMessage = ctx.db.update(conversationSchema).set({ latest_message_id: messageId }).where(eq(conversationSchema.id, conversationId));

  await Promise.all([insertNewMessage, updateLatestMessage]);

  const newMessage = await ctx.db.query.message.findFirst({ where: eq(messageSchema.id, messageId) });

  if (newMessage) {
    await pusherServer.trigger(`private-chat-${conversation_id}`, "new-message", newMessage);
    await pusherServer.sendToUser(recipient_id, "conversation:update", { conversation_id });

    return newMessage;
  }
});

const markAsRead = authedProcedure.input(z.object({ conversation_id: z.string().length(24), senderId: z.string().length(24) })).mutation(async ({ ctx, input }) => {
  const { conversation_id, senderId } = input;
  const { id } = ctx.session.user;

  await ctx.db
    .update(messageSchema)
    .set({ seen: true })
    .where(and(eq(messageSchema.conversation_id, conversation_id), eq(messageSchema.recipient_id, id), eq(messageSchema.seen, false)));

  await pusherServer.sendToUser(senderId, "conversation:read", { conversation_id });
});

const user1 = alias(userSchema, "user1");
const user2 = alias(userSchema, "user2");

const getConversations = authedProcedure.query(async ({ ctx }) => {
  const { id } = ctx.session.user;

  const conversations = await ctx.db
    .select({
      id: conversationSchema.id,
      latest_message: {
        id: messageSchema.id,
        message: messageSchema.message,
        created_at: messageSchema.created_at,
        seen: messageSchema.seen,
      },
      user1: {
        id: user1.id,
        name: user1.name,
        username: user1.username,
        image: user1.image,
      },
      user2: {
        id: user2.id,
        name: user2.name,
        username: user2.username,
        image: user2.image,
      },
      unreadCount: sql<number>`sum(case when ${messageSchema.seen} = false and ${messageSchema.recipient_id} = ${id} then 1 else 0 end)`,
    })
    .from(conversationSchema)
    .limit(10)
    .innerJoin(user1, eq(conversationSchema.user1_id, user1.id))
    .innerJoin(user2, eq(conversationSchema.user2_id, user2.id))
    .leftJoin(messageSchema, eq(conversationSchema.latest_message_id, messageSchema.id))
    .groupBy(conversationSchema.id, messageSchema.recipient_id, user1.id, user2.id, messageSchema.seen, messageSchema.id, messageSchema.message, messageSchema.created_at, user1.name, user1.username, user1.image, user2.name, user2.username, user2.image, messageSchema.seen, messageSchema.id, messageSchema.message, messageSchema.created_at)
    .where(or(eq(conversationSchema.user1_id, id), eq(conversationSchema.user2_id, id)))
    .orderBy(desc(conversationSchema.updated_at));

  //   const conversations = await ctx.db.query.conversation.findMany({
  //     extras: {
  //       unreadCount: sql<number>`sum(case when ${messageSchema.seen} = false and ${messageSchema.recipient_id} = ${id} then 1 else 0 end)`.as("unreadCount"),
  //     },
  //     with: {
  //       user1: {
  //         columns: {
  //           id: true,
  //           name: true,
  //           username: true,
  //           image: true,
  //         },
  //       },
  //       user2: {
  //         columns: {
  //           id: true,
  //           name: true,
  //           username: true,
  //           image: true,
  //         },
  //       },
  //       latestMessage: true,
  //     },
  //     orderBy: (conversationSchema, { desc }) => [desc(conversationSchema.updated_at)],
  //   });

  return conversations;
});

const startConversation = authedProcedure.input(z.object({ recipient_id: z.string().length(24) })).mutation(async ({ ctx, input }) => {
  const { recipient_id } = input;
  const { id } = ctx.session.user;

  const newConversationId = createId();

  await ctx.db.insert(conversationSchema).values({ id: newConversationId, latest_message_id: null, user1_id: id, user2_id: recipient_id });

  const createdConversation = await ctx.db.query.conversation.findFirst({
    where: eq(conversationSchema.id, newConversationId),
    with: {
      user1: {
        columns: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
      user2: {
        columns: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
      latestMessage: true,
    },
  });

  if (createdConversation) {
    return createdConversation;
  }

  return null;
});

const getMessages = authedProcedure.input(z.object({ conversation_id: z.string().length(24) })).query(async ({ ctx, input }) => {
  const { conversation_id } = input;
  const { id } = ctx.session.user;

  const messages = await ctx.db.query.message.findMany({
    where: eq(messageSchema.conversation_id, conversation_id),
    orderBy: (messageSchema, { asc }) => [asc(messageSchema.created_at)],
  });

  await ctx.db
    .update(messageSchema)
    .set({ seen: true })
    .where(and(eq(messageSchema.conversation_id, conversation_id), eq(messageSchema.recipient_id, id), eq(messageSchema.seen, false)));

  return messages;
});

const searchUsers = authedProcedure.input(z.object({ query: z.string() })).query(async ({ ctx, input }) => {
  const { query } = input;

  const users = await ctx.db
    .select({
      id: userSchema.id,
      name: userSchema.name,
      username: userSchema.username,
      image: userSchema.image,
    })
    .from(userSchema)
    .where(or(like(userSchema.name, `%${query}%`), like(userSchema.username, `%${query}%`)));

  return users;
});

const chatRouter = createTRPCRouter({
  sendMessage,
  markAsRead,
  getConversations,
  getMessages,
  searchUsers,
  startConversation,
});

export default chatRouter;
