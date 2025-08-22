import { GameResponse } from "../models/game.dto";
import * as favoriteRepo from "../repositories/favorite.repository";
import { ApiError } from "../utils/error";

export async function getUserFavoriteGames(userId: number, limit: number = 10, offset: number = 0): Promise<{ games: GameResponse[] }> {
  try {
    const favorites = await favoriteRepo.getFavoritesByUserId(userId, limit, offset);
    return { games: favorites };
  } catch (error) {
    throw new ApiError(500, "Failed to retrieve favorite games");
  }
}

export async function favoriteGame(userId: number, gameId: number): Promise<{ message: string, added: boolean }> {
  const added = await favoriteRepo.addFavorite(userId, gameId);
  if (added) return { message: "Game favorited", added: true };
  else return { message: "Game is already favorited", added: false };
}

export async function unfavoriteGame(userId: number, gameId: number): Promise<{ message: string }> {
  const removed = await favoriteRepo.removeFavorite(userId, gameId);
  if (!removed) throw new ApiError(400, "Game is not favorited");
  return { message: "Game unfavorited" }
}