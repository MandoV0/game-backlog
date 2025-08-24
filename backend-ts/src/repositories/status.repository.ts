import { pool } from "../config/database";
import { Status } from "../models/status.model";

export async function getStatuses(): Promise<Status[]> {
  const result = await pool.query("SELECT * FROM status");
  return result.rows;
}