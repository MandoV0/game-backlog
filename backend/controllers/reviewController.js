const pool = require("../db");
const logger = require("../utils/logger");
const reviewService = require("../services/reviewService");
const { validateGameId, validatePagination } = require("../utils/validation");

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

exports.getGameRatings = async (req, res) => {
  const gameid = req.params.id;

  logger.info('Get game ratings request', {
    gameId: gameid,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  try {
    const validatedGameId = validateGameId(gameid);

    const result = await reviewService.getRatingsForGame(validatedGameId);
    logger.info('Get review stats successful', {
      gameId: validatedGameId,
      totalReviews: result.total_reviews,
      avgRating: result.avg_review
    });

    return res.status(200).json(result);
  } catch (err) {
    logger.error('Get review stats failed', {
      gameId: gameid,
      error: err.message,
      stack: err.stack
    });
    return res.status(500).json({ error: "Server error." });
  }
};

exports.getReviewsForGame = async (req, res) => {
  const gameid = req.params.id;
  const userId = req.user?.id || null;

  try {
    const validatedGameId = validateGameId(gameid);
    const validatedParams = validatePagination(req.query);
    const { total, results } = await reviewService.getReviewsForGame(validatedGameId, userId, validatedParams.limit, validatedParams.offset);
    return res.status(200).json({ total, results });
  } catch (err) {
    logger.error('Get reviews for game failed', {
      gameId: gameid,
      userId: userid,
      error: err.message,
      stack: err.stack
    });
    return res.status(500).json({ error: "Server error." });
  }
};