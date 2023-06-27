import { createTRPCRouter } from "../trpc";
import userRouter from "./user";
import uploadRouter from "./s3";

export const appRouter = createTRPCRouter({
  user: userRouter,
  upload: uploadRouter,
});

export type AppRouter = typeof appRouter;
