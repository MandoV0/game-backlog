const pool = require("../db");

/**
 * Posts a user review for a specific game.
 * @param {*} req 
 * @param {*} res 
 */
exports.createReview = async (req, res) => {
  try {
    if (!req.user || !req.user.userid) {
      return res.status(401).json({ error: "Unauthorized: No user ID found." });
    }
    const userid = req.user.userid;

    const { gameid, rating, reviewText} = req.body;
    if (!gameid || !rating || !reviewText) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5"});
    }

    const result = await pool.query(`INSERT INTO user_review (gameid, userid, review_text, rating)
      VALUES ($1, $2, $3, $4) RETURNING *`, [gameid, userid, reviewText, rating]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error." });
  }
}