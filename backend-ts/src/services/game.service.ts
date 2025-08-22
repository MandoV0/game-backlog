import * as gameRepo from "../repositories/game.repository";
import { ApiError } from "../utils/error";
import { GameResponse } from "../models/game.dto";

export interface PaginatedGames {
  games: GameResponse[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Fetches a paginated list of games.
 * @param page The page number to retrieve.
 * @param pageSize The number of games per page.
 * @returns A promise that resolves to a PaginatedGames object.
 */
export async function getPaginatedGames(page: number = 1, pageSize: number = 10): Promise<PaginatedGames> {
  const offset = (page - 1) * pageSize;
  const [games, total] = await Promise.all([
    gameRepo.getGames(pageSize, offset),
    gameRepo.countGames(),
  ]);

  if (!games || games.length === 0) throw new ApiError(404, "Games not found");

  return {
    games,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getGamesByIds(gameIds: number[]): Promise<GameResponse[]> {
  const games = await gameRepo.getGamesByIds(gameIds);

  if (!games || games.length === 0) throw new ApiError(404, "Games not found");

  return games;
}