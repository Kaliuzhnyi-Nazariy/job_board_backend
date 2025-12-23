import { Pool } from "pg";

let db: Pool;

if (process.env.NODE_ENV === "production") {
  const { PG_HOST, PG_PORT, PG_PASSWORD, PG_USER, PG_DATABASE } = process.env;

  db = new Pool({
    host: PG_HOST,
    user: PG_USER,
    password: PG_PASSWORD,
    database: PG_DATABASE,
    port: Number(PG_PORT),
  });
} else {
  const { PG_HOST, PG_PORT, PG_PASSWORD, PG_USER, PG_DATABASE } = process.env;

  db = new Pool({
    host: PG_HOST,
    user: PG_USER,
    password: PG_PASSWORD,
    database: PG_DATABASE,
    port: Number(PG_PORT),
  });
}

export default db;
