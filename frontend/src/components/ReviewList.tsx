import { useState } from "react";
import "../styles/GameDetails.css";
import { getReviews, type GameReviewData, type GameReviewResponse } from "../api/Games";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ReviewForm from "./ReviewForm";
import Pagination from "./Pagination";

const REVIEWS_PER_PAGE = 10;

interface ReviewListProps {
    gameId: number;
}

const ReviewList: React.FC<ReviewListProps> = ({ gameId }) => {
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [page, setPage] = useState(1);

    if (!gameId) {
        return (<>GameID is missing</>);
    }
    
    const { data, isLoading, error } = useQuery<GameReviewResponse, Error>({
            queryKey: ["reviews", gameId, page],
            queryFn: async () => {
                const res = await getReviews(gameId, REVIEWS_PER_PAGE, (page - 1) * REVIEWS_PER_PAGE);
                return res;
            },
    });

    const totalReviews: number = data?.data.count || 0;
    const totalPages = Math.ceil(totalReviews / REVIEWS_PER_PAGE);

    if (isLoading) return <p>Loading reviews...</p>;
    if (error) return <p>Error loading reviews: {error.message}</p>;

    return (
        <div className="review-section">
            <h2>User Reviews</h2>

            <button
                className="review-btn"
                onClick={() => setShowReviewForm(!showReviewForm)}
            >
                {showReviewForm ? "Cancel" : "Write a Review"}
            </button>

            {showReviewForm && <ReviewForm gameId={gameId} />}

            <ul className="review-list">
                {(data?.data.results || []).map((review) => (
                    <li key={review.id} className="review-item">
                        <div className="review-header">
                            <span className="review-username">{review.title}</span>
                            <span className="review-stars">
                                {"★".repeat(review.rating) + "☆".repeat(10 - review.rating)}
                            </span>
                        </div>
                        <p>{review.content}</p>
                        <small>
                            {new Date(review.created_at).toLocaleDateString()}
                        </small>
                    </li>
                ))}
            </ul>

            <Pagination onPageChange={setPage} page={page} totalPages={totalPages}></Pagination>
        </div>
    );
}

export default ReviewList;