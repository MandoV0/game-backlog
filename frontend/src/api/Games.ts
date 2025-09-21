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

export interface GameReviewData {
    id: number;
    game_id: number;
    user_id: number;
    username: string;
    rating: number;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
}

export interface GameReviewResponse {
    status: string;
    data: {
        count: number;
        results: GameReviewData[];
    };
}

export interface GameReviewStatsData {
    total_reviews: number;
    average_rating: number;
    ten_star_reviews: number;
    nine_star_reviews: number;
    eight_star_reviews: number;
    seven_star_reviews: number;
    six_star_reviews: number;
    five_star_reviews: number;
    four_star_reviews: number;
    three_star_reviews: number;
    two_star_reviews: number;
    one_star_reviews: number;
    zero_star_reviews: number;
}

export interface GameReviewStatsResponse {
    status: string;
    data: GameReviewStatsData;
}

export const getGames = (limit: number = 10, offset: number = 0): Promise<GameAPIResponse> =>
    apiFetch<GameAPIResponse>(`/games?limit=${limit}&offset=${offset}`);

export const getGameById = (id: number): Promise<GameAPIData> => apiFetch(`/games/${id}`);

export const getReviews = (id: number, limit = 10, offset = 0): Promise<GameReviewResponse> => apiFetch<GameReviewResponse>(`/games/${id}/reviews?limit=${limit}&offset=${offset}`);

export const getReviewStats = (id: number): Promise<GameReviewStatsResponse> => apiFetch<GameReviewStatsResponse>(`/games/${id}/review-statistics`);

export const getUserBacklog = () => apiFetch<GameBacklogResponse>(`/users/backlog`);

export const addToBacklog = (gameId: number) => apiFetch<GameBacklogData>(`/users/backlog`, { method: "POST", body: JSON.stringify({ gameId }) });

export const removeFromBacklog = (gameId: number) => apiFetch<{ status: string }>(`/users/backlog`, { method: "DELETE", body: JSON.stringify({ gameId }) });

export const updateBacklogStatus = (gameId: number, status: string) => apiFetch<GameBacklogData>(`/users/backlog`, { method: "PUT", body: JSON.stringify({ gameId, status }) });