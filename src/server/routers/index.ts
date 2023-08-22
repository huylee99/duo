import { createTRPCRouter } from "../trpc";
import userRouter from "./user";
import uploadRouter from "./s3";
import serviceRouter from "./service";
import chatRouter from "./chat";
import walletRouter from "./wallet";
import orderRouter from "./order";

export const appRouter = createTRPCRouter({
  user: userRouter,
  upload: uploadRouter,
  service: serviceRouter,
  chat: chatRouter,
  wallet: walletRouter,
  order: orderRouter,
});

export type AppRouter = typeof appRouter;
