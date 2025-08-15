const pool = require("../db");

let games = require("./games.json");
let fakeUsers = require("./FakeUserData.json");

async function seed() {
  try {
    for (const game of games) {
      console.log(`Seeding ${game.title}`);

      const existingGame = await pool.query(
        `SELECT gameid FROM game WHERE title = $1`,
        [game.title]
      );

      let gameId;

      if (existingGame.rows.length > 0) {
        gameId = existingGame.rows[0].gameid;
        console.log(
          `Game "${game.title} already exists with ${gameId}, skipping game."`
        );
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
        const result = await pool.query(
          `SELECT genreid FROM genre WHERE genre.name = $1`,
          [genre]
        );
        let genreid;

        if (result.rows.length > 0) {
          genreid = result.rows[0].genreid;
        } else {
          const insertGenreResult = await pool.query(
            `INSERT INTO genre (name) VALUES ($1) RETURNING genreid`,
            [genre]
          );
          genreid = insertGenreResult.rows[0].genreid;
        }

        await pool.query(
          `INSERT INTO game_genre (gameid, genreid) VALUES($1, $2)`,
          [gameId, genreid]
        );
      }
    }
  } catch (err) {
    console.error(`Seeding error:`, err);
  } finally {
    await pool.end();
  }
}

async function createFakeUsers() {
  try {
    for (const user of fakeUsers) {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          username: user.username,
          password: user.password,
        }),
      });

      const responseData = await response.json();
      console.log(`Response for ${user.username}:`, responseData);
    }
  } catch (err) {
    console.error(`Error creating fake users:`, err);
  }
}

async function createReviewsForAllGames() {
  try {
    const gamesResponse = await pool.query(`SELECT gameid FROM game`);
    const games = gamesResponse.rows.map((g) => g.gameid);

    if (games.length === 0) {
      console.error("[createReviews] No games found.");
      return;
    }

    const userIds = [];
    for (const user of fakeUsers) {
      const res = await pool.query("SELECT userid FROM users WHERE email = $1", [user.email]);
      if (res.rows.length > 0) {
        userIds.push(res.rows[0].userid);
      } else {
        console.warn(`User not found in DB: ${user.email}`);
      }
    }

    if (userIds.length === 0) {
      console.error("No fake users found in DB. Seed users first!");
      return;
    }

    console.log(`📌 Found ${userIds.length} fake users and ${games.length} games.`);

    const reviewTexts = [
      "Amazing game, had so much fun!",
      "Pretty good overall, but could be better.",
      "Not bad, but I probably wouldn't replay it.",
      "Loved the story and gameplay.",
      "It was okay, nothing special.",
      "Terrible experience, wouldn’t recommend.",
      "Great graphics and sound design.",
      "Fun with friends, but gets repetitive.",
      "One of the best games I've played in years.",
      "Too many bugs ruined the experience."
    ];

    for (const gameid of games) {
      for (const userid of userIds) {
        const rating = Math.floor(Math.random() * 5) + 1; // 1–5
        const reviewText = reviewTexts[Math.floor(Math.random() * reviewTexts.length)];

        // Only one review per user per game
        await pool.query(
          `INSERT INTO user_review (gameid, userid, rating, review_text)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (userid, gameid) DO NOTHING`,
          [gameid, userid, rating, reviewText]
        );

        console.log(`Review added: User ${userid} -> Game ${gameid}`);
      }
    }

    console.log("🎉 Finished seeding reviews for all games!");
  } catch (error) {
    console.error("Error creating reviews:", error);
  }
}


async function deleteDB() {
  await pool.query("DELETE FROM game_genre;");
  await pool.query("DELETE FROM game_image;");
  await pool.query("DELETE FROM genre;");
  await pool.query("DELETE FROM game;");
  await pool.end();
}

//deleteDB();
//seed();
//createFakeUsers();
createReviewsForAllGames();