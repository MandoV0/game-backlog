const pool = require("../db");
const {
  validatePagination,
  validateGameId,
  validateGameIds,
} = require("../utils/validation");
const gameService = require("../services/gameService");
const logger = require("../utils/logger");

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
 * - 200 with `{ count, results }` where results is an array of favorite game objects
 * - 500 on database error
 */
exports.getFavorites = async (req, res) => {
  try {
    const { limit, offset } = validatePagination(req.query);
    const userid = req.user.id;

    const favoriteGames = await gameService.getUserFavorites(
      limit,
      offset,
      userid
    );
    return res.json(favoriteGames);
  } catch (err) {
    logger.error("Error in getFavorites controller:", err);
    res.status(500).json({ message: "Database error" });
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
exports.setFavorite = async (req, res) => {
  try {
    const gameid = validateGameId(req.params.id);
    const userId = req.user.id;

    const result = await gameService.setFavorite(userId, gameid);
    return res.json(result);
  } catch (err) {
    logger.error("Error in setFavorite controller:", err);
    return res.status(500).json({ message: "Database error" });
  }
};
