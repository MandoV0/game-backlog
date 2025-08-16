const pool = require("../db");
const logger = require("../utils/logger");

/**
 * Posts a user review for a specific game.
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.createReview = async (req, res) => {
  const userid = req.user.id;
  const { gameid, rating, review_text } = req.body;

  logger.info('Create review request', {
    userId: userid,
    gameId: gameid,
    rating: rating,
    reviewTextLength: review_text ? review_text.length : 0,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  try {
    if (!gameid || !rating || !review_text) {
      logger.warn('Create review validation failed', {
        userId: userid,
        gameId: gameid,
        hasRating: !!rating,
        hasReviewText: !!review_text
      });
      return res.status(400).json({ error: "Missing required fields." });
    }

    if (rating < 1 || rating > 5) {
      logger.warn('Create review invalid rating', {
        userId: userid,
        gameId: gameid,
        rating: rating
      });
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const result = await pool.query(
      `INSERT INTO user_review (gameid, userid, review_text, rating)
      VALUES ($1, $2, $3, $4) RETURNING *`,
      [gameid, userid, review_text, rating]
    );

    logger.info('Create review successful', {
      userId: userid,
      gameId: gameid,
      rating: rating,
      reviewId: result.rows[0].reviewid
    });

    res.status(201).json(result.rows[0]);
  } catch (err) {
    logger.error('Create review failed', {
      userId: userid,
      gameId: gameid,
      rating: rating,
      error: err.message,
      stack: err.stack
    });
    return res.status(500).json({ error: "Server error." });
  }
};

exports.getReviewStats = async (req, res) => {
  const gameid = req.params.id;

  logger.info('Get review stats request', {
    gameId: gameid,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  try {
    const validatedGameId = parseInt(gameid);

    if (!validatedGameId || isNaN(validatedGameId)) {
      logger.warn('Get review stats invalid game ID', {
        gameId: gameid
      });
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

    const result = await pool.query(query, [validatedGameId]);

    logger.info('Get review stats successful', {
      gameId: validatedGameId,
      totalReviews: result.rows[0].total_reviews,
      avgRating: result.rows[0].avg_review
    });

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    logger.error('Get review stats failed', {
      gameId: gameid,
      error: err.message,
      stack: err.stack
    });
    return res.status(500).json({ error: "Server error." });
  }
};

exports.getGameReviews = async (req, res) => {
  const gameid = req.params.id;

  logger.info('Get game reviews request', {
    gameId: gameid,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  try {
    const validatedGameId = parseInt(gameid);

    if (!validatedGameId || isNaN(validatedGameId)) {
      logger.warn('Get game reviews invalid game ID', {
        gameId: gameid
      });
      return res.status(400).json({ error: "Missing required field, gameid." });
    }

    const query = `SELECT ur.*, u.username FROM user_review ur JOIN users u ON ur.userid = u.userid WHERE ur.gameid = $1 ORDER BY ur.review_date DESC`;
    const result = await pool.query(query, [validatedGameId]);

    logger.info('Get game reviews successful', {
      gameId: validatedGameId,
      reviewsCount: result.rows.length
    });

    return res.status(200).json(result.rows);
  } catch (err) {
    logger.error('Get game reviews failed', {
      gameId: gameid,
      error: err.message,
      stack: err.stack
    });
    return res.status(500).json({ error: "Server error." });
  }
};