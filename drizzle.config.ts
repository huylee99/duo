import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

export default {
  schema: "./src/server/db/schema.ts",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
  driver: "mysql2",
  out: "./db/migrations",
} satisfies Config;
