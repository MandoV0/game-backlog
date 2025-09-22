/*
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "gamebacklog",
    database: process.env.DB_NAME || "game_backlog_v1",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
});

pool.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch((err: Error) => console.error("PostgreSQL connection error:", err));
*/

import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err: Error) => console.error("PostgreSQL connection error:", err));
