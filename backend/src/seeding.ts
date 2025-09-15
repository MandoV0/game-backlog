// populateRawg.ts
import axios from "axios";
import { pool } from "./config/database";
import dotenv from "dotenv";

dotenv.config();

const RAWG_API_KEY = "XXXX";
const RAWG_BASE = "https://api.rawg.io/api";

// Helper to insert if not exists
async function insertIfNotExists(table: string, column: string, value: string) {
  const res = await pool.query(`SELECT id FROM ${table} WHERE ${column} = $1`, [value]);
  if (res.rows.length > 0) return res.rows[0].id;

  const insert = await pool.query(
    `INSERT INTO ${table} (${column}) VALUES ($1) RETURNING id`,
    [value]
  );
  return insert.rows[0].id;
}

async function main() {
  try {
    for (let page = 1; page <= 10; page++) {
        const { data } = await axios.get(`${RAWG_BASE}/games`, {
        params: { key: RAWG_API_KEY, page, page_size: 40 },
    });
        for (const game of data.results) {

        const releaseYear = game.released ? new Date(game.released).getFullYear() : null;
        const gameRes = await pool.query(
            `INSERT INTO games (title, release_year) VALUES ($1, $2) RETURNING id`,
            [game.name, releaseYear]
        );
        const gameId = gameRes.rows[0]?.id || (
            await pool.query(`SELECT id FROM games WHERE title=$1`, [game.name])
        ).rows[0].id;

        for (const genre of game.genres) {
            const genreId = await insertIfNotExists("genres", "name", genre.name);
            await pool.query(
            `INSERT INTO game_genres (game_id, genre_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [gameId, genreId]
            );
        }

        for (const platform of game.platforms) {
            const platformId = await insertIfNotExists("platforms", "name", platform.platform.name);
            await pool.query(
            `INSERT INTO game_platforms (game_id, platform_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [gameId, platformId]
            );
        }

        if (game.background_image) {
            await pool.query(
            `INSERT INTO game_images (game_id, url, type) VALUES ($1, $2, 'cover') ON CONFLICT DO NOTHING`,
            [gameId, game.background_image]
            );
        }

        const screenshotsRes = await axios.get(`${RAWG_BASE}/games/${game.id}/screenshots`, {
            params: { key: RAWG_API_KEY },
        });
        for (const screenshot of screenshotsRes.data.results.slice(0, 5)) {
            await pool.query(
            `INSERT INTO game_images (game_id, url, type) VALUES ($1, $2, 'screenshot') ON CONFLICT DO NOTHING`,
            [gameId, screenshot.image]
            );
        }

        console.log(`Inserted/Updated game: ${game.name}`);
        }
    }

    console.log("Done!");
    pool.end();

  } catch (err) {
    console.error(err);
    pool.end();
  }
}

main();