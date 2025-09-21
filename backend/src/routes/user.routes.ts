import { Router } from 'express';
import { registerUser, loginUser, addGameToBacklog, deleteGameFromBacklog, updateGameBacklogStatus, createUserReview, deleteUserReview, getUserReviews, getUserGameBacklog, isGameInBacklog, getUserReviewByGameId, updateUserReview } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.post('/backlog', authMiddleware, addGameToBacklog);
router.put('/backlog', authMiddleware, updateGameBacklogStatus);
router.delete('/backlog', authMiddleware, deleteGameFromBacklog);
router.get('/backlog/check', authMiddleware, isGameInBacklog);

router.post('/reviews', authMiddleware, createUserReview);
router.delete('/reviews', authMiddleware, deleteUserReview);
router.put('/reviews', authMiddleware, updateUserReview);
router.get('/reviews', authMiddleware, getUserReviews);
router.get('/reviews/:gameId', authMiddleware, getUserReviewByGameId);

router.get('/backlog', authMiddleware, getUserGameBacklog);

export default router;