import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import "../styles/GameDetails.css";
import Pagination from "../components/Pagination";
import { getGameById } from "../api/Games";
import type { GameAPIData } from "../api/Games";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

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

    if (isLoading) return <p>Loading games...</p>;
    if (error) return <p>Error loading games: {error.message}</p>;

    const start = (page - 1) * REVIEWS_PER_PAGE;
    const currentReviews = mockReviews.slice(start, start + REVIEWS_PER_PAGE);
    const totalPages = Math.ceil(mockReviews.length / REVIEWS_PER_PAGE);

    return (
        <>
            <Header />
            <div className="game-container">
                <div className="game-left-container">
                    <div className="game-img-container">
                        <img
                            src={data?.images ? data.images[0].url :  `https://placehold.co/300x400`}
                            className="game-cover-img"
                            alt="Game cover"
                        />
                    </div>

                    <div className="game-rating-container">
                        <h1>Ratings</h1>
                        {Object.entries(mockRatingStats.distribution)
                            .sort(([a], [b]) => Number(b) - Number(a))
                            .map(([stars, count]) => (
                                <span key={stars} className="star">
                                    {"★".repeat(Number(stars)) + "☆".repeat(5 - Number(stars))}{" "}
                                    {count}
                                </span>
                            ))}
                        <p>
                            Average Rating: {mockRatingStats.average} / 5 (
                            {mockRatingStats.totalReviews} Reviews)
                        </p>
                    </div>


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

                    <div className="review-section">
                        <h2>User Reviews</h2>

                        <button
                            className="review-btn"
                            onClick={() => setShowReviewForm(!showReviewForm)}
                        >
                            {showReviewForm ? "Cancel" : "Write a Review"}
                        </button>

                        {showReviewForm && (
                            <form className="review-form">
                                <textarea placeholder="Write your review here..." />
                                <button type="submit">Submit Review</button>
                            </form>
                        )}

                        <ul className="review-list">
                            {currentReviews.map((review) => (
                                <li key={review.id} className="review-item">
                                    <div className="review-header">
                                        <span className="review-username">{review.username}</span>
                                        <span className="review-stars">
                                            {"★".repeat(review.stars) + "☆".repeat(5 - review.stars)}
                                        </span>
                                    </div>
                                    <p>{review.text}</p>
                                    <small>
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </small>
                                </li>
                            ))}
                        </ul>

                        <Pagination onPageChange={setPage} page={page} totalPages={totalPages}></Pagination>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GameDetailsPage;


export const mockReviews: Review[] = [
    { id: 1, username: "PlayerOne", stars: 5, text: "Amazing game, loved every second!", createdAt: "2025-09-10" },
    { id: 2, username: "RPGFan", stars: 4, text: "Great story, some bugs though.", createdAt: "2025-09-12" },
    { id: 3, username: "CasualGamer", stars: 3, text: "It was okay, not bad but not great.", createdAt: "2025-09-13" },
    { id: 4, username: "Speedrunner", stars: 5, text: "Best game for speedruns!", createdAt: "2025-09-14" },
    { id: 5, username: "LoreMaster", stars: 4, text: "Loved the worldbuilding!", createdAt: "2025-09-14" },
    { id: 6, username: "BugHunter", stars: 2, text: "Crashes often, needs patches.", createdAt: "2025-09-14" },
    { id: 7, username: "IndieDev", stars: 5, text: "One of the best RPGs ever.", createdAt: "2025-09-14" },
    { id: 8, username: "NoobMaster69", stars: 1, text: "Too hard, not for me.", createdAt: "2025-09-14" },
    { id: 9, username: "RetroFan", stars: 4, text: "Reminds me of old classics.", createdAt: "2025-09-14" },
    { id: 10, username: "Collector", stars: 5, text: "Bought deluxe edition, worth it!", createdAt: "2025-09-14" },
    { id: 11, username: "StreamerGirl", stars: 5, text: "Great for streaming, my chat loved it.", createdAt: "2025-09-15" },
    { id: 12, username: "SoloPlayer", stars: 3, text: "Gets repetitive after a while.", createdAt: "2025-09-15" }
];

export const mockRatingStats: RatingStats = {
    totalReviews: 9600,
    average: 4.2,
    distribution: {
        5: 5000,
        4: 2000,
        3: 1000,
        2: 500,
        1: 100
    }
};