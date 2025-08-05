const express = require('express');
const pool = require('./db');
const cors = require('cors');

const { getGames, getGameWithId, bulkGetGamesWithId } = require('./controllers/gameController');
const { login, register } = require('./controllers/authController')
const { isTokenValid, optionalAuth } = require('./middleware/jwtHelper');
const { setFavorite, getFavorites } = require('./controllers/favoriteController');

const app = express()
app.use(cors({
  origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

app.use(express.json())

app.get('/', async(req, res) => {
    res.send("API is running.");
});

app.get('/games', isTokenValid, getGames);
app.get('/games/:id', isTokenValid, getGameWithId);
app.get('/games/bulk/:ids', isTokenValid, bulkGetGamesWithId);

app.post('/auth/login', login);
app.post('/auth/register', register);

app.post('/favorite/:id', isTokenValid, setFavorite);
app.get('/favorite', isTokenValid, getFavorites);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));