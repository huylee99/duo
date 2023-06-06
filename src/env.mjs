import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    KEY: z.string().min(1),
    NODE_ENV: z.enum(["development", "production", "test"]),
  },
  client: {
    NEXT_PUBLIC_KEY: z.string().min(1),
  },
  runtimeEnv: {
    KEY: process.env.KEY,
    NEXT_PUBLIC_KEY: process.env.NEXT_PUBLIC_KEY,
    NODE_ENV: process.env.NODE_ENV,
  },
});
