const pool = require("../db");
const {
  validatePagination,
  validateGameId,
  validateGameIds,
} = require("../utils/validation");
const logger = require("../utils/logger");
const gameService = require("../services/gameService");

/**
 * Returns a paginated list of games, including ratings, images, genres,
 * and if each game is marked as a favorite by the authenticated user.
 *
 * @async
 * @param {Object} req - Request object.
 * @param {string} [req.query.limit=10] - Max number of games to return.
 * @param {string} [req.query.offset=0] - Number of games to skip.
 * @param {Object} [req.user] - Authenticated user object (optional).
 * @param {number} [req.user.id] - User ID of the authenticated user.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Sends:
 * - 400 if pagination parameters are invalid
 * - 200 with `{ count, results }` where `results` is an array of game objects
 * - 500 on database error
 */
exports.getGames = async (req, res) => {
  try {
    const { limit, offset } = validatePagination(req.query);
    const userId = req.user?.id || null;

    const result = await gameService.getGames(limit, offset, userId);

    res.json(result);
  } catch (err) {
    logger.error("Error in getGames controller:", err);
    res.status(500).json({ message: "Internal server error during getGames" });
  }
};

/**
 * Returns a single game by its ID, including its ratings, images, and genres.
 *
 * @async
 * @param {Object} req - Request object.
 * @param {string} req.params.id - ID of the game to fetch.
 * @param {Object} res - Response object.
 * @returns {Promise<void>} Sends:
 * - 400 if the game ID is invalid
 * - 200 with game details
 * - 500 on database error
 */
exports.getGameWithId = async (req, res) => {
  try {
    const gameId = validateGameId(req.params.id);
    const game = await gameService.getGameWithId(gameId);
    res.json(game);
  } catch (err) {
    logger.error("Error in getGameWithId controller:", err);
    res.status(500).json({ message: "Internal server error during getGameWithId" });
  }
};

/**
 * Returns multiple games by a comma-separated list of IDs.
 *
 * @async
 * @param {Object} req - Request object.
 * @param {string} req.params.ids - Comma-separated list of game IDs.
 * @param {Object} res - Response object.
 * @returns {Promise<void>} Sends:
 * - 400 if IDs are invalid
 * - 200 with `{ count, results }`
 * - 500 on database error
 */
exports.bulkGetGamesWithId = async (req, res) => {
  try {
    const gameIds = validateGameIds(req.params.ids);
    const games = await gameService.getGamesByIds(gameIds);

    const result = { count: games.length, results: games };
    res.json(result);
  } catch (err) {
    logger.error("Error in bulkGetGamesWithId controller:", err);
    res.status(500).json({ message: "Internal server error during bulkGetGamesWithId" });
  }
};