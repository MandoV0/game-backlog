import { apiClient } from "./ApiClient";

export interface Game {
  gameid: number;
  title: string;
  releasedate: string;
  description: string;
  genres: string[];
  images: string[];
  isFavorite?: boolean;
}

export interface GameReview {
  reviewid: number;
  gameid: number;
  rating: number;
  review_text: string;
  review_date: string;
  userid: number;
  username: string;
}

export interface ReviewStats {
  totalReviews: number;
  oneStarReviews: number;
  twoStarReviews: number;
  threeStarReviews: number;
  fourStarReviews: number;
  fiveStarReviews: number;
  avgReview: number;
}

export interface PaginatedResponse<T> {
  games: T[];
  totalPages: number;
}

export class GameService {
  static async getGames(
    offset: number,
    limit: number
  ): Promise<PaginatedResponse<Game>> {
    return apiClient.get<PaginatedResponse<Game>>(
      `/games?offset=${offset}&limit=${limit}`
    );
  }

  static async getGameById(gameid: string): Promise<Game> {
    return apiClient.get<Game>(`/games/${gameid}`);
  }

  static async getFavorites(
    offset: number = 0,
    limit: number = 20
  ): Promise<PaginatedResponse<Game>> {
    return apiClient.get<PaginatedResponse<Game>>(
      `/favorite?offset=${offset}&limit=${limit}`
    );
  }

  static async toggleFavorite(gameId: number): Promise<void> {
    return apiClient.post(`/favorite/${gameId}`);
  }

  static async getGameReviews(gameId: string): Promise<GameReview[]> {
    return apiClient.get<GameReview[]>(`/review/${gameId}`);
  }

  static async getReviewStats(gameId: string): Promise<ReviewStats> {
    return apiClient.get<ReviewStats>(`/review/stats/${gameId}`);
  }

  static async postReview(
    gameId: string,
    rating: number,
    reviewText: string
  ): Promise<void> {
    return apiClient.post(`/review`, {
      gameid: gameId,
      rating,
      review_text: reviewText,
    });
  }
}
