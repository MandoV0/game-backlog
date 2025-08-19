const pool = require("../db");
const { validatePagination, validateGameId } = require("../utils/validation");
const gameService = require("../services/gameService");
const logger = require("../utils/logger");
const { error } = require("winston");

/**
 * Returns a paginated list of the authenticated user favorited games.
 *
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.query - Query parameters for pagination.
 * @param {string} [req.query.limit=10] - Maximum number of favorite games to return.
 * @param {string} [req.query.offset=0] - Number of favorite games to skip (for pagination).
 * @param {Object} req.user - Authenticated user object provided by auth middleware.
 * @param {number} req.user.id - The ID of the authenticated user.
 * @param {Object} res - Response object.
 * @returns {Promise<void>} Sends:
 * - 400 if limit or offset are invalid
 * - 200 with `{ total, results }` where results is an array of favorite game objects
 * - 500 on database error
 */
exports.getFavorites = async (req, res) => {
  const { limit, offset } = req.query;
  const userid = req.user.id;

  logger.info('Get favorites request', {
    limit: parseInt(limit) || 10,
    offset: parseInt(offset) || 0,
    userId: userid,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  try {
    const validatedParams = validatePagination(req.query);
    const favoriteGames = await gameService.getUserFavorites(
      validatedParams.limit,
      validatedParams.offset,
      userid
    );

    logger.info('Get favorites successful', {
      userId: userid,
      totalCount: favoriteGames.total
    });

    return res.json(favoriteGames);
  } catch (err) {
    logger.error('Get favorites failed', {
      limit: parseInt(limit) || 10,
      offset: parseInt(offset) || 0,
      userId: userid,
      error: err.message,
      stack: err.stack
    });

    if (err.message.includes('Limit must be') || err.message.includes('Offset must be')) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Database error" });
    }
  }
};

/**
 * Toggles a game as favorite or unfavorite for the authenticated user.
 *
 * @async
 * @param {Object} req - Request object.
 * @param {string} req.params.id - The ID of the game to favorite/unfavorite.
 * @param {number} req.user.id - The ID of the authenticated user.
 * @param {Object} res - Response object.
 * @returns {Promise<void>} Sends:
 * - 400 if game ID is invalid
 * - 404 if game not found
 * - 200 with success message when favoriting or unfavoriting
 * - 500 on database error
 *
 * @example
 * // POST /favorites/101
 * // Response: { "message": "Game favorited successfully" }
 *
 * // POST /favorites/101 (if already favorited)
 * // Response: { "message": "Game unfavorited" }
 */
exports.createFavorite = async (req, res) => {
  const gameid = req.params.id;
  const userId = req.user.id;

  try {
    const validatedGameId = validateGameId(gameid);
    const result = await gameService.createFavorite(userId, validatedGameId);

    if (!result) {
      return res.status(409).json({ message: "Game is already a favorite" });
    }
    return res.status(201).json(result);
  } catch (err) {
    logger.error("Error creating favorite", {
      userId,
      gameid,
      error: err.message,
      stack: err.stack
    });
    if (err.type === 'INVALID_INPUT') {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: "Internal Server error" });
  }
};

exports.deleteFavorite = async (req, res) => {

};