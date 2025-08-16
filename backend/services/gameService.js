const pool = require("../db");
const gameModel = require("../models/game");
const favoritesModel = require("../models/favorite");
const logger = require("../utils/logger");

class GameService {

  async getGames(limit, offset, userId) {
    logger.info("GameService.getGames called", {
      limit,
      offset,
      userId,
      hasUser: !!userId,
    });

    try {
      const gameResult = await gameModel.getAll(limit, offset);
      const totalCount = await gameModel.getTotalCount();
      console.log("Game Result:", gameResult);
      
      /*
      if (userId) {
        const favoriteIds = await this.getUserFavoriteIds(userId);
        games = games.map((game) => ({
          ...game,
          is_favorite: favoriteIds.includes(game.gameid),
        }));
      }
      */

      return { total: totalCount, results: gameResult };
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
      const result = await gameModel.getById(gameid);
      console.log("Result:", result);

      logger.info("GameService.getGameWithId successful", {
        gameid,
        gameTitle: result.title,
      });

      return result;
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

      const result = await gameModel.getByIds(gameIds);

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

  /* FAVORITES */
  async getUserFavorites(limit, offset, userId) {
    logger.info("GameService.getUserFavorites called", {
      limit,
      offset,
      userId,
    });

    try {
      const favorites = await favoritesModel.getUserFavorites(userId, limit, offset);
      console.log("Favorites:", favorites);
      logger.info("GameService.getUserFavorites successful", {
        userId,
        favoritesCount: favorites.total,
      });

      return { total: favorites.total, results: favorites.results };
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
