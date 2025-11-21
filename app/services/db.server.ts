import knexInit from "knex";
import dotenv from "dotenv";
dotenv.config();

let knex: ReturnType<typeof knexInit> | null = null;

export function getDb() {
  if (!knex) {
    knex = knexInit({
      client: "mysql2",
      connection: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      },
      pool: { min: 4, max: 10 }
    });
  }
  return knex;
}
