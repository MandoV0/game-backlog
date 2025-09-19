import { pool } from "../config/database";
import { Game, GameImage, Genre, Platform } from "../models/game.model";
import { GameStatusStatistics, RatingStatistics } from "../models/review.model";

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

export const getAllGenres = async (): Promise<{ id: number; name: string }[]> => {
    const result = await pool.query<{ id: number; name: string }>(`
        SELECT id, name FROM genres ORDER BY id
    `);
    return result.rows;
}

export const getAllPlatforms = async (): Promise<{ id: number; name: string }[]> => {
    const result = await pool.query<{ id: number; name: string }>(`
        SELECT id, name FROM platforms ORDER BY id
    `);
    return result.rows;
}

export const getReviewsByGameId = async (gameId: number, limit: number, offset: number): Promise<any[]> => {
    const result = await pool.query(`
        SELECT r.*, u.username FROM reviews r LEFT JOIN users u ON u.id = r.user_id WHERE r.game_id = $1 LIMIT $2 OFFSET $3`,
        [gameId, limit, offset]);
    return result.rows;
}

export const getReviewCountByGameId = async (gameId: number): Promise<number> => {
    const result = await pool.query<{ count: string }>(`SELECT COUNT(*) FROM reviews WHERE game_id = $1`, [gameId]);
    return parseInt(result.rows[0].count, 10);
}

export const getReviewStatisticsByGameId = async (gameId: number): Promise<RatingStatistics> => {
    const result = await pool.query<RatingStatistics>(`
        SELECT 
            COUNT(*) AS total_reviews,
            AVG(rating) AS average_rating,
            SUM(CASE WHEN rating = 10 THEN 1 ELSE 0 END) AS ten_star_reviews,
            SUM(CASE WHEN rating = 9 THEN 1 ELSE 0 END) AS nine_star_reviews,
            SUM(CASE WHEN rating = 8 THEN 1 ELSE 0 END) AS eight_star_reviews,
            SUM(CASE WHEN rating = 7 THEN 1 ELSE 0 END) AS seven_star_reviews,
            SUM(CASE WHEN rating = 6 THEN 1 ELSE 0 END) AS six_star_reviews,
            SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) AS five_star_reviews,
            SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) AS four_star_reviews,
            SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) AS three_star_reviews,
            SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) AS two_star_reviews,
            SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) AS one_star_reviews,
            SUM(CASE WHEN rating = 0 THEN 1 ELSE 0 END) AS zero_star_reviews
        FROM reviews
        WHERE game_id = $1`,
        [gameId]);
    return result.rows[0];
}

export const getGameStatusStatistics = async (gameId: number): Promise<GameStatusStatistics> => {
    const result = await pool.query<GameStatusStatistics>(`
        SELECT
        SUM(CASE WHEN status = 'playing' THEN 1 ELSE 0 END) AS playing,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
        SUM(CASE WHEN status = 'dropped' THEN 1 ELSE 0 END) AS dropped,
        SUM(CASE WHEN status = 'backlog' THEN 1 ELSE 0 END) AS backlog
        FROM user_games
        WHERE game_id = $1`,
        [gameId]);
    return result.rows[0];
}