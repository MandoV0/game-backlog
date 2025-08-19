const pool = require("../db");
const gameModel = require("../models/game");

class Favorite {

  /**
   * Check if a game is a favorite for a given user.
   *
   * @param {number} userId - The ID of the user.
   * @param {number} gameId - The ID of the game.
   * @returns {Promise<boolean>} True if the game is a favorite, false otherwise.
   *
   * @example
   * const isFav = await Favorite.isFavorite(1, 42);
   * console.log(isFav); // true or false
   */
  static async isFavorite(userId, gameId) {
    return "";
  }

   
  static async _getUserFavoriteIDs(userId) {
    const query = `SELECT gameid FROM user_game_favorite WHERE userid = $1`;
    const result = await pool.query(query, [userId]);
    return result.rows.map(row => row.gameid);
  }

  /**
   * Get paginated favorite games for a user, along with the total count.
   *
   * @param {number} userId - The ID of the user.
   * @param {number} [limit=20] - Maximum number of favorites to return.
   * @param {number} [offset=0] - Offset for pagination.
   * @returns {Promise<{ total: number, results: object[] }>} Object containing total count and results array.
   *
   * @example
   * const { total, results } = await Favorite.getUserFavorites(1, 10, 0);
   * console.log(total);      // 42
   * console.log(results);    // Array of favorite game objects
   */
  static async getUserFavorites(userId, limit = 20, offset = 0) {
    const favoriteIds = await this._getUserFavoriteIDs(userId);
    const result = await gameModel.getByIds(favoriteIds, limit, offset);
    const totalFavorites = await pool.query(`SELECT COUNT(*) FROM user_game_favorite WHERE userid = $1`, [userId]);
    return { total: parseInt(totalFavorites.rows[0].count, 10), results: result };
  }

  static async getUserFavoriteGames(userId, limit=20, offset=0) {
    throw Error("Method not implemented");
    const favoriteGamesQuery = `SELECT * FROM game g INNER JOIN user_game_favorite ug ON ug.gameid = g.gameid AND ug.userid = $1 LIMIT $2 OFFSET $3`
    const countFavoritesGamesQuery = `SELECT COUNT(*) AS total FROM user_game_favorite WHERE userid = $1`;
    const countResult = await pool.query(countFavoritesGamesQuery, [userId]);
    const count = parseInt(countResult.rows[0].total, 10);
    const favoriteGames = await pool.query(favoriteGamesQuery, [userId, limit, offset]);
    return { total: count, results: favoriteGames.rows };
  }

  /**
   * Create a favorite for a user.
   * 
   * @param {*} userId 
   * @param {*} gameId 
   * @returns 
   */
  static async createFavorite(userId, gameId) {
    const query = `INSERT INTO user_game_favorite (userid, gameid) VALUES ($1, $2) ON CONFLICT (userid, gameid) DO NOTHING RETURNING *`;
    const values = [userId, gameId];
    const result = await pool.query(query, values);
    
    return result.rows[0];
  }
}

module.exports = Favorite;
