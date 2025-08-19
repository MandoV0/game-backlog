import { Request, Response, NextFunction } from "express";
import * as favoriteService from "../services/favorite.service";
import { ApiError } from "../utils/error";

export async function favoriteGameController(req: Request, res: Response, next: NextFunction) {
  const userId = req.user?.id;
  const gameId = Number(req.params.gameId);

  if (!userId) return next(new ApiError(401, "Unauthorized"));
  if (isNaN(gameId) || gameId < 1) return next(new ApiError(400, "Invalid game ID"));

  const result = await favoriteService.favoriteGame(userId, gameId);
  res.json(result);
}

export async function unfavoriteGameController(req: Request, res: Response, next: NextFunction) {
  const userId = req.user?.id;
  const gameId = Number(req.params.gameId);

  if (!userId) return next(new ApiError(401, "Unauthorized"));
  if (isNaN(gameId) || gameId < 1) return next(new ApiError(400, "Invalid game ID"));

  const result = await favoriteService.unfavoriteGame(userId, gameId);
  res.json(result);
}