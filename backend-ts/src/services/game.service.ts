import * as gamesRepo from '../repositories/game.repository';
import { Game } from '../models/game.model';
import { PaginatedResult } from '../models/pagination.dto';
import { GameWithRelations, GameSearchFilters } from '../repositories/game.repository';

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

export const searchGames = async (
  filters: GameSearchFilters,
  limit: number,
  offset: number
): Promise<PaginatedResult<Game>> => {
  const { games, count } = await gamesRepo.searchGames(filters, limit, offset);

  return {
    count,
    results: games,
  };
};

export const getAllPlatforms = async () => {
  return await gamesRepo.getAllPlatforms();
};

export const getAllGenres = async () => {
  return await gamesRepo.getAllGenres();
};