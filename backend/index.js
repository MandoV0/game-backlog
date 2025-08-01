const express = require('express');
const pool = require('./db');
const cors = require('cors');

const { getGames, getGameWithId, bulkGetGamesWithId } = require('./controllers/gameController');
const { login, register } = require('./controllers/authController')
const { isTokenValid } = require('./middleware/jwtHelper');

const app = express()
app.use(express.json())
app.use(cors());

app.get('/', async(req, res) => {
    res.send("API is running.");
});

app.get('/games', isTokenValid, getGames);
app.get('/games/:id', isTokenValid, getGameWithId);
app.get('/games/bulk/:ids', isTokenValid, bulkGetGamesWithId);

app.post('/auth/login', login);
app.post('/auth/register', register);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))