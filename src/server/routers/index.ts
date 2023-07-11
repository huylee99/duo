import { createTRPCRouter } from "../trpc";
import userRouter from "./user";
import uploadRouter from "./s3";
import serviceRouter from "./service";

export const appRouter = createTRPCRouter({
  user: userRouter,
  upload: uploadRouter,
  service: serviceRouter,
});

export type AppRouter = typeof appRouter;
