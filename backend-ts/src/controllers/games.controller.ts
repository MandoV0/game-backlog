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

export const searchGames = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const filters = {
      query: req.query.q as string,
      genres: req.query.genres ? (req.query.genres as string).split(',').map(Number) : undefined,
      platforms: req.query.platforms ? (req.query.platforms as string).split(',').map(Number) : undefined,
      releaseYearFrom: req.query.yearFrom ? parseInt(req.query.yearFrom as string) : undefined,
      releaseYearTo: req.query.yearTo ? parseInt(req.query.yearTo as string) : undefined,
      sortBy: req.query.sortBy as 'title' | 'release_year' | 'created_at' || 'title',
      sortOrder: req.query.sortOrder as 'asc' | 'desc' || 'asc',
    };

    const result = await gameService.searchGames(filters, limit, offset);
    res.json(result);
  } catch (err: any) {
    next(err);
  }
};

export const getPlatforms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const platforms = await gameService.getAllPlatforms();
    res.json({ status: 'success', data: platforms });
  } catch (err: any) {
    next(err);
  }
};

export const getGenres = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const genres = await gameService.getAllGenres();
    res.json({ status: 'success', data: genres });
  } catch (err: any) {
    next(err);
  }
};