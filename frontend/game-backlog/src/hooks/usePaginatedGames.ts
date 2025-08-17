import { usePaginatedData } from "./usePaginatedData";
import { GameService } from "../services/GameService";
import { mapGame, mapReview } from "../services/GameMapper";

export const usePaginatedGames = (pageSize?: number) =>
  usePaginatedData(GameService.getGames, 1, pageSize, mapGame);

export const usePaginatedFavorites = (pageSize?: number) =>
  usePaginatedData(GameService.getFavorites, 1, pageSize, mapGame);

/* To stupid to get it working
export const usePaginatedReviews = (gameId: string, pageSize?: number) =>
  usePaginatedDataWithId(GameService.getGameReviews, 1, pageSize, gameId, mapReview);
*/