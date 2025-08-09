import { Dispatch, SetStateAction } from "react";
import { Game } from "../pages/Home";
import { getFavorites, getGames } from "../services/API";

export const fetchData = async (
  page: number,
  pageSize: number,
  setGames: Dispatch<SetStateAction<Game[]>>,
  setTotalPages: Dispatch<SetStateAction<number>>,
  setError: Dispatch<SetStateAction<string | null>>,
  setLoading: Dispatch<SetStateAction<boolean>>
) => {
  try {
    setLoading(true);
    const data = await getGames((page - 1) * pageSize, pageSize);

    const mappedGames = data.results.map((game: any, index: number) => {
      const mapped = {
        gameid: game.gameid,
        title: game.title,
        description: game.description,
        genres: game.genres,
        images: game.images,
        isFavorite: game.is_favorite
      };

      //console.log(`Mapped game #${index}:`, mapped);
      return mapped;
    });

    setTotalPages(Number(Math.ceil(parseInt(data.count) / pageSize)));
    setGames(mappedGames);
  } catch (err: any) {
    setError(err.message || 'Failed to load games');
  } finally {
    setLoading(false);
  }
};

export const fetchFavorites = async (
  page: number,
  pageSize: number,
  setGames: Dispatch<SetStateAction<Game[]>>,
  setTotalPages: Dispatch<SetStateAction<number>>,
  setError: Dispatch<SetStateAction<string | null>>,
  setLoading: Dispatch<SetStateAction<boolean>>
) => {
  try {
    setLoading(true);
    const data = await getFavorites((page - 1) * pageSize, pageSize);

    const mappedGames = data.results.map((game: any, index: number) => {
      const mapped = {
        gameid: game.gameid,
        title: game.title,
        description: game.description,
        genres: game.genres,
        images: game.images,
        isFavorite: game.is_favorite
      };

      return mapped;
    });

    setTotalPages(Number(Math.ceil(parseInt(data.count) / pageSize)));
    setGames(mappedGames);
  } catch (err: any) {
    setError(err.message || 'Failed to load games');
  } finally {
    setLoading(false);
  }
};
