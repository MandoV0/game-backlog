import { usePaginatedData } from "./usePaginatedData";
import { GameService } from "../services/GameService";

export const usePaginatedGames = (pageSize?: number) =>
  usePaginatedData(GameService.getGames, 1, pageSize);

export const usePaginatedFavorites = (pageSize?: number) =>
  usePaginatedData(GameService.getFavorites, 1, pageSize);