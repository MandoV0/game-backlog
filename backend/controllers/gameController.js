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
 * - 200 with `{ total, results }` where `results` is an array of game objects
 * - 500 on database error
 */
exports.getGames = async (req, res) => {
  const { limit, offset } = req.query;
  const userId = req.user?.id || null;
  
  logger.info('Get games request', { 
    limit: parseInt(limit) || 10,
    offset: parseInt(offset) || 0,
    userId: userId,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  try {
    const validatedParams = validatePagination(req.query);
    const result = await gameService.getGames(validatedParams.limit, validatedParams.offset, userId);

    logger.info('Get games successful', { 
      userId: userId
    });
    
    res.json(result);
  } catch (err) {
    logger.error('Get games failed', {
      limit: parseInt(limit) || 10,
      offset: parseInt(offset) || 0,
      userId: userId,
      error: err.message,
      stack: err.stack
    });
    
    if (err.message.includes('Limit must be') || err.message.includes('Offset must be')) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Internal server error during getGames" });
    }
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
  const gameId = req.params.id;
  
  logger.info('Get game by ID request', { 
    gameId: gameId,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  try {
    const validatedGameId = validateGameId(gameId);
    const game = await gameService.getGameWithId(validatedGameId);
    
    logger.info('Get game by ID successful', { 
      gameId: validatedGameId,
      gameTitle: game.title
    });
    
    res.json(game);
  } catch (err) {
    logger.error('Get game by ID failed', {
      gameId: gameId,
      error: err.message,
      stack: err.stack
    });
    
    if (err.message.includes('Invalid game ID')) {
      res.status(400).json({ message: err.message });
    } else if (err.message.includes('Game not found')) {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Internal server error during getGameWithId" });
    }
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
 * - 200 with `{ total, results }`
 * - 500 on database error
 */
exports.bulkGetGamesWithId = async (req, res) => {
  const gameIds = req.params.ids;
  
  logger.info('Bulk get games request', { 
    gameIds: gameIds,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  try {
    const validatedGameIds = validateGameIds(gameIds);
    const games = await gameService.getGamesByIds(validatedGameIds);

    const result = { total: games.length, results: games };
    
    logger.info('Bulk get games successful', { 
      requestedIds: validatedGameIds,
      returnedGames: games.length
    });
    
    res.json(result);
  } catch (err) {
    logger.error('Bulk get games failed', {
      gameIds: gameIds,
      error: err.message,
      stack: err.stack
    });
    
    if (err.message.includes('Invalid game IDs')) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Internal server error during bulkGetGamesWithId" });
    }
  }
};