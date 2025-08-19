import { pool } from "../config/database";

/**
 * Adds a game to a users favorites list in the database.
 * @param userId - The unique identifier of the user.
 * @param gameId - The unique identifier of the game to be added as a favorite.
 * @returns Returns `true` if the favorite was added successfully, `false` if the favorite already exists or the operation failed.
 */
export async function addFavorite(userId: number, gameId: number): Promise<boolean> {
  const result = await pool.query(`INSERT INTO user_game_favorite (userid, gameid) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [userId, gameId]);
  return (result.rowCount ?? 0) > 0;
}

/**
 * Removes a game from a users favorites list in the database.
 * @param userId - The unique identifier of the user.
 * @param gameId - The unique identifier of the game to be removed from favorites.
 * @returns Returns `true` if the favorite was removed successfully, `false` if the favorite did not exist or the operation failed.
 */
export async function removeFavorite(userId: number, gameId: number): Promise<boolean> {
  const result = await pool.query(`DELETE FROM user_game_favorite WHERE userid = $1 AND gameid = $2`, [userId, gameId]);
  return (result.rowCount ?? 0) > 0;
}