const express = require('express');
const pool = require('./db');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const { getGames, getGameWithId, bulkGetGamesWithId } = require('./controllers/gameController');
const { login, register } = require('./controllers/authController')
const { isTokenValid, optionalAuth } = require('./middleware/auth');
const { createFavorite, deleteFavorite, getFavorites } = require('./controllers/favoriteController');
const { createReview, getGameRatings, getReviewsForGame, updateReview } = require('./controllers/reviewController');

const app = express()
app.use(cors({
  origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 120,              // max 60 requests per window per IP
  message: 'Too many requests, please try again later.'
});

app.use(apiLimiter);
app.use(express.json());

app.get('/', async(req, res) => {
    res.send("API is running.");
});

app.get('/games', isTokenValid, getGames);
app.get('/games/:id', isTokenValid, getGameWithId);
app.get('/games/bulk/:ids', isTokenValid, bulkGetGamesWithId);

app.post('/auth/login', login);
app.post('/auth/register', register);

app.post('/users/favorites', isTokenValid, createFavorite);
app.delete('/users/favorites/:gameid', isTokenValid, deleteFavorite);
app.get('/users/favorites', isTokenValid, getFavorites);

app.post('/reviews', isTokenValid, createReview);
app.get('/reviews/rating/:id', getGameRatings);
app.get('/reviews/:id', optionalAuth, getReviewsForGame);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));