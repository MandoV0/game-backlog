const express = require('express');
const pool = require('./db');
const cors = require('cors');

const { getGames, getGameWithId, bulkGetGamesWithId } = require('./controllers/gameController');
const { login, register } = require('./controllers/authController')

const app = express()
app.use(express.json())
app.use(cors());

app.get('/', async(req, res) => {
    res.send("API is running.");
});

app.get('/games', getGames);
app.get('/games/:id', getGameWithId);
app.get('/games/bulk/:ids', bulkGetGamesWithId);

app.post('/auth/login', login);
app.post('/auth/register', register);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))