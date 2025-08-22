import { Request, Response, NextFunction } from "express";
import * as favoriteService from "../services/favorite.service";
import { ApiError } from "../utils/error";

export async function favoriteGameController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id
    const gameId = Number(req.params.gameId);
  
    if (!userId) return next(new ApiError(401, "Unauthorized"));
    if (isNaN(gameId) || gameId < 1) return next(new ApiError(400, "Invalid game ID"));
  
    const result = await favoriteService.favoriteGame(userId, gameId);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function unfavoriteGameController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id
    const gameId = Number(req.params.gameId);
  
    if (!userId) return next(new ApiError(401, "Unauthorized"));
    if (isNaN(gameId) || gameId < 1) return next(new ApiError(400, "Invalid game ID"));
  
    const result = await favoriteService.unfavoriteGame(userId, gameId);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Get all favorite games for the authenticated user
 * @param req 
 * @param res 
 * @param next 
 */
export async function getFavoritesController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new ApiError(401, "Unauthorized"));

    const favorites = await favoriteService.getFavoriteGames(userId);
    res.json(favorites);
  } catch (error) {
    next(error);
  }
}