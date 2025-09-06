import { Router } from 'express';
import { getAllGames, getGameById, searchGames, getPlatforms, getGenres } from '../controllers/games.controller';

const router = Router();

// GET /games?limit=10&offset=0
router.get('/', getAllGames);
// GET /games/search?q=zelda&genres=1,2&platforms=1,2&yearFrom=2020&yearTo=2023&sortBy=title&sortOrder=asc&limit=10&offset=0
router.get('/search', searchGames);
// GET /games/platforms
router.get('/platforms', getPlatforms);
// GET /games/genres
router.get('/genres', getGenres);
router.get('/:id', getGameById);

export default router;