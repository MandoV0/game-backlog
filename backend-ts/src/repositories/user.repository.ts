import { pool } from '../config/database';
import bcrypt from 'bcrypt';
import { User } from '../models/user.model';
import { UserGameReviews } from '../models/review.model';

const SALT_ROUNDS = 10;

export const createUser = async (username: string, email: string, password: string): Promise<User> => {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await pool.query<User>(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
        [username, email, hashedPassword]
    );
    return result.rows[0];
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
    const result = await pool.query<User>('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
};

export const getUserById = async (id: number): Promise<User | null> => {
    const result = await pool.query<User>('SELECT id, username, email, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
};

export const addGameToBacklog = async (userId: number, gameId: number): Promise<any> => {
    const result = await pool.query(
        'INSERT INTO user_games (user_id, game_id, status) VALUES ($1, $2, $3) RETURNING *',
        [userId, gameId, 'backlog']
    );
    return result.rows[0];
};

export const updateGameBacklogStatus = async (userId: number, gameId: number, status: string): Promise<any> => {
    const result = await pool.query(
        'UPDATE user_games SET status = $1 WHERE user_id = $2 AND game_id = $3 RETURNING *',
        [status, userId, gameId]
    );
    return result.rows[0];
};

export const deleteGameFromBacklog = async (userId: number, gameId: number): Promise<void> => {
    await pool.query('DELETE FROM user_games WHERE user_id = $1 AND game_id = $2', [userId, gameId]);
}

export const createUserReview = async (userId: number, gameId: number, rating: number, reviewText: string, title: string): Promise<any> => {
    const result = await pool.query(
        'INSERT INTO reviews (user_id, game_id, rating, content, title) VALUES ($1, $2, $3, $4, $5) RETURNING game_id as gameId, title, content, rating',
        [userId, gameId, rating, reviewText, title]
    );
    return result.rows[0];
}

export const deleteUserReview = async (userId: number, gameId: number): Promise<void> => {
    await pool.query('DELETE FROM reviews WHERE user_id = $1 AND game_id = $2', [userId, gameId]);
}

export const getUserReviews = async (userId: number): Promise<UserGameReviews[]> => {
    const result = await pool.query<UserGameReviews>(
        `SELECT r.game_id, r.user_id,  r.title, r.content, r.rating, g.title as "game_title"
        FROM reviews r JOIN games g ON r.game_id = g.id
        WHERE r.user_id = $1`,
        [userId]
    );
    return result.rows;
}