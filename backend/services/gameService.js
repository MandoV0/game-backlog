const pool = require("../db");
const logger = require("../utils/logger");

class GameService {

  _buildGetGameQuery({ where = "", order = "", limit = "", offset = "" } = {}) {
    return `
      SELECT 
        g.gameid,
        g.title,
        g.description,
        g.releasedate,
        ROUND(COALESCE(AVG(ur.rating), 0), 2) AS avg_rating,
        ARRAY_REMOVE(ARRAY_AGG(DISTINCT gi.url), NULL) AS images,
        ARRAY_REMOVE(ARRAY_AGG(DISTINCT ge.name), NULL) AS genres
      FROM game g
        LEFT JOIN user_review ur ON g.gameid = ur.gameid
        LEFT JOIN game_image gi ON g.gameid = gi.gameid
        LEFT JOIN game_genre gg ON g.gameid = gg.gameid
        LEFT JOIN genre ge ON gg.genreid = ge.genreid
      ${where}
      GROUP BY g.gameid, g.title, g.description
      ${order}
      ${limit}
      ${offset};
    `;
  }

  async getGames(limit, offset, userId) {
    logger.info("GameService.getGames called", {
      limit,
      offset,
      userId,
      hasUser: !!userId,
    });

    try {
      const countQuery = "SELECT COUNT(*) FROM game";
      const countResult = await pool.query(countQuery);
      const count = parseInt(countResult.rows[0].count, 10);

      const gameQuery = this._buildGetGameQuery({
        order: `ORDER BY g.title`,
        limit: `LIMIT $1`,
        offset: `OFFSET $2`
      });

      const gameResult = await pool.query(gameQuery, [limit, offset]);
      let games = gameResult.rows;

      if (userId) {
        const favoriteIds = await this.getUserFavoriteIds(userId);
        games = games.map((game) => ({
          ...game,
          is_favorite: favoriteIds.includes(game.gameid),
        }));
      }

      logger.info("GameService.getGames successful", {
        gamesCount: games.length,
        totalCount: count,
        userId,
      });

      return { count, results: games };
    } catch (err) {
      logger.error("GameService.getGames error", {
        limit,
        offset,
        userId,
        error: err.message,
        stack: err.stack,
      });
      throw new Error("Server error fetching games");
    }
  }

  async getGameWithId(gameid) {
    logger.info("GameService.getGameWithId called", { gameid });

    try {
      const query = this._buildGetGameQuery({
        where: `WHERE g.gameid = $1`
      });

      const result = await pool.query(query, [gameid]);
      console.log("Result:", result.rows);

      if (result.rows.length === 0) {
        logger.warn("GameService.getGameWithId game not found", { gameid });
        throw new Error("Game not found");
      }

      logger.info("GameService.getGameWithId successful", {
        gameid,
        gameTitle: result.rows[0].title,
      });

      return result.rows[0];
    } catch (err) {
      logger.error("GameService.getGameWithId error", {
        gameid,
        error: err.message,
        stack: err.stack,
      });
      throw err;
    }
  }

  async _getGameImageUrls(gameId) {
    logger.info("GameService._getGameImageUrls called", { gameId });

    try {
      const query = `SELECT url FROM game g LEFT JOIN game_image gi ON gi.gameid = g.gameid WHERE g.gameid = $1`;
      const result = await pool.query(query, [gameId]);
      const imageUrls = result.rows.map((row) => row.url);
      logger.info("GameService._getGameImageUrls successful", {
        gameId,
        imageUrls,
      });
      return imageUrls;
    } catch (err) {
      logger.error("GameService._getGameImageUrls error", {
        gameId,
        error: err.message,
        stack: err.stack,
      });
      throw new Error("Failed to fetch game image URLs");
    }
  }

  async _getGameGenres(gameId) {
    logger.info("GameService._getGameGenres called", { gameId });

    try {
      const query = `SELECT name FROM game g LEFT JOIN game_genre gg ON gg.gameid = g.gameid LEFT JOIN genre gr ON gr.genreid = gg.genreid WHERE g.gameid = $1`;
      const result = await pool.query(query, [gameId]);
      const genres = result.rows.map((row) => row.name);
      logger.info("GameService._getGameGenres successful", { gameId, genres });
      return genres;
    } catch (err) {
      logger.error("GameService._getGameGenres error", {
        gameId,
        error: err.message,
        stack: err.stack,
      });
      throw new Error("Failed to fetch game genres");
    }
  }

  async getGamesByIds(gameIds) {
    logger.info("GameService.getGamesByIds called", {
      gameIds,
      count: gameIds.length,
    });

    try {
      if (!gameIds.length) {
        logger.info("GameService.getGamesByIds empty array provided");
        return [];
      }

      const query = this._buildGetGameQuery({
        where: `WHERE g.gameid = ANY($1)`
      });

      const result = await pool.query(query, [gameIds]);

      logger.info("GameService.getGamesByIds successful", {
        requestedCount: gameIds.length,
        returnedCount: result.rows.length,
      });

      return result.rows;
    } catch (error) {
      logger.error("GameService.getGamesByIds error", {
        gameIds,
        error: error.message,
        stack: error.stack,
      });
      throw new Error("Failed to fetch games");
    }
  }

  async getUserFavoriteIds(userId) {
    logger.debug("GameService.getUserFavoriteIds called", { userId });

    try {
      const favQuery = `SELECT gameid FROM user_game_favorite WHERE userid = $1`;
      const favResult = await pool.query(favQuery, [userId]);
      const favoriteIds = favResult.rows.map((row) => row.gameid);

      logger.debug("GameService.getUserFavoriteIds successful", {
        userId,
        favoriteCount: favoriteIds.length,
      });

      return favoriteIds;
    } catch (err) {
      logger.error("GameService.getUserFavoriteIds error", {
        userId,
        error: err.message,
        stack: err.stack,
      });
      return [];
    }
  }

  /* FAVORITES */
  async getUserFavorites(limit, offset, userId) {
    logger.info("GameService.getUserFavorites called", {
      limit,
      offset,
      userId,
    });

    try {
      const favoritesQuery = `SELECT gameid FROM user_game_favorite WHERE userid = $1 LIMIT $2 OFFSET $3`;
      const result = await pool.query(favoritesQuery, [userId, limit, offset]);

      const favoriteGameIds = result.rows.map((row) => row.gameid);

      const games = await this.getGamesByIds(favoriteGameIds);

      logger.info("GameService.getUserFavorites successful", {
        userId,
        favoritesCount: games.length,
      });

      return { count: games.length, results: games };
    } catch (err) {
      logger.error("GameService.getUserFavorites error", {
        limit,
        offset,
        userId,
        error: err.message,
        stack: err.stack,
      });
      throw new Error("Server error fetching user favorites");
    }
  }

  async setFavorite(userId, gameId) {
    logger.info("GameService.setFavorite called", { userId, gameId });

    try {
      const gameExists = await pool.query(
        `SELECT * FROM game WHERE gameid = $1`,
        [gameId]
      );

      if (gameExists.rowCount === 0) {
        logger.warn("GameService.setFavorite game not found", { gameId });
        throw new Error("Game not found");
      }

      const isFavorite = await pool.query(
        `SELECT * FROM user_game_favorite WHERE gameid = $1 AND userid = $2`,
        [gameId, userId]
      );

      if (isFavorite.rowCount > 0) {
        const deleteFavorite = await pool.query(
          `DELETE FROM user_game_favorite WHERE gameid = $1 AND userid = $2`,
          [gameId, userId]
        );

        logger.info("GameService.setFavorite unfavorited", { userId, gameId });
        return { message: "Game unfavorited" };
      }

      const query = `
        INSERT INTO user_game_favorite (userid, gameid)
        VALUES ($1, $2)
        ON CONFLICT (userid, gameid) DO NOTHING
      `;
      await pool.query(query, [userId, gameId]);

      logger.info("GameService.setFavorite favorited", { userId, gameId });
      return { message: "Game favorited successfully" };
    } catch (err) {
      logger.error("GameService.setFavorite error", {
        userId,
        gameId,
        error: err.message,
        stack: err.stack,
      });
      throw err;
    }
  }
}

module.exports = new GameService();
