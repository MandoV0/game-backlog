import { Router } from "express";
import { getUserFavoriteGamesController, favoriteGameController, unfavoriteGameController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/* AUTH ROUTES */
router.post("/favorite/:gameId", authMiddleware, favoriteGameController);
router.delete("/favorite/:gameId", authMiddleware, unfavoriteGameController);

/* NOT AUTH ROUTERS */
router.get("/:userId/favorites", getUserFavoriteGamesController);

export default router;