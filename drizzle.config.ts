import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

export default {
  schema: "./src/db/schema.ts",
  connectionString: process.env.DATABASE_URL,
  out: "./db/migrations",
} satisfies Config;
