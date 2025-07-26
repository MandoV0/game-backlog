const express = require('express');
const pool = require('./db');
const cors = require('cors');

const app = express()
app.use(express.json())
app.use(cors());

app.get('/', async(req, res) => {
    res.send("API is running.");
});

app.get('/games', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        if (limit < 1 || offset < 0) {
            return res.status(400).send('Invalid limit or offset');
        }

        // Get total count of games
        const countQuery = 'SELECT COUNT(*) FROM game';
        const countResult = await pool.query(countQuery);
        const count = parseInt(countResult.rows[0].count, 10);

        // Get paginated results
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
            GROUP BY g.gameid, g.title LIMIT $1 OFFSET $2;`;
        const values = [limit, offset];

        const result = await pool.query(query, values);
        res.json({ count, results: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

app.get('/games/:id', async (req, res) => {
    try {
        const gameId = parseInt(req.params.id);

        if (isNaN(gameId)) {
            return res.status(400).send('Invalid game id');
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
    } catch(err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

app.get('/games/bulk/:ids', async(req, res) => {
    try {
        const ids = req.params.ids.split(',').map(id => parseInt(id));
        if (!ids.length || ids.some(isNaN)) {
            return res.status(400).send('Invalid game ids');
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
        res.json({ count: result.rows.length, results: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))