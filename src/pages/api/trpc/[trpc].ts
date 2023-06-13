import { createNextApiHandler } from "@trpc/server/adapters/next";
import { createTRPCContext } from "~/server/context";
import { appRouter } from "~/server/routers/_app";
import { env } from "~/env.mjs";

export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`);
        }
      : undefined,
});
