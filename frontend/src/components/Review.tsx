import React from "react";
import "../styles/GameDetails.css";
import { getCurrentUserId } from "../helpers/JwtHelper";

interface ReviewProps {
    reviewId: number;
    gameId: number;
    reviewTitle: string;
    reviewContent: string;
    reviewRating: number;
    reviewDate: string;
    username: string;
    userId: number;
}

const Review: React.FC<ReviewProps> = ({
    reviewId,
    gameId,
    reviewTitle,
    username,
    userId,
    reviewContent,
    reviewRating,
    reviewDate,
}) => {
    const currentUserId = getCurrentUserId();
    const isUserReview = currentUserId && userId === currentUserId;

    return (
        <li className={`review-item ${isUserReview ? 'user-review' : ''}`}>
            <div className="review-header">
                <span className="review-username">
                    {username}
                    {isUserReview && <span className="your-review-badge">(Your Review)</span>}
                </span>
                <span className="review-stars">
                    {"★".repeat(reviewRating) + "☆".repeat(10 - reviewRating)}
                </span>
            </div>
            <h4 className="review-title">{reviewTitle}</h4>
            <p className="review-content">{reviewContent}</p>
            <small className="review-date">
                {new Date(reviewDate).toLocaleDateString()}
            </small>
        </li>
    );
};

export default Review;