const pool = require("../db");
const {
  validatePagination,
  validateGameId,
  validateGameIds,
} = require("../helpers/validatePagination");
const logger = require("../utils/logger");

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
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error during getGames";
    res.status(statusCode).json({ message });
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
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error during getGameWithId";
    res.status(statusCode).json({ message });
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
  } catch (error) {
    logger.error("Error in bulkGetGamesWithId controller:", error);
    const statusCode = error.statusCode || 500;
    const message =
      error.message || "Internal server error during bulkGetGamesWithId";
    res.status(statusCode).json({ message });
  }
};

exports.getGamesByIds = async (ids) => {
  if (!ids.length || ids.some(isNaN)) {
    throw new Error("Invalid Game ids");
  }

  const query = `SELECT 
          g.gameid,
          g.title,
          g.description,
          ROUND(COALESCE(AVG(ur.rating), 0), 2) AS avg_rating,
          ARRAY_REMOVE(ARRAY_AGG(DISTINCT gi.url), NULL) AS images,
          ARRAY_REMOVE(ARRAY_AGG(DISTINCT ge.name), NULL) AS genres
          FROM game g
          LEFT JOIN user_review ur ON g.gameid = ur.gameid
          LEFT JOIN game_image gi ON g.gameid = gi.gameid
          LEFT JOIN game_genre gg ON g.gameid = gg.gameid
          LEFT JOIN genre ge ON gg.genreid = ge.genreid
          WHERE g.gameid = ANY($1)
          GROUP BY g.gameid, g.title, g.description;`;

  const result = await pool.query(query, [ids]);
  return result.rows;
};
