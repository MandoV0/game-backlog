import { usePaginatedData } from "./usePaginatedData";
import { getGames, getFavorites } from "../services/API";

export const usePaginatedGames = (pageSize?: number) =>
  usePaginatedData(getGames, 1, pageSize);

export const usePaginatedFavorites = (pageSize?: number) =>
  usePaginatedData(getFavorites, 1, pageSize);