import { Router } from 'express';
import { registerUser, loginUser, addGameToBacklog, deleteGameFromBacklog, updateGameBacklogStatus, createUserReview, deleteUserReview, getUserReviews } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.post('/backlog', authMiddleware, addGameToBacklog);
router.put('/backlog', authMiddleware, updateGameBacklogStatus);
router.delete('/backlog', authMiddleware, deleteGameFromBacklog);

router.post('/reviews', authMiddleware, createUserReview);
router.delete('/reviews', authMiddleware, deleteUserReview);
router.get('/reviews', authMiddleware, getUserReviews);

export default router;