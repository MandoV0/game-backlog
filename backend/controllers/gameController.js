const pool = require("../db");

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
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const userid = req.user?.id || null;

    if (limit < 1 || offset < 0) {
      return res.status(400).send("Invalid limit or offset");
    }

    // Total games count
    const countQuery = "SELECT COUNT(*) FROM game";
    const countResult = await pool.query(countQuery);
    const count = parseInt(countResult.rows[0].count, 10);

    const gameQuery = `
      SELECT
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
      GROUP BY g.gameid, g.title LIMIT $1 OFFSET $2;`;

    const gameResult = await pool.query(gameQuery, [limit, offset]);
    let games = gameResult.rows;

    let favoriteIds = [];
    const favQuery = `SELECT gameid FROM user_game_favorite WHERE userid = $1`;
    const favResult = await pool.query(favQuery, [userid]);

    favoriteIds = favResult.rows.map((row) => row.gameid);

    games = games.map((game) => ({
      ...game,
      is_favorite: userid ? favoriteIds.includes(game.gameid) : false,
    }));

    res.json({ count, results: games });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
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
    const gameId = parseInt(req.params.id);

    if (isNaN(gameId)) {
      return res.status(400).send("Invalid game id");
    }

    const query = `SELECT 
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
            WHERE g.gameid = $1 GROUP BY g.gameid, g.title, g.description;`;

    const result = await pool.query(query, [gameId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
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
    const ids = req.params.ids.split(",").map((id) => parseInt(id));
    if (!ids.length || ids.some(isNaN)) {
      return res.status(400).send("Invalid game ids");
    }

    const games = await exports.getGamesByIds(ids);
    res.json({ count: games.length, results: games });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
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