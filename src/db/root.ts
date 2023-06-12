import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import * as schema from "../db/schema";

if (process.env["DATABASE_HOST"] === undefined || process.env["DATABASE_USERNAME"] === undefined || process.env["DATABASE_PASSWORD"] === undefined) {
  throw new Error("Missing environment variables for database connection");
}

const connection = connect({
  host: process.env["DATABASE_HOST"],
  username: process.env["DATABASE_USERNAME"],
  password: process.env["DATABASE_PASSWORD"],
});

export const db = drizzle(connection, { schema });
