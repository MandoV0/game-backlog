const pool = require('../db');

class Game {
  static _baseQuery({ where = "", order = "", limit = "", offset = "" } = {}) {
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

  /**
   * Get a game by its ID
   * @param {string} gameId - The ID of the Game
   * @returns {Promise<Object>} The game object
   */
  static async getById(gameId) {
    const query = this._baseQuery({
      where: `WHERE g.gameid = $1`,
    });
    const result = await pool.query(query, [gameId]);
    return result.rows[0];
  }

  static async getByIds(gameIds, limit = 20, offset = 0) {
    const query = this._baseQuery({
      where: `WHERE g.gameid = ANY($1)`,
      limit: `LIMIT $2`,
      offset: `OFFSET $3`,
    });
    const result = await pool.query(query, [gameIds, limit, offset]);
    return result.rows;
  }

  static async getAll(limit = 20, offset = 0) {
    const query = this._baseQuery({
      limit: `LIMIT $1`,
      offset: `OFFSET $2`,
    });
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  static async getTotalCount() {
    const query = `SELECT COUNT(*) FROM game`;
    const result = await pool.query(query);
    return parseInt(result.rows[0].count, 10);
  }

}

module.exports = Game;