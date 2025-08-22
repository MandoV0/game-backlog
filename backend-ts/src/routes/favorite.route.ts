import { Router } from "express";
import { favoriteGameController, unfavoriteGameController, getFavoritesController } from "../controllers/favorite.controller";

const router = Router();

router.post("/", favoriteGameController);
router.delete("/", unfavoriteGameController);
router.get("/", getFavoritesController);

export default router;