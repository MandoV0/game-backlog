import { pool } from "../config/database";
import { Game, GameImage, Genre, Platform } from "../models/game.model";

export interface GameWithRelations extends Game {
  platforms: Platform[];
  genres: Genre[];
  images: GameImage[];
}

export const getAllGames = async (
  limit: number,
  offset: number
): Promise<{ games: GameWithRelations[]; count: number }> => {
  const countResult = await pool.query("SELECT COUNT(*) FROM games");
  const count = parseInt(countResult.rows[0].count, 10);

  const result = await pool.query<GameWithRelations>(`
    SELECT 
      g.*,
      COALESCE(json_agg(DISTINCT jsonb_build_object('id', p.id, 'name', p.name)) 
               FILTER (WHERE p.id IS NOT NULL), '[]') AS platforms,
      COALESCE(json_agg(DISTINCT jsonb_build_object('id', ge.id, 'name', ge.name)) 
               FILTER (WHERE ge.id IS NOT NULL), '[]') AS genres,
      COALESCE(json_agg(DISTINCT jsonb_build_object('id', gi.id, 'game_id', gi.game_id, 'url', gi.url, 'type', gi.type, 'description', gi.description)) 
               FILTER (WHERE gi.id IS NOT NULL), '[]') AS images
    FROM games g
    LEFT JOIN game_platforms gp ON gp.game_id = g.id
    LEFT JOIN platforms p ON p.id = gp.platform_id
    LEFT JOIN game_genres gg ON gg.game_id = g.id
    LEFT JOIN genres ge ON ge.id = gg.genre_id
    LEFT JOIN game_images gi ON gi.game_id = g.id
    GROUP BY g.id
    ORDER BY g.id
    LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  const games = result.rows.map(row => ({
    ...row,
    platforms: row.platforms as Platform[],
    genres: row.genres as Genre[],
    images: row.images as GameImage[],
  }));

  return { games, count };
};

export const getGameById = async (id: number): Promise<GameWithRelations> => {
  const result = await pool.query<GameWithRelations>(`
    SELECT 
      g.*,
      COALESCE(json_agg(DISTINCT jsonb_build_object('id', p.id, 'name', p.name)) 
               FILTER (WHERE p.id IS NOT NULL), '[]') AS platforms,
      COALESCE(json_agg(DISTINCT jsonb_build_object('id', ge.id, 'name', ge.name)) 
               FILTER (WHERE ge.id IS NOT NULL), '[]') AS genres,
      COALESCE(json_agg(DISTINCT jsonb_build_object('id', gi.id, 'game_id', gi.game_id, 'url', gi.url, 'type', gi.type, 'description', gi.description)) 
               FILTER (WHERE gi.id IS NOT NULL), '[]') AS images
    FROM games g
    LEFT JOIN game_platforms gp ON gp.game_id = g.id
    LEFT JOIN platforms p ON p.id = gp.platform_id
    LEFT JOIN game_genres gg ON gg.game_id = g.id
    LEFT JOIN genres ge ON ge.id = gg.genre_id
    LEFT JOIN game_images gi ON gi.game_id = g.id
    WHERE g.id = $1
    GROUP BY g.id`,
    [id]
  );

  if (result.rows.length === 0) {
    throw new Error(`Game with id ${id} not found`);
  }

  const row = result.rows[0];

  return {
    ...row,
    platforms: row.platforms as Platform[],
    genres: row.genres as Genre[],
    images: row.images as GameImage[],
  };
};