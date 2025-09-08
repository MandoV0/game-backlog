import * as userRepo from '../repositories/user.repository';
import * as gameService from './game.service';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export const registerUser = async (username: string, email: string, password: string) => {
    const existingUser = await userRepo.getUserByEmail(email);
    if (existingUser) throw { status: 409, message: 'Email already in use' };
    if (!password) throw { status: 400, message: 'Password is required' };
    if (!username) throw { status: 400, message: 'Username is required' };
    if (!email) throw { status: 400, message: 'Email is required' };

    const newUser = await userRepo.createUser(username, email, password);
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

    return {
        user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            created_at: newUser.created_at
        },
        token
    };
};

export const loginUser = async (email: string, password: string) => {
    const user = await userRepo.getUserByEmail(email);
    if (!user) throw { status: 401, message: 'Invalid credentials' };

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw { status: 401, message: 'Invalid credentials' };

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return {
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            created_at: user.created_at
        },
        token
    };
}

export const addGameToBacklog = async (userId: number, gameId: number) => {
    if (!userId || !gameId) throw { status: 400, message: 'User ID and Game ID are required' };

    const game = await gameService.getGameById(gameId);
    if (!game) throw { status: 404, message: 'Game not found' };

    return await userRepo.addGameToBacklog(userId, gameId);
}

export const updateGameBacklogStatus = async (userId: number, gameId: number, status: string) => {
    if (!userId || !gameId || !status) throw { status: 400, message: 'User ID, Game ID and status are required' };

    const validStatuses = ['backlog', 'playing', 'completed', 'dropped'];
    if (!validStatuses.includes(status)) throw { status: 400, message: 'Invalid status' };

    const result = await userRepo.updateGameBacklogStatus(userId, gameId, status);
    if (!result) throw { status: 404, message: 'Game not found in backlog' };

    return result;
}

/**
 * Delete a game from user's backlog
 * @param userId The ID of the user
 * @param gameId The ID of the game
 * @returns A promise that resolves to a boolean indicating success or failure
*/
export const deleteGameFromBacklog = async (userId: number, gameId: number): Promise<boolean> => {
    if (!userId || !gameId) throw { status: 400, message: 'User ID and Game ID are required' };

    await userRepo.deleteGameFromBacklog(userId, gameId);

    return true;
}

export const createUserReview = async (userId: number, gameId: number, rating: number, reviewText: string, title: string) => {
    if (!userId || !gameId || !rating || !reviewText || !title) throw { status: 400, message: 'gameId, rating, review text, and title are required' };

    if (rating < 1 || rating > 10) throw { status: 400, message: 'Rating must be between 1 and 10' };

    return await userRepo.createUserReview(userId, gameId, rating, reviewText, title);
};

export const deleteUserReview = async (userId: number, gameId: number) => {
    if (!gameId) throw { status: 400, message: 'Game ID is required' };
    return await userRepo.deleteUserReview(userId, gameId);
}

export const getUserReviews = async (userId: number) => {
    return await userRepo.getUserReviews(userId);
}