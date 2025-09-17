import apiFetch from "./Client";

export interface GameAPIData {
    id: number;
    title: string;
    release_year?: number;
    created_at?: string;
    updated_at?: string;
    platforms?: { id: number; name: string }[];
    genres?: { id: number; name: string }[];
    images?: {
        id: number;
        url: string;
        type: string;
        game_id: number;
        description?: string;
    }[];
}

export interface GameAPIResponse {
    count: number;
    results: GameAPIData[];
}

export interface GameBacklogData {
    game_id: number;
    user_id: number;
    status: string;
    rating: number;
    started_at: string;
    finished_at: string;
    title: string;
}

export interface GameBacklogResponse {
  status: string;
  data: GameBacklogData[];
}

export const getGames = (limit: number = 10, offset: number = 0): Promise<GameAPIResponse> =>
    apiFetch<GameAPIResponse>(`/games?limit=${limit}&offset=${offset}`);

export const getGameById = (id: number): Promise<GameAPIData> => apiFetch(`/games/${id}`);

export const getReviews = (id: number, limit = 10, offset = 0) => apiFetch(`/games/${id}/reviews?limit=${limit}&offset=${offset}`);

export const getReviewStats = (id: number) => apiFetch(`/games/${id}/review-statistics`);

export const getUserBacklog = () => apiFetch<GameBacklogResponse>(`/users/backlog`); 
