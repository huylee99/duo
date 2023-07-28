import { createTRPCRouter } from "../trpc";
import userRouter from "./user";
import uploadRouter from "./s3";
import serviceRouter from "./service";
import discountRouter from "./discount";
import chatRouter from "./chat";

export const appRouter = createTRPCRouter({
  user: userRouter,
  upload: uploadRouter,
  service: serviceRouter,
  discount: discountRouter,
  chat: chatRouter,
});

export type AppRouter = typeof appRouter;
