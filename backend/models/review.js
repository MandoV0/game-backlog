const pool = require("../db");

class Review {
  static async getReviewsForGame(gameId, userId = null, limit = 20, offset = 0) {
    const query = `SELECT reviewid, rating, review_text, review_date, ur.userid, u.username FROM user_review ur LEFT JOIN users u ON ur.userid = u.userid WHERE ur.gameid = $1 ORDER BY (ur.userid = $2) DESC, review_date DESC LIMIT $3 OFFSET $4`;
    const totalReviews = `SELECT COUNT(*) FROM user_review WHERE gameid = $1`;
    const result = await pool.query(query, [gameId, userId, limit, offset]);
    const total = await pool.query(totalReviews, [gameId]);
    return { total: parseInt(total.rows[0].count, 10), results: result.rows };
  }

  static async getRatingsForGame(gameId) {
   const query = `SELECT 
      ROUND(AVG(rating), 2) AS avg_review,
        COUNT(*) AS total_reviews,
        COUNT(CASE WHEN rating = 1 THEN 1 END) AS one_star,
        COUNT(CASE WHEN rating = 2 THEN 1 END) AS two_star,
        COUNT(CASE WHEN rating = 3 THEN 1 END) AS three_star,
        COUNT(CASE WHEN rating = 4 THEN 1 END) AS four_star,
        COUNT(CASE WHEN rating = 5 THEN 1 END) AS five_star
      FROM user_review
      WHERE gameid = $1;`;
   const result = await pool.query(query, [gameId]);
   return result.rows[0];
  }


  /**
   * Creates/Updates a game review.
   * @param {string} userId - The ID of the user.
   * @param {string} gameId - The ID of the game.
   * @param {string} reviewText - A review between 10 and 1000 characters.
   * @param {string} rating - A rating between 1 and 5.
   */
  static async createGameReview(userId, gameId, reviewText, rating) {
    const query = `INSERT INTO user_review (userid, gameid, review_text, rating) VALUES ($1, $2, $3, $4) ON CONFLICT (userid, gameid) DO UPDATE SET review_text = $3, rating = $4 RETURNING *`;
    const values = [userId, gameId, reviewText, rating];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = Review;