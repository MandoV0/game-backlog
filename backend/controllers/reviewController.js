const pool = require("../db");
const logger = require("../utils/logger");
const reviewService = require("../services/reviewService");
const { validateGameId, validatePagination, validateReview } = require("../utils/validation");

/**
 * Posts a user review for a specific game.
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.createReview = async (req, res) => {
  const userid = req.user.id;
  const { gameid, rating, review_text } = req.body;

  logger.info('Create review request', { userId: userid, gameId: gameid, rating: rating });

  try {
    const result = await reviewService.createGameReview(userid, gameid, req.body);
    logger.info('Create review successful', { userId: userid, gameId: gameid, reviewId: result.reviewid });
    return res.status(201).json(result);
  } catch (err) {
    logger.error('Create review failed', { userId: userid, gameId: gameid, error: err.message });
    return res.status(500).json({ error: err.message });
  }
};

exports.getGameRatings = async (req, res) => {
  const gameid = req.params.id;

  logger.info('Get game ratings request', { gameId: gameid });

  try {
    const validatedGameId = validateGameId(gameid);

    const result = await reviewService.getRatingsForGame(validatedGameId);
    logger.info('Get review stats successful', {
      gameId: validatedGameId, totalReviews: result.total_reviews, avgRating: result.avg_review
    });

    return res.status(200).json(result);
  } catch (err) {
    logger.error('Get review stats failed', { gameId: gameid, error: err.message, stack: err.stack });
    return res.status(500).json({ error: err.message });
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
    logger.error('Get reviews for game failed', { gameId: gameid, userId: userId, error: err.message, stack: err.stack });
    return res.status(500).json({ error: err.message });
  }
};