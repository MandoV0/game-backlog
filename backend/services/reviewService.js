const pool = require("../db");
const reviewModel = require("../models/review");
const logger = require("../utils/logger");
const { validateGameId, validateReview } = require("../utils/validation");

class ReviewService {
  /**
   * Get reviews for a specific game.
   * If Auth header is present, includes user review at the top.
   *
   * @param {number} gameId - The ID of the game.
   * @param {number} [userId=null] - The ID of the user (optional).
   * @param {number} [limit=20] - Maximum number of favorites to return.
   * @param {number} [offset=0] - Offset for pagination.
   */
  async getReviewsForGame(gameId, userId = null, limit = 20, offset = 0) {
    logger.info(`Fetching reviews for gameId: ${gameId}, userId: ${userId}, limit: ${limit}, offset: ${offset}`);
    try {
      const { total, results } = await reviewModel.getReviewsForGame(gameId, userId, limit, offset);
      return { total, results };
    } catch (error) {
      logger.error(`Error fetching reviews for gameId: ${gameId}, userId: ${userId} - ${error.message}`);
      throw new Error("Error fetching reviews");
    }
  }

  async getRatingsForGame(gameId) {
    logger.info(`Fetching ratings for gameId: ${gameId}`);
    try {
      const result = await reviewModel.getRatingsForGame(gameId);
      return result;
    } catch (error) {
      logger.error(`Error fetching ratings for gameId: ${gameId} - ${error.message}`);
      throw new Error("Error fetching ratings");
    }
  }

  async createGameReview(userId, gameId, data) {
    logger.info(`Creating review for userId: ${userId}, gameId: ${gameId}`);
    try {
      const { review_text, rating } = data;
      const validatedGameId = validateGameId(gameId);
      const validatedData = validateReview({ review_text, rating });
      const result = await reviewModel.createGameReview(userId, validatedGameId, validatedData.review_text, validatedData.rating);
      return result;
    } catch (error) {
      logger.error(`Error creating review for userId: ${userId}, gameId: ${gameId} - ${error.message}`);
      throw new Error("Error creating review");
    }
  }
}

module.exports = new ReviewService();