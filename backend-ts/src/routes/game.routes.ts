import { Router } from "express";
import { getGamesController } from "../controllers/game.controller";

const router = Router();

router.get("/", getGamesController);

export default router;
