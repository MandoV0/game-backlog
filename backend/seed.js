const pool = require('./db');

const games = [
  {
    title: 'The Witcher 3: Wild Hunt',
    description:
      'The Witcher 3: Wild Hunt is an action role-playing game with a third-person perspective. Players control Geralt of Rivia, a monster slayer known as a Witcher.',
    releasedate: '2015-05-19',
    genres: ['Adventure', 'Action', 'RPG'],
    images: [
      'https://example.com/witcher3-1.jpg',
      'https://example.com/witcher3-2.jpg',
    ]
  },
  {
    title: 'God of War',
    description:
      'God of War is an action-adventure game where Kratos battles gods and monsters in Norse mythology while bonding with his son.',
    releasedate: '2018-04-20',
    genres: ['Action', 'Adventure'],
    images: [
      'https://example.com/gow1.jpg',
      'https://example.com/gow2.jpg',
    ]
  },
  {
    title: 'Hades',
    description:
      'Hades is a rogue-like dungeon crawler where you defy the god of the dead as you hack and slash your way out of the Underworld.',
    releasedate: '2020-09-17',
    genres: ['Action', 'Rogue-like'],
    images: [
      'https://example.com/hades1.jpg',
      'https://example.com/hades2.jpg',
    ]
  },
  {
    title: 'The Legend of Zelda: Breath of the Wild',
    description:
      'An open-world adventure game where you explore the vast kingdom of Hyrule and uncover its secrets.',
    releasedate: '2017-03-03',
    genres: ['Adventure', 'Action'],
    images: [
      'https://example.com/zelda1.jpg',
      'https://example.com/zelda2.jpg',
    ]
  },
  {
    title: 'Elden Ring',
    description:
      'Elden Ring is an open-world action RPG created by FromSoftware and George R.R. Martin, known for its punishing combat and deep lore.',
    releasedate: '2022-02-25',
    genres: ['RPG', 'Action', 'Fantasy'],
    images: [
      'https://example.com/eldenring1.jpg',
      'https://example.com/eldenring2.jpg',
    ]
  }
];

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