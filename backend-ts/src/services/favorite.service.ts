import { ApiError } from "../utils/error";
import { addFavorite, removeFavorite, getFavoritesByUserId } from "../repositories/favorite.repository";

export async function favoriteGame(userId: number, gameId: number): Promise<{ message: string }> {
  const added = await addFavorite(userId, gameId);
  if (!added) throw new ApiError(400, "Game is already favorited");
  return { message: "Game favorited" }
}

export async function unfavoriteGame(userId: number, gameId: number): Promise<{ message: string }> {
  const removed = await removeFavorite(userId, gameId);
  if (!removed) throw new ApiError(400, "Game is not favorited");
  return { message: "Game unfavorited" }
}

export async function getFavoriteGames(userId: number): Promise<{ games: number[] }> {
  const userFavoriteGameIDs = await getFavoritesByUserId(userId);
  return { games: userFavoriteGameIDs };
}