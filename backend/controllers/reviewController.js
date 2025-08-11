const pool = require("../db");

/**
 * Posts a user review for a specific game.
 * @param {*} req
 * @param {*} res
 */
exports.createReview = async (req, res) => {
  try {
    const userid = req.user.id;

    const { gameid, rating, review_text } = req.body;
    if (!gameid || !rating || !review_text) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const result = await pool.query(
      `INSERT INTO user_review (gameid, userid, review_text, rating)
      VALUES ($1, $2, $3, $4) RETURNING *`,
      [gameid, userid, review_text, rating]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error." });
  }
};

exports.getReviewStats = async (req, res) => {
  try {
    const gameid = parseInt(req.params.id);
  
    if (!gameid) {
      return res.status(400).json({ error: "Missing required field, gameid." });
    }
  
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
  
    const result = await pool.query(query, [gameid]);
  
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error." });
  }
};