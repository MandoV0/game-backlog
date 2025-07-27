const pool = require('./db');

let games = require('./games.json')

async function seed() {
    try {
        for (const game of games) {
            console.log(`Seeding ${game.title}`)

            const existingGame = await pool.query(
                `SELECT gameid FROM game WHERE title = $1`, [game.title]
            );

            let gameId;

            if (existingGame.rows.length > 0) {
                gameId = existingGame.rows[0].gameid;
                console.log(`Game "${game.title} already exists with ${gameId}, skipping game."`);
                continue;
            }

            const gameResult = await pool.query(
                `INSERT INTO game (title, description, releasedate) VALUES ($1, $2, $3) RETURNING gameid`,
                [game.title, game.description, game.releasedate]
            );
            gameId = gameResult.rows[0].gameid;

            for (const url of game.images) {
                await pool.query(
                    `INSERT INTO game_image (gameid, url) VALUES ($1, $2)`,
                    [gameId, url]
                );
            }

            for (const genre of game.genres) {
                const result = await pool.query(`SELECT genreid FROM genre WHERE genre.name = $1`, [genre]);
                let genreid;

                if (result.rows.length > 0) {
                    genreid = result.rows[0].genreid;
                } else {
                    const insertGenreResult = await pool.query(`INSERT INTO genre (name) VALUES ($1) RETURNING genreid`, [genre]);
                    genreid = insertGenreResult.rows[0].genreid;
                }

                await pool.query(
                    `INSERT INTO game_genre (gameid, genreid) VALUES($1, $2)`, [gameId, genreid]
                );
            }
        }
    } catch (err) {
        console.error(`Seeding error:`, err);
    } finally {
        await pool.end();
    }
}

async function deleteDB() {
    await pool.query('DELETE FROM game_genre;');
    await pool.query('DELETE FROM game_image;');
    await pool.query('DELETE FROM genre;');
    await pool.query('DELETE FROM game;');
    await pool.end();
}

//deleteDB();
seed();