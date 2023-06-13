import { createTRPCRouter } from "../trpc";
import { hello } from "./hello";

export const appRouter = createTRPCRouter({
  hello: hello,
});

export type AppRouter = typeof appRouter;
