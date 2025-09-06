import { pool } from "../config/database";
import { User, UserGame, GameStatus, Review } from "../models/user.model";
import { GameWithRelations } from "./game.repository";

export interface UserGameWithDetails extends UserGame {
  game: GameWithRelations;
}

export interface UserProfile extends User {
  total_games: number;
  completed_games: number;
  playing_games: number;
  backlog_games: number;
  dropped_games: number;
  total_playtime: number;
  average_rating: number;
}

export const getUserById = async (id: number): Promise<User> => {
  const result = await pool.query<User>(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );

  if (result.rows.length === 0) {
    throw new Error(`User with id ${id} not found`);
  }

  return result.rows[0];
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const result = await pool.query<User>(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  return result.rows[0] || null;
};

export const createUser = async (
  username: string,
  email: string,
  passwordHash: string
): Promise<User> => {
  const result = await pool.query<User>(
    "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
    [username, email, passwordHash]
  );

  return result.rows[0];
};

export const getUserProfile = async (userId: number): Promise<UserProfile> => {
  const result = await pool.query<UserProfile>(`
    SELECT 
      u.*,
      COUNT(ug.id) as total_games,
      COUNT(CASE WHEN ug.status = 'completed' THEN 1 END) as completed_games,
      COUNT(CASE WHEN ug.status = 'playing' THEN 1 END) as playing_games,
      COUNT(CASE WHEN ug.status = 'backlog' THEN 1 END) as backlog_games,
      COUNT(CASE WHEN ug.status = 'dropped' THEN 1 END) as dropped_games,
      COALESCE(SUM(ug.rating), 0) as total_rating,
      CASE 
        WHEN COUNT(ug.id) > 0 THEN COALESCE(SUM(ug.rating) / COUNT(ug.id), 0)
        ELSE 0 
      END as average_rating
    FROM users u
    LEFT JOIN user_games ug ON ug.user_id = u.id
    WHERE u.id = $1
    GROUP BY u.id`,
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error(`User with id ${userId} not found`);
  }

  return result.rows[0];
};

export const getUserBacklog = async (
  userId: number,
  status?: GameStatus,
  limit: number = 10,
  offset: number = 0
): Promise<{ games: UserGameWithDetails[]; count: number }> => {
  let whereClause = "WHERE ug.user_id = $1";
  let queryParams: any[] = [userId];
  let paramCount = 1;

  if (status) {
    paramCount++;
    whereClause += ` AND ug.status = $${paramCount}`;
    queryParams.push(status);
  }

  // Count query
  const countQuery = `
    SELECT COUNT(*) 
    FROM user_games ug
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

  const result = await pool.query<UserGameWithDetails>(`
    SELECT 
      ug.*,
      jsonb_build_object(
        'id', g.id,
        'title', g.title,
        'release_year', g.release_year,
        'created_at', g.created_at,
        'updated_at', g.updated_at,
        'platforms', COALESCE(
          (SELECT json_agg(jsonb_build_object('id', p.id, 'name', p.name))
           FROM game_platforms gp
           JOIN platforms p ON p.id = gp.platform_id
           WHERE gp.game_id = g.id), '[]'
        ),
        'genres', COALESCE(
          (SELECT json_agg(jsonb_build_object('id', ge.id, 'name', ge.name))
           FROM game_genres gg
           JOIN genres ge ON ge.id = gg.genre_id
           WHERE gg.game_id = g.id), '[]'
        ),
        'images', COALESCE(
          (SELECT json_agg(jsonb_build_object('id', gi.id, 'game_id', gi.game_id, 'url', gi.url, 'type', gi.type, 'description', gi.description))
           FROM game_images gi
           WHERE gi.game_id = g.id), '[]'
        )
      ) as game
    FROM user_games ug
    JOIN games g ON g.id = ug.game_id
    ${whereClause}
    ORDER BY ug.updated_at DESC
    LIMIT ${limitParam} OFFSET ${offsetParam}`,
    queryParams
  );

  return { games: result.rows, count };
};

export const addGameToBacklog = async (
  userId: number,
  gameId: number,
  status: GameStatus = 'backlog'
): Promise<UserGame> => {
  const result = await pool.query<UserGame>(
    `INSERT INTO user_games (user_id, game_id, status) 
     VALUES ($1, $2, $3) 
     ON CONFLICT (user_id, game_id) 
     DO UPDATE SET status = $3, updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [userId, gameId, status]
  );

  return result.rows[0];
};

export const updateGameStatus = async (
  userId: number,
  gameId: number,
  status: GameStatus,
  rating?: number,
  startedAt?: string,
  finishedAt?: string
): Promise<UserGame> => {
  const result = await pool.query<UserGame>(
    `UPDATE user_games 
     SET status = $3, rating = $4, started_at = $5, finished_at = $6, updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $1 AND game_id = $2
     RETURNING *`,
    [userId, gameId, status, rating, startedAt, finishedAt]
  );

  if (result.rows.length === 0) {
    throw new Error(`Game not found in user's backlog`);
  }

  return result.rows[0];
};

export const removeGameFromBacklog = async (
  userId: number,
  gameId: number
): Promise<void> => {
  const result = await pool.query(
    "DELETE FROM user_games WHERE user_id = $1 AND game_id = $2",
    [userId, gameId]
  );

  if (result.rowCount === 0) {
    throw new Error(`Game not found in user's backlog`);
  }
};

export const getUserReviews = async (
  userId: number,
  limit: number = 10,
  offset: number = 0
): Promise<{ reviews: Review[]; count: number }> => {
  const countResult = await pool.query(
    "SELECT COUNT(*) FROM reviews WHERE user_id = $1",
    [userId]
  );
  const count = parseInt(countResult.rows[0].count, 10);

  const result = await pool.query<Review>(
    `SELECT r.*, g.title as game_title
     FROM reviews r
     JOIN games g ON g.id = r.game_id
     WHERE r.user_id = $1
     ORDER BY r.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  return { reviews: result.rows, count };
};

export const createReview = async (
  userId: number,
  gameId: number,
  title?: string,
  content?: string,
  rating?: number
): Promise<Review> => {
  const result = await pool.query<Review>(
    `INSERT INTO reviews (user_id, game_id, title, content, rating) 
     VALUES ($1, $2, $3, $4, $5) 
     ON CONFLICT (user_id, game_id) 
     DO UPDATE SET title = $3, content = $4, rating = $5, updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [userId, gameId, title, content, rating]
  );

  return result.rows[0];
};

export const updateReview = async (
  userId: number,
  gameId: number,
  title?: string,
  content?: string,
  rating?: number
): Promise<Review> => {
  const result = await pool.query<Review>(
    `UPDATE reviews 
     SET title = $3, content = $4, rating = $5, updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $1 AND game_id = $2
     RETURNING *`,
    [userId, gameId, title, content, rating]
  );

  if (result.rows.length === 0) {
    throw new Error(`Review not found`);
  }

  return result.rows[0];
};

export const deleteReview = async (
  userId: number,
  gameId: number
): Promise<void> => {
  const result = await pool.query(
    "DELETE FROM reviews WHERE user_id = $1 AND game_id = $2",
    [userId, gameId]
  );

  if (result.rowCount === 0) {
    throw new Error(`Review not found`);
  }
};

export const logPlaytime = async (
  userId: number,
  gameId: number,
  playtimeMinutes: number,
  notes?: string
): Promise<UserGame> => {
  // First, ensure the game is in the user's backlog
  const userGame = await pool.query<UserGame>(
    "SELECT * FROM user_games WHERE user_id = $1 AND game_id = $2",
    [userId, gameId]
  );

  if (userGame.rows.length === 0) {
    throw new Error(`Game not found in user's backlog`);
  }

  // Update the user_game record with playtime
  const result = await pool.query<UserGame>(
    `UPDATE user_games 
     SET updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $1 AND game_id = $2
     RETURNING *`,
    [userId, gameId]
  );

  return result.rows[0];
};

export const getPlaytimeStats = async (userId: number): Promise<{
  totalPlaytime: number;
  gamesPlayed: number;
  averagePlaytime: number;
  recentActivity: Array<{
    gameId: number;
    gameTitle: string;
    lastPlayed: string;
    totalPlaytime: number;
  }>;
}> => {
  // Get total playtime and games played
  const statsResult = await pool.query(`
    SELECT 
      COUNT(*) as games_played,
      COALESCE(SUM(EXTRACT(EPOCH FROM (finished_at - started_at)) / 3600), 0) as total_playtime_hours
    FROM user_games 
    WHERE user_id = $1 AND started_at IS NOT NULL
  `, [userId]);

  const stats = statsResult.rows[0];
  const totalPlaytime = Math.round(parseFloat(stats.total_playtime_hours) * 60); // Convert to minutes
  const gamesPlayed = parseInt(stats.games_played);
  const averagePlaytime = gamesPlayed > 0 ? Math.round(totalPlaytime / gamesPlayed) : 0;

  // Get recent activity
  const activityResult = await pool.query(`
    SELECT 
      ug.game_id,
      g.title as game_title,
      ug.updated_at as last_played,
      EXTRACT(EPOCH FROM (ug.finished_at - ug.started_at)) / 60 as total_playtime_minutes
    FROM user_games ug
    JOIN games g ON g.id = ug.game_id
    WHERE ug.user_id = $1 AND ug.started_at IS NOT NULL
    ORDER BY ug.updated_at DESC
    LIMIT 10
  `, [userId]);

  const recentActivity = activityResult.rows.map(row => ({
    gameId: row.game_id,
    gameTitle: row.game_title,
    lastPlayed: row.last_played,
    totalPlaytime: Math.round(parseFloat(row.total_playtime_minutes) || 0)
  }));

  return {
    totalPlaytime,
    gamesPlayed,
    averagePlaytime,
    recentActivity
  };
};
