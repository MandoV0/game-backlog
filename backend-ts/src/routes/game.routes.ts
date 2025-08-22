import { Router } from "express";
import { getGamesByIdsController, getGamesController } from "../controllers/game.controller";
import { getReviewsController, createReviewController, getRatingSummaryController, deleteReviewController } from "../controllers/review.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getGamesController);
router.get("/by-ids", getGamesByIdsController);

/* Unauthorized Routes */
router.get("/:gameId/reviews", getReviewsController);
router.get("/:gameId/reviews/summary", getRatingSummaryController);

/* Authorized Routes */
// REVIEWS
router.post("/:gameId/reviews", authMiddleware, createReviewController);
router.delete("/:gameId/reviews/:reviewId", authMiddleware, deleteReviewController);

export default router;