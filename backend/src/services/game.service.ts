import * as gamesRepo from '../repositories/game.repository';
import { Game } from '../models/game.model';
import { PaginatedResult } from '../models/pagination.dto';
import { GameWithRelations } from '../repositories/game.repository';
import { GameStatusStatistics, RatingStatistics } from '../models/review.model';

export const getAllGames = async (limit: number, offset: number): Promise<PaginatedResult<Game>> => {
    const { games, count } = await gamesRepo.getAllGames(limit, offset);

    return {
        count,
        results: games,
    };
};

export const getGameById = async (id: number): Promise<GameWithRelations> => {
    return await gamesRepo.getGameById(id);
};

export const getGenres = async (): Promise<{ id: number; name: string }[]> => {
    return await gamesRepo.getAllGenres();
}

export const getPlatforms = async (): Promise<{ id: number; name: string }[]> => {
    return await gamesRepo.getAllPlatforms();
}

export const getGameReviews = async (gameId: number, limit: number = 10, offset: number = 0): Promise<any[]> => {
    if (!gameId) throw { status: 400, message: 'Game ID is required' };
    
    if (!limit) limit = 10;
    if (!offset) offset = 0;

    return await gamesRepo.getReviewsByGameId(gameId, limit, offset);
}

export const getGameReviewStatistics = async (gameId: number): Promise<RatingStatistics> => {
    if (!gameId) throw { status: 400, message: 'Game ID is required' };

    return await gamesRepo.getReviewStatisticsByGameId(gameId);
}

export const getGameStatusStatistics = async (gameId: number): Promise<GameStatusStatistics> => {
    if (!gameId) throw { status: 400, message: 'Game ID is required' };
    return await gamesRepo.getGameStatusStatistics(gameId);
}