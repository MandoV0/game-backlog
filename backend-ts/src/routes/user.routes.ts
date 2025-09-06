import { Router } from 'express';
import { 
  register, 
  login, 
  getProfile, 
  getBacklog, 
  addToBacklog, 
  updateGameStatus, 
  removeFromBacklog,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  logPlaytime,
  getPlaytimeStats
} from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.use(authenticateToken);

// Profile
router.get('/profile', getProfile);

// Backlog management
router.get('/backlog', getBacklog);
router.post('/backlog', addToBacklog);
router.put('/backlog/:gameId', updateGameStatus);
router.delete('/backlog/:gameId', removeFromBacklog);

// Reviews
router.get('/reviews', getReviews);
router.post('/reviews', createReview);
router.put('/reviews/:gameId', updateReview);
router.delete('/reviews/:gameId', deleteReview);

// Playtime tracking
router.post('/playtime', logPlaytime);
router.get('/playtime/stats', getPlaytimeStats);

export default router;
