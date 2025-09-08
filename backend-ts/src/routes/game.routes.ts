import { Router } from 'express';
import { getAllGames, getGameById, getGameReviews, getGameReviewStatistics, getGameStatusStatistics, getGenres, getPlatforms } from '../controllers/games.controller';

const router = Router();

// GET /games?limit=10&offset=0
router.get('/genres', getGenres);
router.get('/platforms', getPlatforms);
router.get('/', getAllGames);
// GET /games/:id
router.get('/:id', getGameById);

router.get('/:id/reviews', getGameReviews);

router.get('/:id/review-statistics', getGameReviewStatistics);

router.get('/:id/status-statistics', getGameStatusStatistics);


export default router;