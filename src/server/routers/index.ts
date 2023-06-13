import { createTRPCRouter } from "../trpc";
import { me } from "./user";

export const appRouter = createTRPCRouter({
  me: me,
});

export type AppRouter = typeof appRouter;
