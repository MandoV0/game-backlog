const { Pool } = require("pg");

pool = new Pool({
  user: "postgres",
  password: "gamebacklog",
  database: "game_backlog",
  host: "localhost",
  port: 5432,
});

module.exports = pool;
