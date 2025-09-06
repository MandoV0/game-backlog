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

export const getAllPlatforms = async (): Promise<Platform[]> => {
  const result = await pool.query<Platform>("SELECT * FROM platforms ORDER BY name");
  return result.rows;
};

export const getAllGenres = async (): Promise<Genre[]> => {
  const result = await pool.query<Genre>("SELECT * FROM genres ORDER BY name");
  return result.rows;
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

export interface GameSearchFilters {
  query?: string;
  genres?: number[];
  platforms?: number[];
  releaseYearFrom?: number;
  releaseYearTo?: number;
  sortBy?: 'title' | 'release_year' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

export const searchGames = async (
  filters: GameSearchFilters,
  limit: number,
  offset: number
): Promise<{ games: GameWithRelations[]; count: number }> => {
  let whereConditions: string[] = [];
  let queryParams: any[] = [];
  let paramCount = 0;

  // Build WHERE conditions
  if (filters.query) {
    paramCount++;
    whereConditions.push(`LOWER(g.title) LIKE LOWER($${paramCount})`);
    queryParams.push(`%${filters.query}%`);
  }

  if (filters.genres && filters.genres.length > 0) {
    paramCount++;
    whereConditions.push(`g.id IN (
      SELECT DISTINCT gg.game_id 
      FROM game_genres gg 
      WHERE gg.genre_id = ANY($${paramCount})
    )`);
    queryParams.push(filters.genres);
  }

  if (filters.platforms && filters.platforms.length > 0) {
    paramCount++;
    whereConditions.push(`g.id IN (
      SELECT DISTINCT gp.game_id 
      FROM game_platforms gp 
      WHERE gp.platform_id = ANY($${paramCount})
    )`);
    queryParams.push(filters.platforms);
  }

  if (filters.releaseYearFrom) {
    paramCount++;
    whereConditions.push(`g.release_year >= $${paramCount}`);
    queryParams.push(filters.releaseYearFrom);
  }

  if (filters.releaseYearTo) {
    paramCount++;
    whereConditions.push(`g.release_year <= $${paramCount}`);
    queryParams.push(filters.releaseYearTo);
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  // Build ORDER BY clause
  const sortBy = filters.sortBy || 'title';
  const sortOrder = filters.sortOrder || 'asc';
  const orderClause = `ORDER BY g.${sortBy} ${sortOrder.toUpperCase()}`;

  // Count query
  const countQuery = `
    SELECT COUNT(DISTINCT g.id) 
    FROM games g
    ${whereClause}
  `;
  
  const countResult = await pool.query(countQuery, queryParams);
  const count = parseInt(countResult.rows[0].count, 10);

  // Main query
  paramCount++;
  const limitParam = `$${paramCount}`;
  paramCount++;
  const offsetParam = `$${paramCount}`;
  queryParams.push(limit, offset);

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
    ${whereClause}
    GROUP BY g.id
    ${orderClause}
    LIMIT ${limitParam} OFFSET ${offsetParam}`,
    queryParams
  );

  const games = result.rows.map(row => ({
    ...row,
    platforms: row.platforms as Platform[],
    genres: row.genres as Genre[],
    images: row.images as GameImage[],
  }));

  return { games, count };
};

export const getAllPlatforms = async (): Promise<Platform[]> => {
  const result = await pool.query<Platform>("SELECT * FROM platforms ORDER BY name");
  return result.rows;
};

export const getAllGenres = async (): Promise<Genre[]> => {
  const result = await pool.query<Genre>("SELECT * FROM genres ORDER BY name");
  return result.rows;
};