const pool = require("../db");
const gameController = require("../controllers/gameController")

exports.getFavorites = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const userid = req.user.id;

    if (limit < 1 || offset < 0) {
      return res.status(400).send("Invalid limit or offset");
    }

    const query = `SELECT gameid FROM user_game_favorite WHERE userid = $1 LIMIT $2 OFFSET $3`
    const result = await pool.query(query, [userid, limit, offset]);
    console.log(result.rows);

    const favoriteGameIds = result.rows.map((row) => row.gameid);
    console.log(favoriteGameIds);
    const games = await gameController.getGamesByIds(favoriteGameIds);

    return res.json({ count: games.length, results: games });
  } catch (err) {
    res.status(500).json({ message: "Database error" });
  }
};

exports.setFavorite = async (req, res) => {
  try {
    const gameid = parseInt(req.params.id);
    const userid = req.user.id;
    console.log('Game ID:', gameid);

    if (!gameid || isNaN(gameid)) {
      console.log('Game id is invalid');
      return res.status(400).json({ message: 'Invalid game id' });
    }

    const gameExists = await pool.query(`SELECT * FROM game WHERE gameid = $1`, [gameid]);

    if (gameExists.rowCount === 0) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const isFavorite = await pool.query(`SELECT * FROM user_game_favorite WHERE gameid = $1 AND userid = $2`, [gameid, userid]);
    
    if (isFavorite.rowCount > 0) {
      const deleteFavorite = await pool.query(`DELETE FROM user_game_favorite WHERE gameid = $1 AND userid = $2`, [gameid, userid]);
      return res.status(200).json({ message: 'Game unfavorited' });
    }

    const query = `INSERT INTO user_game_favorite (userid, gameid) VALUES ($1, $2)`
    await pool.query(query, [userid, gameid]);

    return res.status(200).json({ message: 'Game favorited successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Database error' });
  }
}