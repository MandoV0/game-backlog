import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password } = req.body;
        const result = await userService.registerUser(username, email, password);
        res.status(201).json({ status: 'success', data: result });
    } catch (err: any) {
        next(err);
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const result = await userService.loginUser(email, password);
        res.json({ status: 'success', data: result });
    } catch (err: any) {
        next(err);
    }
};

export const addGameToBacklog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const { gameId } = req.body;
        if (!userId) throw { status: 401, message: 'Unauthorized' };

        const backlogEntry = await userService.addGameToBacklog(userId, gameId);
        res.status(201).json({ status: 'success', data: backlogEntry });
    } catch (err: any) {
        next(err);
    }
};

export const updateGameBacklogStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const { gameId, status } = req.body;
        if (!userId) throw { status: 401, message: 'Unauthorized' };

        const updatedEntry = await userService.updateGameBacklogStatus(userId, gameId, status);
        res.json({ status: 'success', data: updatedEntry });
    } catch (err: any) {
        next(err);
    }
};

export const deleteGameFromBacklog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const { gameId } = req.body;
        if (!userId) throw { status: 401, message: 'Unauthorized' };

        await userService.deleteGameFromBacklog(userId, gameId);
        res.json({ status: 'success' })
    } catch (err: any) {
        next(err);
    }   
};

export const createUserReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const { gameId, rating, reviewText, title } = req.body;
        if (!userId) throw { status: 401, message: 'Unauthorized' };

        const result = await userService.createUserReview(userId, gameId, rating, reviewText, title);
        res.status(201).json({ status: 'success', data: result });
    } catch (err: any) {
        next(err);
    }
};

export const deleteUserReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const { gameId } = req.body;
        if (!userId) throw { status: 401, message: 'Unauthorized' };

        await userService.deleteUserReview(userId, gameId);
        res.json({ status: 'success' });
    } catch (err: any) {
        next(err);
    }
};