import { pool } from "../config/database";
import { User } from "../models/user.model";

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
  return result.rows[0] || null;
}

export async function getUserById(userId: number): Promise<User | null> {
  const result = await pool.query(`SELECT * FROM users WHERE userid = $1`, [userId]);
  return result.rows[0] || null;
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const result = await pool.query(`SELECT * FROM users WHERE username = $1`, [username]);
  return result.rows[0] || null;
}

export async function createUser(email: string, username: string, passwordHash: string): Promise<User> {
  const result = await pool.query(
    `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *`,
    [username, email, passwordHash]
  );
  return result.rows[0];
}