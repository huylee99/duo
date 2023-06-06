import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { NextApiRequest, NextApiResponse } from "next";

type CreateContextOptions = {
  req?: NextApiRequest;
  res?: NextApiResponse;
};

export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    req: opts.req,
    res: opts.res,
  };
};

export const createTRPCContext = (opts: CreateNextContextOptions) => {
  return createInnerTRPCContext({
    req: opts.req,
    res: opts.res,
  });
};
