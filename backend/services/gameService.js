const logger = require("../utils/logger");

class GameService {
  async getGames(limit, offset, userId) {
    try {
      const countQuery = "SELECT COUNT(*) FROM game";
      const countResult = await pool.query(countQuery);
      const count = parseInt(countResult.rows[0].count, 10);

      const gameQuery = `SELECT
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
          GROUP BY g.gameid, g.title 
          ORDER BY g.title
          LIMIT $1 OFFSET $2`;

      const gameResult = await pool.query(gameQuery, [limit, offset]);
      let games = gameResult.rows;

      // Get favorite status if user is authenticated
      if (userId) {
        const favoriteIds = await this.getUserFavoriteIds(userId);
        games = games.map((game) => ({
          ...game,
          is_favorite: favoriteIds.includes(game.gameid),
        }));
      }

      return { count, results: games };
    } catch (err) {
      logger.error("Error fetching games in game service:", err);
      throw new Error("Server error fetching games");
    }
  }

  async getGameWithId(gameid) {
    try {
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

      const result = await pool.query(query, [gameid]);

      if (result.rows.length === 0) {
        throw new Error("Game not found");
      }

      return result.rows[0];
    } catch (err) {
      logger.error("Error fetching game by ID in game service:", err);
      throw new Error("Server error fetching game by ID");
    }
  }

  async getGamesByIds(gameIds) {
    try {
      if (!gameIds.length) {
        return [];
      }

      const query = `
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
        WHERE g.gameid = ANY($1)
        GROUP BY g.gameid, g.title, g.description
        ORDER BY g.title`;

      const result = await pool.query(query, [gameIds]);
      return result.rows;
    } catch (error) {
      logger.error("Error fetching games by IDs:", error);
      throw new Error("Failed to fetch games");
    }
  }

  async getUserFavoriteIds(userId) {
    try {
      const favQuery = `SELECT gameid FROM user_game_favorite WHERE userid = $1`;
      const favResult = await pool.query(favQuery, [userId]);
      return favResult.rows.map((row) => row.gameid);
    } catch (err) {
      logger.error("Error fetching user favorite IDs:", err);
      return [];
    }
  }

  /* FAVORITES */
  async getUserFavorites(limit, offset, userId) {
    try {
      const favoritesQuery = `SELECT gameid FROM user_game_favorite WHERE userid = $1 LIMIT $2 OFFSET $3`;
      const result = await pool.query(favoritesQuery, [userId, limit, offset]);

      const favoriteGameIds = result.rows.map((row) => row.gameid);

      const games = await this.getGamesByIds(favoriteGameIds);
      return { count: games.length, results: games };
    } catch (err) {
      logger.error("Error fetching user favorites:", err);
      throw new Error("Server error fetching user favorites");
    }
  }

  async setFavorite(userId, gameId) {
    try {
      const gameExists = await pool.query(
        `SELECT * FROM game WHERE gameid = $1`,
        [gameId]
      );

      if (gameExists.rowCount === 0) {
        logger.info(`Game with ID ${gameId} not found.`);
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
        return { message: "Game unfavorited" };
      }

      const query = `
        INSERT INTO user_game_favorite (userid, gameid)
        VALUES ($1, $2)
        ON CONFLICT (userid, gameid) DO NOTHING
      `;
      await pool.query(query, [userId, gameId]);
      return { message: "Game favorited successfully" };
    } catch (err) {
      logger.error("Error setting favorite:", err);
      throw new Error("Server error setting favorite");
    }
  }
}

module.exports = new GameService();
