import { NextFunction, Request, Response } from 'express';
import * as gameService from '../services/game.service';

export const getAllGames = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await gameService.getAllGames(limit, offset);

    res.json(result);
  } catch (err: any) {
    next(err);
  }
};

export const getGameById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ status: 'error', message: 'Invalid game ID' });
    }

    const game = await gameService.getGameById(id);
    res.json(game);
  } catch (err) {
    next(err);
  }
};