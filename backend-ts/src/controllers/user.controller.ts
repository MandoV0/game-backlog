import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";
import { ApiError } from "../utils/error";

export async function getUserFavoriteGamesController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = Number(req.params.userId);
    if (!userId) return next(new ApiError(400, "Missing user ID"));

    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;

    const favorites = await userService.getUserFavoriteGames(userId, limit, offset);
    res.json(favorites);
  } catch (error) {
    next(error);
  }
}

export async function favoriteGameController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id
    const gameId = Number(req.params.gameId);
  
    if (!userId) return next(new ApiError(401, "Unauthorized"));
    if (isNaN(gameId) || gameId < 1) return next(new ApiError(400, "Invalid game ID"));
  
    const result = await userService.favoriteGame(userId, gameId);
    res.status(result.added ? 201 : 200).json({ message: result.message });
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
  
    const result = await userService.unfavoriteGame(userId, gameId);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

/** */
export async function updateUserGameStatusController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id
    const { statusId, gameId } = req.body;

    if (!userId) return next(new ApiError(401, "Unauthorized"));
    if (isNaN(gameId) || gameId < 1) return next(new ApiError(400, "Invalid game ID"));
    if (isNaN(statusId) || statusId < 1) return next(new ApiError(400, "Invalid status ID"));

    const result = await userService.updateUserGameStatus(userId, gameId, statusId);
    res.status(200);
  } catch (error) {
    next(error);
  }
}