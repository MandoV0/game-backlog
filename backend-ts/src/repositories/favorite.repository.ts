import { pool } from "../config/database";
import { GameResponse } from "../models/game.dto";

/**
 * Adds a game to a users favorites list in the database.
 * @param userId - The unique identifier of the user.
 * @param gameId - The unique identifier of the game to be added as a favorite.
 * @returns Returns `true` if the favorite was added successfully, `false` if the favorite already exists or the operation failed.
 */
export async function addFavorite(
  userId: number,
  gameId: number
): Promise<boolean> {
  const result = await pool.query(
    `INSERT INTO user_game_favorite (userid, gameid) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    [userId, gameId]
  );
  return (result.rowCount ?? 0) > 0;
}

/**
 * Removes a game from a users favorites list in the database.
 * @param userId - The unique identifier of the user.
 * @param gameId - The unique identifier of the game to be removed from favorites.
 * @returns Returns `true` if the favorite was removed successfully, `false` if the favorite did not exist or the operation failed.
 */
export async function removeFavorite(
  userId: number,
  gameId: number
): Promise<boolean> {
  const result = await pool.query(
    `DELETE FROM user_game_favorite WHERE userid = $1 AND gameid = $2`,
    [userId, gameId]
  );
  return (result.rowCount ?? 0) > 0;
}

/**
 * Retrieves a user's favorite games from the database.
 * @param userId - The unique identifier of the user.
 * @returns A list of game IDs that the user has favorited.
 */
export async function getFavoritesByUserId(
  userId: number,
  limit: number,
  offset: number
): Promise<GameResponse[]> {
  const query = `SELECT 
    g.gameid,
    g.title,
    g.description,
    g.releasedate,
    gi.imageid,
    gi.url,
    json_agg(DISTINCT jsonb_build_object('genreid', ge.genreid, 'name', ge.name)) 
      FILTER (WHERE ge.genreid IS NOT NULL) AS genres
  FROM game g
  LEFT JOIN game_image gi ON gi.gameid = g.gameid
  LEFT JOIN game_genre gg ON gg.gameid = g.gameid
  LEFT JOIN genre ge ON ge.genreid = gg.genreid
  LEFT JOIN user_game_favorite ugf ON ugf.gameid = g.gameid AND ugf.userid = $1
  GROUP BY g.gameid, g.title, g.description, g.releasedate, gi.imageid, gi.url
  ORDER BY g.releasedate DESC
  LIMIT $2 OFFSET $3
  `;
  const result = await pool.query(query, [userId, limit, offset]);

  return result.rows;
}
