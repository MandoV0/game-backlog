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

export const getGenres = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const genres = await gameService.getGenres();
        res.json(genres);
    } catch (err) {
        next(err);
    }
};

export const getPlatforms = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const platforms = await gameService.getPlatforms();
        res.json(platforms);
    } catch (err) {
        next(err);
    }
};

export const getGameReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const gameId = parseInt(req.params.id);
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = parseInt(req.query.offset as string) || 0;

        const reviews = await gameService.getGameReviews(gameId, limit, offset);
        res.json({ status: 'success', data: reviews });
    } catch (err) {
        next(err);
    }
};

export const getGameReviewStatistics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const gameId = parseInt(req.params.id);
        if (isNaN(gameId)) {
            return res.status(400).json({ status: 'error', message: 'Invalid game ID' });
        }

        const statistics = await gameService.getGameReviewStatistics(gameId);
        res.json({ status: 'success', data: statistics });
    } catch (err) {
        next(err);
    }
};

export const getGameStatusStatistics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const gameId = parseInt(req.params.id);
        if (isNaN(gameId)) {
            return res.status(400).json({ status: 'error', message: 'Invalid game ID' });
        }
        const statistics = await gameService.getGameStatusStatistics(gameId);
        res.json({ status: 'success', data: statistics });
    } catch (err) {
        next(err);
    }
};