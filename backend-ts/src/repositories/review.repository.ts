import { pool } from "../config/database";
import { Review } from "../models/review.model";
import { ApiError } from "../utils/error";

export async function createReview(gameId: number, userId: number, rating: number, review_text: string): Promise<Review> {
  try {
    const result = await pool.query(`INSERT INTO user_review (gameid, userid, rating, review_text) VALUES ($1, $2, $3, $4) RETURNING *`, [gameId, userId, rating, review_text]);
    return result.rows[0];
  } catch (error: any) {
    if (error.code === '23505') { // Unique violation error code of Postgres
      throw new ApiError(409, "Review already exists");
    }
    throw new ApiError(500, "Database error while creating review: " + error.message);
  }
}

export async function deleteReview(gameId: number, userId: number): Promise<Review> {
  try {
    const result = await pool.query(`DELETE FROM user_review WHERE gameid = $1 AND userid = $2 RETURNING *`, [gameId, userId]);
    if (result.rowCount === 0) {
      throw new ApiError(404, "Review does not exist");
    }
    return result.rows[0];
  } catch (error: any) {
    throw new ApiError(500, "Database error while deleting review: " + error.message);
  }
}

export async function getReviews(gameId: number, limit: number = 10, offset: number = 0): Promise<Review[]> {
  try {
    const result = await pool.query(`SELECT * FROM user_review WHERE gameid = $1 LIMIT $2 OFFSET $3`, [gameId, limit, offset]);
    return result.rows;
  } catch (error: any) {
    throw new ApiError(500, "Database error while getting reviews: " + error.message);
  }
}
export async function getRatingSummary(gameId: number) {
  try {
    const result = await pool.query(`
      SELECT
        gameid,
        AVG(rating) as average_rating,
        COUNT(*) as total_reviews,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star_reviews,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star_reviews,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star_reviews,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star_reviews,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star_reviews
      FROM user_review
      WHERE gameid = $1
      GROUP BY gameid
    `, [gameId]);
    return result.rows[0];
  } catch (error: any) {
    throw new ApiError(500, "Database error while getting rating summary: " + error.message);
  }
}