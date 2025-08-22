import { Request, Response, NextFunction } from "express";
import * as gameService from "../services/game.service";

export async function getGamesController(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

    const result = await gameService.getPaginatedGames(page, pageSize);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getGamesByIdsController(req: Request, res: Response, next: NextFunction) {
  try {
    const gameIds = (req.query.gameIds as string)?.split(",").map(id => parseInt(id, 10)) || [];

    const result = await gameService.getGamesByIds(gameIds);
    res.json(result);
  } catch (error) {
    next(error);
  }
}