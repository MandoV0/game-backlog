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
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false /* Render : Local */
});

/**
 * In ENV File:
 * For Local Development:
 * NODE_ENV=development
 * DATABASE_URL=postgresql://postgres:gamebacklog@localhost:5432/game_backlog_v1
 *
 * For Production (Render):
 * NODE_ENV=production
 * DATABASE_URL=Render_PSQL_URL
 */
console.log("DATABASE_URL:", process.env.DATABASE_URL);

pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err: Error) => console.error("PostgreSQL connection error:", err));
