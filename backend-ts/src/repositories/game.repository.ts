import { pool } from "../config/database";
import { GameImage, GameResponse } from "../models/game.dto";
import { Game } from "../models/game.model";

/**
 * Fetches a list of games from the database.
 * @param limit The maximum number of games to return.
 * @param offset The number of games to skip before starting to collect the result set.
 * @returns A promise that resolves to an array of games.
 */
export async function getGames(limit: number = 10, offset: number = 0): Promise<Game[]> {
  const result = await pool.query(`SELECT 
      g.gameid, g.title, g.description, g.releasedate, gi.imageid, gi.url
    FROM game g LEFT JOIN game_image gi ON gi.gameid = g.gameid
    ORDER BY g.releasedate DESC LIMIT $1 OFFSET $2`, [limit, offset]);

  const gamesMap = new Map<number, GameResponse>();

  for (const row of result.rows) {
    const existingGame = gamesMap.get(row.gameid);
    const image: GameImage | null = row.imageid ? { imageid: row.imageid, url: row.url } : null;

    if (existingGame) {
      if (image) existingGame.images?.push(image);
    } else {
      gamesMap.set(row.gameid, {
        gameid: row.gameid,
        title: row.title,
        description: row.description,
        releaseDate: row.releasedate,
        images: image ? [image] : [],
      });
    }
  }

  return Array.from(gamesMap.values());
}

/**
 * Counts the total number of games in the database.
 * @returns The total number of games.
 */
export async function countGames(): Promise<number> {
  const result = await pool.query("SELECT COUNT(*) FROM game");
  return parseInt(result.rows[0].count, 10);
}