import { pool } from "../config/database";
import { GameImage, GameResponse } from "../models/game.dto";
import { Game } from "../models/game.model";

/**
 * Fetches a list of games from the database.
 * @param limit The maximum number of games to return.
 * @param offset The number of games to skip before starting to collect the result set.
 * @returns A promise that resolves to an array of games.
 */
export async function getGames(
  limit: number = 10,
  offset: number = 0
): Promise<Game[]> {
  const result = await pool.query(
  `SELECT 
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
  GROUP BY g.gameid, g.title, g.description, g.releasedate, gi.imageid, gi.url
  ORDER BY g.releasedate DESC
  LIMIT $1 OFFSET $2
  `,
    [limit, offset]
  );

  const gamesMap = new Map<number, GameResponse>();

  for (const row of result.rows) {
    const existingGame = gamesMap.get(row.gameid);
    const image: GameImage | null = row.imageid
      ? { imageid: row.imageid, url: row.url }
      : null;

    if (existingGame) {
      if (image) existingGame.images?.push(image);
    } else {
      gamesMap.set(row.gameid, {
        gameid: row.gameid,
        title: row.title,
        description: row.description,
        releaseDate: row.releasedate,
        images: image ? [image] : [],
        genres: row.genres ?? [],
      });
    }
  }

  return Array.from(gamesMap.values());
}

/**
 * Retrieves a list of games from the database by their IDs.
 * @param limit - The maximum number of games to return.
 * @param offset - The number of games to skip before starting to collect the result set.
 * @param gameIds - An array of game IDs to retrieve.
 * @returns A promise that resolves to an array of games.
 */
export async function getGamesByIds(gameIds: number[]): Promise<Game[]> {
  const result = await pool.query(`SELECT * FROM game WHERE gameid = ANY($1)`, [
    gameIds,
  ]);
  return result.rows;
}

/**
 * Counts the total number of games in the database.
 * @returns The total number of games.
 */
export async function countGames(): Promise<number> {
  const result = await pool.query("SELECT COUNT(*) FROM game");
  return parseInt(result.rows[0].count, 10);
}
