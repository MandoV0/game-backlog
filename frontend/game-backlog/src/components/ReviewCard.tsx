import React from "react";
import "../styles/Review.css";

export interface ReviewProps {
  totalReviews: number;
  oneStarReviews: number;
  twoStarReviews: number;
  threeStarReviews: number;
  fourStarReviews: number;
  fiveStarReviews: number;
  avgReview: number;
}

const ReviewCard: React.FC<ReviewProps> = ({
  totalReviews,
  oneStarReviews,
  twoStarReviews,
  threeStarReviews,
  fourStarReviews,
  fiveStarReviews,
  avgReview
}) => {
  return (
    <div className="review-card">
      <h3>Avg Rating</h3>
      <div className="avg-score">{avgReview}</div>

      <div className="stars-container">
        <div className="review-row">
          <span className="stars">★★★★★</span>
          <div className="review-bar">
            <div className="review-fill"></div>
          </div>
        </div>
        <div className="review-row">
          <span className="stars">★★★★☆</span>
          <div className="review-bar">
            <div className="review-fill"></div>
          </div>
        </div>
        <div className="review-row">
          <span className="stars">★★★☆☆</span>
          <div className="review-bar">
            <div className="review-fill"></div>
          </div>
        </div>
        <div className="review-row">
          <span className="stars">★★☆☆☆</span>
          <div className="review-bar">
            <div className="review-fill"></div>
          </div>
        </div>
        <div className="review-row">
          <span className="stars">★☆☆☆☆</span>
          <div className="review-bar">
            <div className="review-fill"></div>
          </div>
        </div>
      </div>

      <div className="total-reviews">Total Reviews: {totalReviews}</div>
    </div>
  );
};

export default ReviewCard;
