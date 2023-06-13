import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "./db/root";
import { Session } from "next-auth";
import { getServerAuthSession } from "./utils/auth";
import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

type CreateContextOptions = {
  session: Session | null;
  req?: NextApiRequest;
  res?: NextApiResponse;
};

export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    req: opts.req,
    res: opts.res,
    db: db,
  };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const session = await getServerAuthSession(opts);

  return createInnerTRPCContext({
    session: session,
    req: opts.req,
    res: opts.res,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
  }

  return next({
    ctx: {
      session: {
        ...ctx.session,
        user: { ...ctx.session.user },
      },
    },
  });
});

export const authedProcedure = t.procedure.use(enforceUserIsAuthed);
export const publicProcedure = t.procedure;
