import { NextFunction, Request, Response } from 'express';
import * as userService from '../services/user.service';
import { GameStatus } from '../models/user.model';

// Auth endpoints
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Username, email, and password are required' 
      });
    }

    const result = await userService.registerUser(username, email, password);
    
    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: result.user.id,
          username: result.user.username,
          email: result.user.email,
          created_at: result.user.created_at
        },
        token: result.token
      }
    });
  } catch (err: any) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Email and password are required' 
      });
    }

    const result = await userService.loginUser(email, password);
    
    res.json({
      status: 'success',
      data: {
        user: {
          id: result.user.id,
          username: result.user.username,
          email: result.user.email,
          created_at: result.user.created_at
        },
        token: result.token
      }
    });
  } catch (err: any) {
    next(err);
  }
};

// Profile endpoints
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const profile = await userService.getUserProfile(userId);
    res.json({ status: 'success', data: profile });
  } catch (err: any) {
    next(err);
  }
};

// Backlog endpoints
export const getBacklog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const status = req.query.status as GameStatus;

    const result = await userService.getUserBacklog(userId, status, limit, offset);
    res.json({ status: 'success', data: result });
  } catch (err: any) {
    next(err);
  }
};

export const addToBacklog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const { gameId, status = 'backlog' } = req.body;

    if (!gameId) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Game ID is required' 
      });
    }

    const userGame = await userService.addGameToBacklog(userId, gameId, status);
    res.status(201).json({ status: 'success', data: userGame });
  } catch (err: any) {
    next(err);
  }
};

export const updateGameStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const gameId = parseInt(req.params.gameId);
    if (isNaN(gameId)) {
      return res.status(400).json({ status: 'error', message: 'Invalid game ID' });
    }

    const { status, rating, startedAt, finishedAt } = req.body;

    if (!status) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Status is required' 
      });
    }

    const userGame = await userService.updateGameStatus(
      userId, 
      gameId, 
      status, 
      rating, 
      startedAt, 
      finishedAt
    );
    
    res.json({ status: 'success', data: userGame });
  } catch (err: any) {
    next(err);
  }
};

export const removeFromBacklog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const gameId = parseInt(req.params.gameId);
    if (isNaN(gameId)) {
      return res.status(400).json({ status: 'error', message: 'Invalid game ID' });
    }

    await userService.removeGameFromBacklog(userId, gameId);
    res.json({ status: 'success', message: 'Game removed from backlog' });
  } catch (err: any) {
    next(err);
  }
};

// Review endpoints
export const getReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await userService.getUserReviews(userId, limit, offset);
    res.json({ status: 'success', data: result });
  } catch (err: any) {
    next(err);
  }
};

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const { gameId, title, content, rating } = req.body;

    if (!gameId) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Game ID is required' 
      });
    }

    const review = await userService.createReview(userId, gameId, title, content, rating);
    res.status(201).json({ status: 'success', data: review });
  } catch (err: any) {
    next(err);
  }
};

export const updateReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const gameId = parseInt(req.params.gameId);
    if (isNaN(gameId)) {
      return res.status(400).json({ status: 'error', message: 'Invalid game ID' });
    }

    const { title, content, rating } = req.body;

    const review = await userService.updateReview(userId, gameId, title, content, rating);
    res.json({ status: 'success', data: review });
  } catch (err: any) {
    next(err);
  }
};

export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const gameId = parseInt(req.params.gameId);
    if (isNaN(gameId)) {
      return res.status(400).json({ status: 'error', message: 'Invalid game ID' });
    }

    await userService.deleteReview(userId, gameId);
    res.json({ status: 'success', message: 'Review deleted' });
  } catch (err: any) {
    next(err);
  }
};

// Playtime tracking endpoints
export const logPlaytime = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const { gameId, playtimeMinutes, notes } = req.body;

    if (!gameId || !playtimeMinutes) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Game ID and playtime minutes are required' 
      });
    }

    const userGame = await userService.logPlaytime(userId, gameId, playtimeMinutes, notes);
    res.json({ status: 'success', data: userGame });
  } catch (err: any) {
    next(err);
  }
};

export const getPlaytimeStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const stats = await userService.getPlaytimeStats(userId);
    res.json({ status: 'success', data: stats });
  } catch (err: any) {
    next(err);
  }
};
