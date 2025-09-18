import { useState } from "react";
import "../styles/GameDetails.css";
import { type GameReviewData } from "../api/Games";
import ReviewForm from "./ReviewForm";
import Pagination from "./Pagination";

const REVIEWS_PER_PAGE = 10;

interface ReviewListProps {
    reviews?: GameReviewData[];
    gameId: number;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, gameId }) => {
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [page, setPage] = useState(1);

    // TODO: Properly implement this. API already supports pagination but i forgot to return the total count.
    const totalReviews: number = 500;
    const totalPages = Math.ceil(totalReviews / REVIEWS_PER_PAGE);

    if (!reviews || !gameId) {
        return (<></>);
    }

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
                {(reviews || []).map((review) => (
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