import { Router } from 'express';
import { getAllGames, getGameById } from '../controllers/games.controller';

const router = Router();

// GET /games?limit=10&offset=0
router.get('/', getAllGames);
router.get('/:id', getGameById);

export default router;