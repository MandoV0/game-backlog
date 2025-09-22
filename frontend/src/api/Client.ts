const BASE_URL = process.env.APP_API_BASE_URL || "MISSING_ENV_VAR_APP_API_BASE_URL";
/*
APP_API_BASE_URL=https://game-backlog-backend.onrender.com/api/v1
APP_API_BASE_URL=http://localhost:3000/api/v1
*/

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem("token");
    const url = `${BASE_URL}${endpoint}`;

    console.log('Making API request to:', url);
    console.log('Request options:', options);

    try {
        const res = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...options.headers,
            },
        });

        console.log('Response status:', res.status);
        console.log('Response ok:', res.ok);

        if (!res.ok) {
            const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
            console.error('API Error Response:', err);
            throw new Error(err.message || "API Error");
        }

        const data = await res.json();
        console.log('API Response data:', data);
        console.log('Response data type:', typeof data);

        return data;
    } catch (error) {
        console.error('API Fetch Error:', error);
        throw error;
    }
}

export const loginUser = (body: { email: string, password: string }): Promise<AuthSuccess> =>
    apiFetch(`/users/login`, { method: "POST", body: JSON.stringify(body) });

export const registerUser = (body: { username: string, email: string, password: string }): Promise<AuthSuccess> =>
    apiFetch(`/users/register`, { method: "POST", body: JSON.stringify(body) });

export const createReview = (body: { gameId: number, rating: number, title: string, reviewText: string }): Promise<ReviewResponse> =>
    apiFetch("/users/reviews", {
        method: "POST",
        body: JSON.stringify(body),
    });

export const updateReview = (body: { gameId: number, rating: number, title: string, reviewText: string }): Promise<ReviewResponse> =>
    apiFetch("/users/reviews", {
        method: "PUT",
        body: JSON.stringify(body),
    });

export const deleteReview = (gameId: number): Promise<{ status: string }> =>
    apiFetch("/users/reviews", {
        method: "DELETE",
        body: JSON.stringify({ gameId }),
    });

export const isGameInBacklog = (gameId: number): Promise<BacklogStatusResponse> => apiFetch(`/users/backlog/check?id=${gameId}`, { method: "GET" });

export const getUserReviewByGameId = (gameId: number): Promise<UserGameReviewResponse> =>
    apiFetch(`/users/reviews/${gameId}`, { method: "GET" });

export default apiFetch;

export interface AuthSuccess {
    status: "success";
    data: {
        user: { id: number; username: string; email: string; created_at: string };
        token: string;
    };
}

export interface BacklogStatusResponse {
    status: string;
    data: BacklogStatusData;
}

export interface BacklogStatusData {
    inBacklog: boolean;
    status?: string;
}

export interface UserGameReviewResponse {
    status: string;
    data: UserGameReviewData;
}

export interface UserGameReviewData {
    id: number;
    game_id: number;
    user_id: number;
    username: string;
    title: string;
    content: string;
    rating: number;
    created_at: string;
    updated_at: string;
    game_title?: string;
}

export interface ReviewResponse {
    status: string;
    data: UserGameReviewData;
}