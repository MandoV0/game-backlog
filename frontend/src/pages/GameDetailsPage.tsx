import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import "../styles/GameDetails.css";
import { getGameById, getReviews, getReviewStats } from "../api/Games";
import type { GameAPIData, GameBacklogData, GameReviewData, GameReviewStatsData } from "../api/Games";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { GameRatingContainer } from "../components/GameRatingContainer";
import ReviewList from "../components/ReviewList";
import { isGameInBacklog, type BacklogStatusResponse } from "../api/Client";

export interface Game {
    id: number;
    name: string;
    image?: string;
    description?: string;
    releaseDate?: string;
    genre?: string;
    platform?: string;
}

export interface Review {
    id: number;
    username: string;
    stars: number;
    text: string;
    createdAt: string;
}

export interface RatingStats {
    totalReviews: number;
    average: number;
    distribution: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
}

const REVIEWS_PER_PAGE = 10;

function GameDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const gameId = Number(id);

    const [page, setPage] = useState(1);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [backlogStatus, setBacklogStatus] = useState("Wishlist");

    const { data, isLoading, error } = useQuery<GameAPIData, Error>({
        queryKey: ["game", gameId],
        queryFn: () => getGameById(gameId),
    });

    const { data: reviewStatsData, isLoading: reviewStatsLoading, error: reviewStatsError } = useQuery<GameReviewStatsData, Error>({
        queryKey: ["reviewStats", gameId],
        queryFn: async () => {
            const res = await getReviewStats(gameId);
            return res.data;
        },
    });

    const { data: reviewsData, isLoading: reviewsLoading, error: reviewsError } = useQuery<GameReviewData[], Error>({
        queryKey: ["reviews", gameId],
        queryFn: async () => {
            try {
                const res = await getReviews(gameId);
                return res.data;
            } catch (err) {
                console.error(err);
                return [];
            }
        },
    });

    const { data: backlogStatusData, isLoading: backlogStatusLoading, error: backlogStatusError } = useQuery<BacklogStatusResponse, Error>({
        queryKey: ["backlogStatus", gameId],
        queryFn: () => isGameInBacklog(gameId),
        onSuccess: (data) => {
            if (data.inBacklog && data.status) {
                const statusMap: Record<string, string> = {
                    backlog: "Wishlist",
                    playing: "Playing",
                    completed: "Completed",
                    dropped: "Dropped",
                };
                setBacklogStatus(statusMap[data.status] || "Wishlist");
            }
        },
    });



    if (backlogStatusData || backlogStatusLoading || backlogStatusError) {
        console.error("");
    }

    const handleBacklogStatusChange = async (newStatus: string) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const existing = 
    }

    if (reviewStatsLoading) return <p>Loading stats...</p>;
    if (reviewStatsError) return <p>Error loading stats: {reviewStatsError.message}</p>;

    if (isLoading) return <p>Loading games...</p>;
    if (error) return <p>Error loading games: {error.message}</p>;

    if (reviewsLoading) return <p>Loading reviews...</p>;
    if (reviewsError) return <p>Error loading reviews: {reviewsError.message}</p>;

    return (
        <>
            <Header />
            <div className="game-container">
                <div className="game-left-container">
                    <div className="game-img-container">
                        <img
                            src={data?.images ? data.images[0].url : `https://placehold.co/300x400`}
                            className="game-cover-img"
                            alt="Game cover"
                        />
                    </div>

                    <GameRatingContainer data={reviewStatsData} />

                    <div className="backlog-container">
                        <h2>Backlog</h2>
                        <select
                            value={backlogStatus}
                            onChange={(e) => setBacklogStatus(e.target.value)}
                        >
                            <option value="Wishlist">📅 Wishlist</option>
                            <option value="Playing">🎮 Playing</option>
                            <option value="Completed">✅ Completed</option>
                            <option value="Dropped">❌ Dropped</option>
                        </select>
                        <p className="backlog-status">Status: {backlogStatus}</p>
                    </div>
                </div>

                <div className="game-right-container">
                    <div className="game-info-container">
                        <h1>{data?.title} {data?.release_year}</h1>
                        <p>{data?.genres ? data?.genres[0].name : ""}</p>
                    </div>

                    <div className="media-section">
                        <h2>Media</h2>
                        <div className="media-gallery">
                            <img src="https://placehold.co/150x100" alt="screenshot1" />
                            <img src="https://placehold.co/150x100" alt="screenshot2" />
                            <img src="https://placehold.co/150x100" alt="screenshot3" />
                        </div>
                    </div>

                    <ReviewList reviews={reviewsData || []} gameId={gameId} />
                </div>
            </div>
        </>
    );
};

export default GameDetailsPage;